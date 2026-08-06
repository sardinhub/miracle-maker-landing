export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Karena belum ada Cloud DB (Supabase), kita biarkan saja API ini menerima data
    // lalu mengembalikan respons "Sukses" palsu agar Frontend tidak error (404).
    
    return res.status(200).json({ 
        success: true, 
        message: 'Sync OK (Mock - Cloud DB belum aktif)' 
    });
}
