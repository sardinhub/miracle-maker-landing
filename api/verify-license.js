export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Kode diperlukan.' });
    }

    const upperCode = code.trim().toUpperCase();

    // Validasi Pola Sementara (Karena Cloud Database belum dipasang)
    // Jika kodenya MIRACLE21 atau sesuai format NQMT-XXXX, maka lolos.
    const isValid = /^NQMT-[A-Z0-9]{4,}$/.test(upperCode) || upperCode === 'MIRACLE21';

    if (isValid) {
        return res.status(200).json({ 
            success: true, 
            message: 'Lisensi Valid!',
            data: {} // Data kosong sampai Supabase/Firebase dipasang
        });
    } else {
        return res.status(404).json({ error: 'Kode lisensi salah atau tidak valid.' });
    }
}
