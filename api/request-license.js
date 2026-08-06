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
    const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: 'Sistem Database (Vercel KV) belum diaktifkan di Dashboard Vercel Anda.' });
    }

    // Generate kode unik acak
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = 'NQMT-';
    for (let i = 0; i < 5; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
        // 1. Simpan Kode ke Database Vercel KV menggunakan sintaks Standar Upstash
        const kvRes = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(["SET", newCode, JSON.stringify({ phone: phone, status: 'pending' })])
        });

        let kvData;
        try {
            kvData = await kvRes.json();
        } catch (e) {
            console.error('KV JSON Parse Error:', e);
            return res.status(500).json({ error: 'Gagal mengurai respons dari Upstash database.' });
        }
        
        if (kvData.error) {
            console.error('KV Error:', kvData.error);
            return res.status(500).json({ error: 'Gagal menyimpan ke database Upstash: ' + kvData.error });
        }

        // 2. Siapkan pesan untuk dikirim ke WhatsApp Admin
        const message = `*🔔 PERMINTAAN LISENSI BARU!*\n\n*Nomor Pemohon:* ${phone}\n*Kode Akses:* ${newCode}\n*Status:* PENDING (Vercel KV)\n\n_Pesan Otomatis: Segera hubungi pemohon di nomor tersebut untuk proses pembayaran. Jika sudah lunas, berikan kode tersebut kepada mereka._`;

        // 3. Kirim ke Fonnte
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': FONNTE_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target: ADMIN_PHONE,
                message: message
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Fonnte JSON Parse Error:', e);
            // Tetap kembalikan pesan sukses atau error Fonnte
            // karena kadang Fonnte membalas text/html saat gangguan
            return res.status(500).json({ error: 'Fonnte mengembalikan format yang tidak valid. Sistem gagal memproses pengiriman.' });
        }

        if (data.status) {
            return res.status(200).json({ success: true, message: 'Permohonan berhasil dikirim ke WA Admin.' });
        } else {
            return res.status(500).json({ error: 'Fonnte menolak permintaan pengiriman pesan: ' + (data.reason || 'Alasan tidak diketahui.') });
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server: ' + (error.message || error) });
    }
}
