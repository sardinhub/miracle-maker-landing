const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sajikan file statis (HTML, CSS, JS) dari folder saat ini
app.use(express.static(path.join(__dirname)));

// 1. Inisialisasi Database SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Gagal terhubung ke SQLite:', err.message);
    else console.log('Terhubung ke database SQLite lokal.');
});

// Buat Tabel jika belum ada
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS licenses (
        code TEXT PRIMARY KEY,
        phone TEXT,
        status TEXT,
        audit_data TEXT,
        tracker_data TEXT,
        journal_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Konfigurasi API Fonnte
const FONNTE_TOKEN = 'Piig8U6z7qGZvTiq1jaa';
const ADMIN_PHONE = '6281354581418'; // Nomor WA Admin

// Fungsi Generate Kode Acak
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NQMT-';
    for(let i=0; i<5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// =====================================
// ENDPOINTS API
// =====================================

// 2. Endpoint Minta Kode Akses
app.post('/api/request-license', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Nomor WA diperlukan.' });

    const newCode = generateCode();

    // Simpan ke DB status pending
    db.run(`INSERT INTO licenses (code, phone, status) VALUES (?, ?, 'pending')`, [newCode, phone], async (err) => {
        if (err) return res.status(500).json({ error: 'Gagal menyimpan ke database. Mungkin nomor ini sudah mendaftar? Coba hubungi Admin.' });

        // Kirim WA via Fonnte ke Admin (BUKAN ke user)
        // Admin akan diinfokan ada pesanan masuk, lalu Admin akan membalas ke nomor user
        const message = `*🔔 PERMINTAAN LISENSI BARU!*\n\n*Nomor Pemohon:* ${phone}\n*Kode Akses:* ${newCode}\n*Status:* PENDING\n\n_Pesan Otomatis: Hubungi pemohon untuk proses pembayaran. Jika sudah lunas, berikan kode tersebut kepada mereka._`;
        
        try {
            await axios.post('https://api.fonnte.com/send', {
                target: ADMIN_PHONE,
                message: message
            }, {
                headers: {
                    'Authorization': FONNTE_TOKEN
                }
            });
            res.json({ success: true, message: 'Permohonan berhasil dikirim secara otomatis ke WA Admin.' });
        } catch (error) {
            console.error('Fonnte Error:', error.response ? error.response.data : error.message);
            // Tetap anggap sukses di DB tapi peringatkan gagal kirim WA
            res.status(500).json({ error: 'Gagal mengirim notifikasi WA ke Admin, tapi kode berhasil dicatat di sistem.' });
        }
    });
});

// 3. Endpoint Verifikasi Kode (Login/Aktivasi)
app.post('/api/verify-license', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Kode diperlukan.' });

    // Master Key (Tanpa Database)
    if (code === 'MIRACLE21') {
        return res.json({ success: true, isMaster: true });
    }

    // Cek di DB
    db.get(`SELECT * FROM licenses WHERE code = ?`, [code], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Kode tidak ditemukan atau tidak valid.' });
        
        // Aktifkan lisensi secara otomatis jika pertama kali digunakan
        if (row.status === 'pending') {
            db.run(`UPDATE licenses SET status = 'active' WHERE code = ?`, [code]);
            row.status = 'active';
        }

        res.json({ success: true, data: row });
    });
});

// 4. Endpoint Sinkronisasi Data (Penyimpanan Jurnal/Tracker/Audit ke DB)
app.post('/api/sync', (req, res) => {
    const { code, type, data } = req.body;
    if (!code || !type) return res.status(400).json({ error: 'Parameter tidak lengkap' });

    // Master key nggak disimpan ke DB
    if (code === 'MIRACLE21') return res.json({ success: true, message: 'Master key, lokal only' });

    let column = '';
    if (type === 'audit') column = 'audit_data';
    else if (type === 'tracker') column = 'tracker_data';
    else if (type === 'journal') column = 'journal_data';
    else return res.status(400).json({ error: 'Tipe data tidak valid' });

    db.run(`UPDATE licenses SET ${column} = ? WHERE code = ?`, [JSON.stringify(data), code], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

// =====================================
// SERVER START
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
    console.log(`📚 Untuk membuka Ruang Komando, buka browser Anda ke URL di atas.`);
});
