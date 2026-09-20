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

    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Kode diperlukan.' });
    }

    const upperCode = code.trim().toUpperCase();

    // Master Key (tidak perlu database)
    if (upperCode === 'MIRACLE21') {
        return res.status(200).json({ success: true, message: 'Master Key Valid!', data: {} });
    }

    // Validasi env variable Firebase
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        return res.status(500).json({ error: 'Konfigurasi Firebase belum diset di Environment Variables Vercel.' });
    }

    try {
        // Cek kode lisensi di Firestore
        const docRef = db.collection('licenses').doc(upperCode);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Kode lisensi salah atau belum terdaftar di sistem.' });
        }

        const licenseData = docSnap.data();

        // Aktifkan lisensi jika masih pending (pertama kali dipakai)
        if (licenseData.status === 'pending') {
            await docRef.update({ status: 'active' });
            licenseData.status = 'active';
        }

        return res.status(200).json({
            success: true,
            message: 'Lisensi Valid!',
            data: licenseData,
        });

    } catch (error) {
        console.error('Firebase/System Error:', error);
        return res.status(500).json({ error: 'Gagal terhubung ke database: ' + (error.message || error) });
    }
}
