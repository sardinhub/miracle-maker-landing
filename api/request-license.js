import axios from 'axios';
import admin from 'firebase-admin';

// Inisialisasi Firebase Admin SDK (aman untuk dipanggil berkali-kali di serverless)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Vercel menyimpan private key dengan \n sebagai literal string, perlu di-replace
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

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

    // Validasi env variable Firebase
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        return res.status(500).json({ error: 'Konfigurasi Firebase belum diset di Environment Variables Vercel.' });
    }

    // Generate kode unik acak
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = 'NQMT-';
    for (let i = 0; i < 5; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
        // 1. Simpan kode ke Firestore
        await db.collection('licenses').doc(newCode).set({
            phone: phone,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 2. Siapkan pesan WA untuk Admin
        const message = `*🔔 PERMINTAAN LISENSI BARU!*\n\n*Nomor Pemohon:* ${phone}\n*Kode Akses:* ${newCode}\n*Status:* PENDING (Firebase)\n\n_Pesan Otomatis: Segera hubungi pemohon di nomor tersebut untuk proses pembayaran. Jika sudah lunas, berikan kode tersebut kepada mereka._`;

        // 3. Kirim notifikasi ke WA Admin via Fonnte
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
            if (e.response && e.response.data) {
                data = e.response.data;
            } else {
                return res.status(500).json({ error: 'Gagal menghubungi server Fonnte: ' + e.message });
            }
        }

        if (data && data.status) {
            return res.status(200).json({ success: true, message: 'Permohonan berhasil dikirim ke WA Admin.' });
        } else {
            return res.status(500).json({ error: 'Fonnte menolak permintaan: ' + (data ? data.reason : 'Alasan tidak diketahui.') });
        }

    } catch (error) {
        console.error('Firebase/System Error:', error);
        return res.status(500).json({ error: 'Koneksi ke database gagal: ' + (error.message || error) });
    }
}
