export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Kode diperlukan.' });
    }

    const upperCode = code.trim().toUpperCase();

    // Master Key (Tidak perlu database)
    if (upperCode === 'MIRACLE21') {
        return res.status(200).json({ success: true, message: 'Master Key Valid!', data: {} });
    }

    const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: 'Database belum siap.' });
    }

    try {
        // Cek apakah kode ada di Vercel KV menggunakan sintaks Standar Upstash
        const response = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(["GET", upperCode])
        });
        
        const data = await response.json();
        
        // data.result akan bernilai null jika kunci tidak ditemukan
        if (data.result) {
            // Opsional: Jika status masih pending, kita bisa ubah ke active
            return res.status(200).json({ 
                success: true, 
                message: 'Lisensi Valid!',
                data: typeof data.result === 'string' ? JSON.parse(data.result) : data.result
            });
        } else {
            return res.status(404).json({ error: 'Kode lisensi salah atau belum terdaftar di sistem.' });
        }
    } catch (error) {
        console.error('KV Fetch Error:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server database.' });
    }
}
