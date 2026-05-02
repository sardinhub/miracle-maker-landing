export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Nomor WA diperlukan.' });
    }

    const FONNTE_TOKEN = 'Piig8U6z7qGZvTiq1jaa';
    const ADMIN_PHONE = '6281354581418';

    // Generate kode unik acak
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = 'NQMT-';
    for (let i = 0; i < 5; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Siapkan pesan untuk dikirim ke WhatsApp Admin
    const message = `*🔔 PERMINTAAN LISENSI BARU!*\n\n*Nomor Pemohon:* ${phone}\n*Kode Akses:* ${newCode}\n*Status:* PENDING (Vercel Serverless)\n\n_Pesan Otomatis: Segera hubungi pemohon di nomor tersebut untuk proses pembayaran. Jika sudah lunas, berikan kode tersebut kepada mereka._`;

    try {
        // Menggunakan native fetch bawaan Node 18+ (Vercel Default)
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

        const data = await response.json();

        if (data.status) {
            return res.status(200).json({ success: true, message: 'Permohonan berhasil dikirim ke WA Admin.' });
        } else {
            console.error('Fonnte Error Data:', data);
            return res.status(500).json({ error: 'Fonnte menolak permintaan pengiriman pesan.' });
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server saat menghubungi Fonnte.' });
    }
}
