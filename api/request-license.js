import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Nomor WA diperlukan.' });
    }

    const FONNTE_TOKEN = 'Piig8U6z7qGZvTiq1jaa';
    const ADMIN_PHONE = '6281354581418';

    // Mendukung Vercel KV versi lama atau Upstash Redis versi baru
    let KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: 'Sistem Database (Vercel KV) belum diaktifkan di Dashboard Vercel Anda.' });
    }
    
    // Pastikan URL valid
    if (!KV_URL.startsWith('http')) {
        KV_URL = 'https://' + KV_URL;
    }

    // Generate kode unik acak
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = 'NQMT-';
    for (let i = 0; i < 5; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
        // 1. Simpan Kode ke Database Vercel KV menggunakan sintaks Standar Upstash
        let kvData;
        try {
            const kvRes = await axios.post(`${KV_URL}`, 
                ["SET", newCode, JSON.stringify({ phone: phone, status: 'pending' })],
                {
                    headers: {
                        'Authorization': `Bearer ${KV_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            kvData = kvRes.data;
        } catch (e) {
            console.error('KV Request Error:', e.message);
            return res.status(500).json({ error: 'Koneksi ke database gagal: ' + e.message });
        }
        
        if (kvData.error) {
            console.error('KV Error:', kvData.error);
            return res.status(500).json({ error: 'Gagal menyimpan ke database Upstash: ' + kvData.error });
        }

        // 2. Siapkan pesan untuk dikirim ke WhatsApp Admin
        const message = `*🔔 PERMINTAAN LISENSI BARU!*\n\n*Nomor Pemohon:* ${phone}\n*Kode Akses:* ${newCode}\n*Status:* PENDING (Vercel KV)\n\n_Pesan Otomatis: Segera hubungi pemohon di nomor tersebut untuk proses pembayaran. Jika sudah lunas, berikan kode tersebut kepada mereka._`;

        // 3. Kirim ke Fonnte
        let data;
        try {
            const response = await axios.post('https://api.fonnte.com/send', {
                target: ADMIN_PHONE,
                message: message
            }, {
                headers: {
                    'Authorization': FONNTE_TOKEN,
                    'Content-Type': 'application/json'
                }
            });
            data = response.data;
        } catch (e) {
            console.error('Fonnte Request Error:', e.message);
            // Tetap kembalikan pesan sukses atau error Fonnte
            // karena kadang Fonnte membalas error status tapi pesan terkirim
            if (e.response && e.response.data) {
                data = e.response.data;
            } else {
                return res.status(500).json({ error: 'Gagal menghubungi server Fonnte: ' + e.message });
            }
        }

        if (data && data.status) {
            return res.status(200).json({ success: true, message: 'Permohonan berhasil dikirim ke WA Admin.' });
        } else {
            return res.status(500).json({ error: 'Fonnte menolak permintaan pengiriman pesan: ' + (data ? data.reason : 'Alasan tidak diketahui.') });
        }
    } catch (error) {
        console.error('System Error:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada sistem: ' + (error.message || error) });
    }
}
