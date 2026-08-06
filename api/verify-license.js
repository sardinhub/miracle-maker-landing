import axios from 'axios';

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

    let KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: 'Database belum siap.' });
    }
    
    // Pastikan URL valid
    if (!KV_URL.startsWith('http')) {
        KV_URL = 'https://' + KV_URL;
    }

    try {
        // Cek apakah kode ada di Vercel KV menggunakan sintaks Standar Upstash
        let data;
        try {
            const response = await axios.post(`${KV_URL}`, 
                ["GET", upperCode],
                {
                    headers: {
                        'Authorization': `Bearer ${KV_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            data = response.data;
        } catch (e) {
            console.error('KV Request Error:', e.message);
            return res.status(500).json({ error: 'Gagal terhubung ke Upstash database: ' + e.message });
        }

        // Jika Upstash mengembalikan pesan error (misalnya Unauthorized)
        if (data.error) {
            return res.status(500).json({ error: 'Upstash Error: ' + data.error });
        }
        
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
        console.error('KV System Error:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada sistem: ' + (error.message || error) });
    }
}
