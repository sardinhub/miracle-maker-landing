document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Intersection Observer for Scroll Animations
    // ==========================================
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, observerOptions);
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => observer.observe(el));

    // ==========================================
    // 2. Data & Logic for 4 Dimensions Modal
    // ==========================================
    const dimensionData = {
        context: {
            color: 'var(--ctx-color)', title: 'Context', subtitle: 'Lingkungan Belajar',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
            html: `<div class="dim-article">
                    <p><strong>Menatap Realita:</strong> Di banyak sekolah kita saat ini, ruang kelas masih dirancang sebagai "pabrik kepatuhan". Banyak anak datang ke sekolah membawa luka dari rumah, namun dihadapkan pada lingkungan belajar yang dingin.</p>
                    <p><strong>Pendekatan Miracle Maker:</strong> Guru memahami bahwa lingkungan (Context) adalah guru ketiga. Solusinya dimulai dari empati dan menciptakan <em>Psychologically Safe Environment</em>.</p>
                    <p><strong>Praktik Terapan:</strong> Mulailah hari dengan "Check-in Perasaan". Ubah susunan meja menjadi formasi melingkar untuk menumbuhkan rasa kesetaraan.</p>
                    <div class="quote-block">"Kelas bukanlah tempat mencetak anak pintar menjawab ujian, melainkan taman di mana jiwa-jiwa kecil mekar karena merasa diterima."</div>
                </div>`
        },
        content: {
            color: 'var(--cnt-color)', title: 'Content', subtitle: 'Materi & Strategi',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
            html: `<div class="dim-article">
                    <p><strong>Menatap Realita:</strong> Seringkali siswa bergumam, "Untuk apa saya mempelajari ini?". Materi disuapkan seragam tanpa konteks relevan.</p>
                    <p><strong>Pendekatan Miracle Maker:</strong> Bergeser dari "apa yang dihafal" menjadi "masalah apa yang diselesaikan". Gunakan pembelajaran kontekstual dan diferensiasi.</p>
                    <p><strong>Praktik Terapan:</strong> Kaitkan algoritma FYP TikTok dengan statistik. Hadirkan <em>Project-Based Learning</em> yang membebaskan siswa memilih cara menyelesaikan misi.</p>
                    <div class="quote-block">"Materi yang terhubung denyut nadi siswa tidak akan menguap setelah ujian; ia menetap menjadi kebijaksanaan abadi."</div>
                </div>`
        },
        character: {
            color: 'var(--chr-color)', title: 'Character', subtitle: 'Karakter & Hubungan',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
            html: `<div class="dim-article">
                    <p><strong>Menatap Realita:</strong> Burnout administratif membuat guru sekadar menjadi "evaluator", bukan "mentor". Hubungan menjadi transaksional.</p>
                    <p><strong>Pendekatan Miracle Maker:</strong> Pendidikan adalah menyentuh hati sebelum pikiran <em>(Connect before Correct)</em>. Karakter ditularkan melalui keteladanan.</p>
                    <p><strong>Praktik Terapan:</strong> Luangkan 5 menit untuk ngobrol 1-on-1 dari hati ke hati. Jangan ragu menunjukkan kerentanan bahwa Anda juga manusia yang bisa salah.</p>
                    <div class="quote-block">"Anak tidak peduli deretan gelar Anda, sampai mereka tahu seberapa besar Anda peduli pada mereka."</div>
                </div>`
        },
        skills: {
            color: 'var(--skl-color)', title: 'Skills', subtitle: 'Kompetensi Masa Depan',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
            html: `<div class="dim-article">
                    <p><strong>Menatap Realita:</strong> Sistem mencetak lulusan pematuhi instruksi, namun gagap saat dihadapkan pada situasi nyata yang ambigu.</p>
                    <p><strong>Pendekatan Miracle Maker:</strong> Keterampilan 4C, ketangguhan (resilience), dan adaptabilitas quantum adalah senjata utama mereka dekade depan.</p>
                    <p><strong>Praktik Terapan:</strong> Berikan <em>open-ended problems</em>. Biarkan mereka berdebat dan mengalami kegagalan aman di kelas sebagai batu pijakan.</p>
                    <div class="quote-block">"Tugas kita bukan membekali jawaban masa lalu, melainkan kemampuan merumuskan pertanyaan untuk masa depan."</div>
                </div>`
        }
    };

    const modalOverlay = document.getElementById('dim-modal');
    const modalClose = document.getElementById('modal-close');
    
    document.querySelectorAll('.matrix-card').forEach(card => {
        card.addEventListener('click', () => {
            const data = dimensionData[card.dataset.dim];
            if (data) {
                document.querySelector('.modal-box').style.setProperty('--modal-accent', data.color);
                document.getElementById('modal-title').textContent = data.title;
                document.getElementById('modal-subtitle').textContent = data.subtitle;
                document.getElementById('modal-icon').innerHTML = data.icon;
                document.getElementById('modal-body').innerHTML = data.html;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeDimModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => document.body.style.overflow = 'auto', 300);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
    modalClose.addEventListener('click', closeDimModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeDimModal(); });

    // ==========================================
    // 3. QuantumGuide AI Chat
    // ==========================================
    const chatWindow = document.getElementById('ai-chat-window');
    document.getElementById('ai-fab').addEventListener('click', () => chatWindow.classList.toggle('active'));
    document.getElementById('close-chat').addEventListener('click', () => chatWindow.classList.remove('active'));

    // ==========================================
    // 4. Command Center "Mulai Transformasi"
    // ==========================================
    const cmdOverlay = document.getElementById('command-center');
    const btnMulai = document.getElementById('btn-mulai-transformasi');
    const btnCloseCmd = document.getElementById('close-cmd');

    btnMulai.addEventListener('click', () => {
        // Reset state (localStorage) setiap kali Ruang Komando diakses
        localStorage.removeItem('nqmt_audit_completed');
        localStorage.removeItem('nqmt_profile');
        localStorage.removeItem('nqmt_tracker');
        localStorage.removeItem('nqmt_journal');
        // nqmt_premium dan nqmt_premium_key TIDAK DIHAPUS agar berfungsi sebagai password permanen

        // Kembalikan UI Audit ke keadaan awal
        document.getElementById('audit-wizard').classList.remove('hidden');
        document.getElementById('audit-result').classList.add('hidden');

        cmdOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Render ulang semua konten secara dinamis
        renderAudit();
        renderTracker();
        renderJournal();
        if(typeof updateSidebarLicenseBtn === 'function') updateSidebarLicenseBtn();

        // Pastikan Tab yang aktif pertama kali adalah Audit Frekuensi
        window.switchCmdTab('cmd-audit');
    });

    btnCloseCmd.addEventListener('click', () => {
        cmdOverlay.classList.remove('active');
        setTimeout(() => document.body.style.overflow = 'auto', 500);
    });

    const btnSidebarLicense = document.getElementById('btn-sidebar-license');
    if (btnSidebarLicense) {
        btnSidebarLicense.addEventListener('click', () => {
            const isPremium = localStorage.getItem('nqmt_premium') === 'true';
            if (isPremium) {
                const key = localStorage.getItem('nqmt_premium_key') || 'MIRACLE21';
                showToast(`Lisensi Aktif! Kode Sandi Anda: ${key}`);
            } else {
                showPremiumWarning();
            }
        });
    }

    // Perbarui teks tombol sidebar berdasarkan status
    function updateSidebarLicenseBtn() {
        if (!btnSidebarLicense) return;
        if (localStorage.getItem('nqmt_premium') === 'true') {
            btnSidebarLicense.textContent = '✨ Lisensi Aktif';
            btnSidebarLicense.style.borderColor = 'var(--success)';
            btnSidebarLicense.style.color = 'var(--success)';
        } else {
            btnSidebarLicense.textContent = '🔑 Masukkan Kode Lisensi';
            btnSidebarLicense.style.borderColor = 'var(--gold-primary)';
            btnSidebarLicense.style.color = 'var(--gold-primary)';
        }
    }

    // Tab Switching Logic
    const navBtns = document.querySelectorAll('.cmd-nav-btn');
    const cmdSections = document.querySelectorAll('.cmd-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            cmdSections.forEach(s => s.classList.add('hidden'));
            cmdSections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            targetSection.classList.remove('hidden');
            // Allow display block to apply before adding animation class
            setTimeout(() => targetSection.classList.add('active'), 10);
        });
    });

    // Expose switch to window for inline HTML onclick handlers
    window.switchCmdTab = function(targetId) {
        const targetBtn = document.querySelector(`.cmd-nav-btn[data-target="${targetId}"]`);
        if (targetBtn) targetBtn.click();
    };

    // --- A. Audit Frekuensi Logic ---
    const auditQuestionPool = [
        { q: "Seberapa sering Anda merasa lelah secara emosional (burnout) sebelum jam pulang sekolah?", opts: [{t: "Sangat sering, terasa menguras energi", v: 1}, {t: "Kadang-kadang, tergantung kondisi siswa", v: 2}, {t: "Jarang, saya bisa mengelola energi dengan baik", v: 3}] },
        { q: "Ketika ada siswa yang gaduh di kelas, apa reaksi pertama Anda?", opts: [{t: "Menegur keras agar kelas kembali kondusif", v: 1}, {t: "Meminta mereka diam dengan tegas", v: 2}, {t: "Mencari tahu penyebab kegelisahan mereka (Pacing)", v: 3}] },
        { q: "Seberapa jauh Anda mengenal latar belakang emosional siswa Anda?", opts: [{t: "Hanya tahu nama dan nilai mereka", v: 1}, {t: "Tahu secara umum dari laporan wali kelas", v: 2}, {t: "Sangat mengenali keunikan dan beban yang mereka bawa", v: 3}] },
        { q: "Jika rencana pelajaran Anda tiba-tiba berantakan karena gangguan eksternal, bagaimana respons internal Anda?", opts: [{t: "Sangat frustrasi dan panik", v: 1}, {t: "Sedikit kesal tapi mencoba lanjut", v: 2}, {t: "Tenang dan langsung beradaptasi secara dinamis", v: 3}] },
        { q: "Seberapa sering Anda membawa masalah pribadi ke dalam ruang kelas secara tidak sadar?", opts: [{t: "Sering memengaruhi mood saya mengajar", v: 1}, {t: "Kadang-kadang saat sedang sangat lelah", v: 2}, {t: "Hampir tidak pernah, saya mengkalibrasi diri sebelum masuk kelas", v: 3}] },
        { q: "Apakah Anda mengetahui apa yang paling ditakuti oleh siswa yang duduk di barisan paling belakang?", opts: [{t: "Tidak tahu sama sekali", v: 1}, {t: "Mungkin mereka takut disuruh maju", v: 2}, {t: "Saya tahu persis rasa tidak percaya diri yang mereka sembunyikan", v: 3}] },
        { q: "Ketika seorang siswa terus-menerus menantang otoritas Anda, apa yang Anda rasakan di dalam diri?", opts: [{t: "Merasa terancam secara personal", v: 1}, {t: "Terpancing untuk membuktikan siapa yang berkuasa", v: 2}, {t: "Menyadari itu adalah proyeksi luka atau masalah dari rumahnya", v: 3}] },
        { q: "Berapa banyak waktu yang Anda luangkan khusus untuk membangun koneksi di luar materi dengan siswa?", opts: [{t: "Hampir tidak ada, fokus pada target kurikulum", v: 1}, {t: "Hanya sesekali jika ada sisa waktu", v: 2}, {t: "Rutin, saya menganggap koneksi (Entrainment) adalah fondasi materi", v: 3}] },
        { q: "Bagaimana Anda menempatkan diri Anda di mata siswa?", opts: [{t: "Sebagai figur otoritas yang harus ditakuti", v: 1}, {t: "Sebagai pengajar dan penyalur materi/buku", v: 2}, {t: "Sebagai mentor, pendengar, sekaligus penggerak energi kelas", v: 3}] }
    ];
    let currentActiveQuestions = [];
    let auditAnswers = {};

    function renderAudit() {
        auditAnswers = {}; // Reset jawaban sebelumnya
        const wizard = document.getElementById('audit-wizard');
        const isCompleted = localStorage.getItem('nqmt_audit_completed');
        
        if (isCompleted) {
            wizard.classList.add('hidden');
            showAuditResult(localStorage.getItem('nqmt_profile') || 'The Catalyst');
            return;
        }

        // Acak pool pertanyaan dan ambil 3 secara dinamis
        let shuffledPool = [...auditQuestionPool].sort(() => 0.5 - Math.random());
        currentActiveQuestions = shuffledPool.slice(0, 3);

        wizard.innerHTML = '';
        currentActiveQuestions.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'audit-question';
            div.innerHTML = `<h4>Pertanyaan ${index + 1}: ${item.q}</h4><div class="audit-options"></div>`;
            
            const optContainer = div.querySelector('.audit-options');
            item.opts.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'audit-opt-btn';
                btn.textContent = opt.t;
                btn.onclick = () => handleAuditAnswer(btn, optContainer, opt.v, div, index);
                optContainer.appendChild(btn);
            });
            wizard.appendChild(div);
        });
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn btn-primary mt-3 w-100';
        submitBtn.textContent = 'Analisis Profil Saya';
        submitBtn.onclick = finishAudit;
        wizard.appendChild(submitBtn);
    }

    function handleAuditAnswer(btn, container, value, questionDiv, qIndex) {
        container.querySelectorAll('.audit-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        auditAnswers[qIndex] = value;
    }

    function finishAudit() {
        if (Object.keys(auditAnswers).length < currentActiveQuestions.length) {
            alert('Mohon jawab semua pertanyaan.');
            return;
        }
        let total = Object.values(auditAnswers).reduce((a, b) => a + b, 0);
        let profile = "The Observer";
        if (total > 5) profile = "The Catalyst";
        if (total > 7) profile = "The Alchemist (Miracle Maker)";
        
        localStorage.setItem('nqmt_audit_completed', 'true');
        localStorage.setItem('nqmt_profile', profile);
        if(typeof syncToServer === 'function') syncToServer('audit', { completed: true, profile: profile });
        document.getElementById('audit-wizard').classList.add('hidden');
        showAuditResult(profile);
    }

    function showAuditResult(profile) {
        document.getElementById('audit-result').classList.remove('hidden');
        document.getElementById('profile-name').textContent = profile;
        
        let desc = "";
        if (profile === "The Observer") desc = "Anda memiliki pengamatan tajam terhadap dinamika kelas, namun masih menggunakan pendekatan kedisiplinan tradisional. Mulailah berlatih empati untuk membuka koneksi hati siswa.";
        else if (profile === "The Catalyst") desc = "Anda sudah menyadari pentingnya empati dan koneksi emosional. Siswa merasa cukup nyaman, langkah selanjutnya adalah meningkatkan intensitas (Immersion) dalam metode mengajar Anda.";
        else desc = "Luar biasa! Anda memiliki tingkat Neuro-Coherence yang stabil dan kemampuan Entrainment yang kuat. Anda adalah magnet energi positif bagi siswa Anda. Lanjutkan menebar keajaiban!";
        
        document.getElementById('profile-desc').textContent = desc;
    }

    // --- B. 21-Day Tracker Logic ---
    const missions = [
        "Temukan 1 keunikan dari siswa paling pendiam.", "Lakukan Box Breathing 3 menit sebelum mengajar.",
        "Sapa 5 siswa dengan menyebut namanya di gerbang.", "Ubah 1 peraturan kelas menjadi 'kesepakatan bersama'.",
        "Dengarkan keluhan siswa tanpa memotong.", "Beri pujian spesifik pada usaha (bukan hasil).",
        "Ajak siswa melakukan Check-in Perasaan pagi hari.", "Gunakan teknik Pacing sebelum memarahi kelas ribut.",
        "Ubah 1 sesi teori menjadi simulasi/roleplay singkat.", "Luangkan 5 menit ngobrol 1-on-1 dengan siswa bermasalah.",
        "Maafkan diri Anda jika hari ini mengajar tidak sempurna.", "Ceritakan 1 kegagalan Anda di masa lalu pada kelas.",
        "Biarkan siswa memilih cara mengerjakan tugas hari ini.", "Tulis 1 catatan terima kasih kecil untuk rekan guru.",
        "Buat permainan tebak-tebakan dari materi yang membosankan.", "Amati siswa yang terlihat murung, tanyakan kabarnya.",
        "Gunakan elemen visual/musik mengejutkan saat membuka kelas.", "Berikan umpan balik tanpa menggunakan kata 'Tapi'.",
        "Minta umpan balik jujur dari siswa tentang cara mengajar Anda.", "Praktekkan 'Connect before Correct' pada pelanggar aturan.",
        "Rayakan 1 kemenangan kecil (Miracle) kelas Anda hari ini."
    ];

    function renderTracker() {
        const grid = document.getElementById('tracker-grid');
        grid.innerHTML = '';
        
        // Retrieve state
        let trackerState = JSON.parse(localStorage.getItem('nqmt_tracker') || '[]');
        if (trackerState.length === 0) {
            // init 21 false
            trackerState = Array(21).fill(false);
            localStorage.setItem('nqmt_tracker', JSON.stringify(trackerState));
        }

        let completedCount = 0;
        const isPremium = localStorage.getItem('nqmt_premium') === 'true';

        missions.forEach((m, i) => {
            const isCompleted = trackerState[i];
            // Hari 1 selalu terbuka. Hari 2-21 terkunci premium jika tidak ada lisensi.
            const isPremiumLocked = i > 0 && !isPremium;
            
            if (isCompleted) completedCount++;

            const box = document.createElement('div');
            box.className = `tracker-box ${isCompleted ? 'completed' : ''} ${isPremiumLocked ? 'locked premium-locked' : ''}`;
            
            box.innerHTML = `
                <div class="tracker-day">Hari ${i + 1}</div>
                <div class="tracker-title">${isPremiumLocked ? '🔒 Akses Premium' : m}</div>
            `;

            if (isPremiumLocked) {
                box.onclick = showPremiumWarning;
            } else {
                box.onclick = () => {
                    trackerState[i] = !trackerState[i];
                    localStorage.setItem('nqmt_tracker', JSON.stringify(trackerState));
                    if(typeof syncToServer === 'function') syncToServer('tracker', trackerState);
                    renderTracker(); // re-render
                };
            }
            grid.appendChild(box);
        });

        // Update Progress Bar
        const pct = Math.round((completedCount / 21) * 100);
        document.getElementById('tracker-percent').textContent = pct + '%';
        document.getElementById('tracker-count').textContent = completedCount;
        document.getElementById('tracker-fill').style.width = pct + '%';
    }

    function showPremiumWarning() {
        document.querySelector('.modal-box').style.setProperty('--modal-accent', 'var(--gold-primary)');
        document.getElementById('modal-title').textContent = 'Akses Premium Diperlukan';
        document.getElementById('modal-subtitle').textContent = 'Otomatisasi Pembelian Lisensi';
        document.getElementById('modal-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        document.getElementById('modal-body').innerHTML = `
            <div class="dim-article text-center">
                <p>Misi ke-2 hingga ke-21 memerlukan <strong>Lisensi Penuh</strong>. Masukkan nomor WhatsApp Anda, kami akan otomatis mengirimkan permintaan Anda ke sistem Admin.</p>
                <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid var(--gold-primary); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                    
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <input type="text" id="input-wa-phone" placeholder="Cth: 08123456789" style="padding: 0.8rem; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.3); color: white; outline: none; font-size: 1rem;">
                        <button class="btn btn-primary" id="btn-request-license" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none;">Kirim Permintaan Lisensi</button>
                    </div>
                    <p id="req-msg" style="font-size: 0.85rem; margin-top: 0.5rem; display: none;"></p>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0 1rem; padding-top: 1.5rem;">
                        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 0.8rem; text-align: left;">Sudah memiliki kode dari Admin?</p>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="input-premium-code" placeholder="Cth: NQMT-1234" style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.3); color: white; text-transform: uppercase; outline: none; font-family: 'Courier New', monospace; font-size: 1.1rem; font-weight: bold;">
                            <button class="btn btn-primary" id="btn-activate-code" style="padding: 0.8rem 1.5rem;">Aktifkan</button>
                        </div>
                        <p id="code-error" style="color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; display: none; text-align: left;">Kode tidak valid.</p>
                    </div>
                </div>
            </div>
        `;
        
        modalOverlay.classList.add('active');

        document.getElementById('btn-request-license').onclick = async () => {
            const phone = document.getElementById('input-wa-phone').value.trim();
            const msgEl = document.getElementById('req-msg');
            const btn = document.getElementById('btn-request-license');
            
            if (!phone) {
                msgEl.textContent = 'Harap masukkan nomor WhatsApp.';
                msgEl.style.color = '#ef4444';
                msgEl.style.display = 'block';
                return;
            }

            btn.textContent = 'Mengirim...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/request-license', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phone })
                });
                
                const data = await response.json();
                if (data.success) {
                    msgEl.textContent = 'Berhasil! Admin akan segera menghubungi WA Anda.';
                    msgEl.style.color = '#34d399';
                } else {
                    msgEl.textContent = data.error || 'Terjadi kesalahan.';
                    msgEl.style.color = '#ef4444';
                }
            } catch (err) {
                msgEl.textContent = 'Gagal terhubung ke server.';
                msgEl.style.color = '#ef4444';
            }
            
            msgEl.style.display = 'block';
            btn.textContent = 'Kirim Permintaan Lisensi';
            btn.disabled = false;
        };

        document.getElementById('btn-activate-code').onclick = async () => {
            const input = document.getElementById('input-premium-code');
            const err = document.getElementById('code-error');
            const code = input.value.trim().toUpperCase();
            const btn = document.getElementById('btn-activate-code');
            
            if(!code) return;
            btn.textContent = 'Cek...';
            
            try {
                const response = await fetch('/api/verify-license', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    err.style.display = 'none';
                    localStorage.setItem('nqmt_premium', 'true');
                    localStorage.setItem('nqmt_premium_key', code);
                    
                    // Sinkronkan data dari DB kembali ke browser jika ada
                    if (data.data) {
                        if (data.data.audit_data) localStorage.setItem('nqmt_audit_completed', 'true');
                        if (data.data.tracker_data) localStorage.setItem('nqmt_tracker', data.data.tracker_data);
                        if (data.data.journal_data) localStorage.setItem('nqmt_journal', data.data.journal_data);
                    }
                    
                    showToast("Lisensi Berhasil Diaktifkan!");
                    closeDimModal();
                    if(typeof updateSidebarLicenseBtn === 'function') updateSidebarLicenseBtn();
                    renderTracker();
                    renderJournal();
                } else {
                    err.textContent = data.error || 'Kode salah.';
                    err.style.display = 'block';
                    input.style.borderColor = '#ef4444';
                }
            } catch (error) {
                err.textContent = 'Gagal terhubung ke server.';
                err.style.display = 'block';
            }
            btn.textContent = 'Aktifkan';
        };
    }

    // Fungsi helper untuk Sinkronisasi ke Server Database
    async function syncToServer(type, dataObj) {
        const isPremium = localStorage.getItem('nqmt_premium') === 'true';
        const key = localStorage.getItem('nqmt_premium_key');
        
        if (isPremium && key && key !== 'MIRACLE21') {
            try {
                await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: key, type: type, data: dataObj })
                });
            } catch(e) {
                console.error("Gagal sync ke server", e);
            }
        }
    }

    // --- C. Miracle Journal Logic ---
    function renderJournal() {
        const timeline = document.getElementById('journal-timeline');
        timeline.innerHTML = '';
        let entries = JSON.parse(localStorage.getItem('nqmt_journal') || '[]');
        
        if (entries.length === 0) {
            timeline.innerHTML = '<p style="color: var(--text-muted);">Belum ada catatan keajaiban. Mulailah hari ini!</p>';
            return;
        }

        // Show newest first
        entries.reverse().forEach(entry => {
            const div = document.createElement('div');
            div.className = 'journal-entry';
            div.innerHTML = `
                <div class="journal-date">${entry.date}</div>
                <div class="journal-text">${entry.text}</div>
            `;
            timeline.appendChild(div);
        });
    }

    document.getElementById('save-journal').addEventListener('click', () => {
        const input = document.getElementById('journal-input');
        const text = input.value.trim();
        if (!text) return;

        let entries = JSON.parse(localStorage.getItem('nqmt_journal') || '[]');
        const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        entries.push({ date: dateStr, text: text });
        localStorage.setItem('nqmt_journal', JSON.stringify(entries));
        if(typeof syncToServer === 'function') syncToServer('journal', entries);
        
        input.value = '';
        renderJournal();
    });

    // Inisialisasi logika sekarang ditangani langsung di event listener btnMulai

    // ==========================================
    // 5. Miracle Toolkit Logic
    // ==========================================
    const btnScript = document.getElementById('btn-toolkit-script');
    const btnPdf = document.getElementById('btn-toolkit-pdf');
    const btnCase = document.getElementById('btn-toolkit-case');
    const toast = document.getElementById('toast-notify');
    const toastText = document.getElementById('toast-text');

    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // A. Buka Naskah (Pacing & Leading)
    btnScript.addEventListener('click', () => {
        document.querySelector('.modal-box').style.setProperty('--modal-accent', 'var(--blue-accent)');
        document.getElementById('modal-title').textContent = 'Script "Pacing & Leading"';
        document.getElementById('modal-subtitle').textContent = 'Teknik Pengendalian Kelas Tanpa Berteriak';
        document.getElementById('modal-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
        document.getElementById('modal-body').innerHTML = `
            <div class="dim-article">
                <p><strong>Konteks:</strong> Kelas sedang sangat riuh, siswa mengobrol sendiri, dan Anda baru saja melangkah masuk kelas.</p>
                <p><strong>Langkah 1 (Pacing): Ikuti arus mereka terlebih dahulu.</strong><br>
                <em>(Hindari berteriak: "Diam semuanya!")</em><br>
                Berdirilah di depan dengan tenang, tersenyum, dan katakan dengan volume sedang:<br>
                <span style="color: var(--gold-light);">"Wah, sepertinya topik obrolan pagi ini seru sekali ya. Bapak lihat di barisan sana lagi asyik bahas game baru, yang di pojok lagi bahas film."</span></p>
                <p><strong>Langkah 2 (Leading): Arahkan ke frekuensi Anda.</strong><br>
                <span style="color: var(--gold-light);">"Silakan selesaikan kalimat terakhir kalian dalam 10 detik... (tunggu sejenak)... Oke, karena energi kalian sedang tinggi, mari kita gunakan energi hebat itu untuk memecahkan misteri di materi kita hari ini."</span></p>
                <div class="quote-block">"Pacing and Leading adalah seni berselancar; Anda tidak bisa melawan ombak yang besar, Anda harus menaikinya untuk bisa mengendalikannya."</div>
            </div>
        `;
        modalOverlay.classList.add('active');
    });

    // B. Unduh PDF (Empathy Map)
    btnPdf.addEventListener('click', () => {
        // Simulasi pembuatan file text untuk didownload
        const content = "EMPATHY MAP TEMPLATE - MIRACLE MAKER\\n\\n1. Apa yang siswa DENGAR di rumah/lingkungannya?\\n2. Apa yang siswa LIHAT di sekitarnya?\\n3. Apa yang siswa PIKIRKAN dan RASAKAN?\\n4. Apa yang siswa KATAKAN dan LAKUKAN?\\n\\nPAINS (Ketakutan/Frustasi):\\nGAINS (Keinginan/Kebutuhan):";
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Empathy_Map_Template.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast("Template Empathy Map berhasil diunduh!");
    });

    // C. Lihat Studi Kasus (Pojok Imersif)
    btnCase.addEventListener('click', () => {
        document.querySelector('.modal-box').style.setProperty('--modal-accent', 'var(--purple-accent)');
        document.getElementById('modal-title').textContent = 'Pojok Imersif (Simulasi 360)';
        document.getElementById('modal-subtitle').textContent = 'Studi Kasus: Tata Krama Hospitality';
        document.getElementById('modal-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="4"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path><path d="M12 18v2"></path><path d="M10 20h4"></path></svg>';
        document.getElementById('modal-body').innerHTML = `
            <div class="dim-article">
                <div class="vr-simulator-container">
                    <div class="vr-grid"></div>
                    <div class="vr-scanning-line"></div>
                    <div class="vr-hud">
                        SIMULATION: HOTEL_LOBBY_01<br>
                        AI_STATE: ANGRY_GUEST<br>
                        EMP_LEVEL: <span style="color: #34d399;">TRACKING ACTIVE</span>
                    </div>
                    <div class="vr-hud-right">● REC</div>
                    
                    <div class="vr-target">
                        <div class="vr-target-v1"></div>
                        <div class="vr-target-v2"></div>
                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: #34d399; white-space: nowrap; font-weight: bold;">TARGET LOCKED</div>
                    </div>

                    <div class="vr-dialogue" id="vr-text">
                        "Saya sudah menunggu 30 menit untuk kamar saya!"
                    </div>
                </div>
                <p class="mt-4"><strong>Skenario Imersif (Miracle Maker):</strong> Siswa menggunakan perangkat VR (atau ruang disulap imersif) dan langsung berhadapan dengan avatar AI <em>Tamu yang Sedang Marah</em>. Otak mereka tidak sekadar merekam teks teori, tetapi merasakan <em>adrenalin</em> dan <em>tekanan emosional nyata</em>. Mereka dipaksa melatih keterampilan <strong>Empati</strong> dan <strong>Problem Solving</strong> secara seketika.</p>
                <div class="quote-block">"Beri tahu saya, maka saya akan lupa. Ajari saya, mungkin saya akan ingat. Libatkan saya secara utuh (Immerse me), maka saya akan sungguh-sungguh belajar."</div>
            </div>
        `;
        
        modalOverlay.classList.add('active');

        // Web Speech API Setup
        const synth = window.speechSynthesis;
        synth.cancel(); // Stop any previous speech

        function speakText(text, role) {
            if (!synth) return;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            if (role === 'SYSTEM') {
                utterance.pitch = 0.4; utterance.rate = 1.1; // Robotic/Deep
            } else if (role === 'GUEST') {
                utterance.pitch = 1.3; utterance.rate = 1.2; // Angry/Fast
            } else {
                utterance.pitch = 1.0; utterance.rate = 0.9; // Calm User
            }
            synth.speak(utterance);
        }

        // VR Dialogue Simulation Script
        let vrTexts = [
            { text: "GUEST: 'Saya sudah menunggu 30 menit di lobi ini!'", role: 'GUEST', speak: "Saya sudah menunggu 30 menit di lobi ini!" },
            { text: "SYSTEM: [Mendeteksi lonjakan intonasi suara...]", role: 'SYSTEM', speak: "Mendeteksi lonjakan intonasi suara" },
            { text: "USER: 'Mohon maaf sebesar-besarnya atas ketidaknyamanan ini, Bapak.'", role: 'USER', speak: "Mohon maaf sebesar-besarnya atas ketidaknyamanan ini, Bapak." },
            { text: "SYSTEM: [Menganalisis micro-expression wajah User...]", role: 'SYSTEM', speak: "Menganalisis ekspresi wajah pengguna" },
            { text: "GUEST: 'Saya tidak butuh maaf, saya butuh kunci kamar saya sekarang!'", role: 'GUEST', speak: "Saya tidak butuh maaf, saya butuh kunci kamar saya sekarang!" },
            { text: "SYSTEM: [Peringatan: Tingkat stres tamu 85%. Pacing dibutuhkan.]", role: 'SYSTEM', speak: "Peringatan. Tingkat stres tamu 85 persen. Pendekatan pacing dibutuhkan." }
        ];
        
        let vrIdx = 0;
        speakText(vrTexts[0].speak, vrTexts[0].role); // Speak first line

        const vrInterval = setInterval(() => {
            const el = document.getElementById('vr-text');
            // Cek apakah modal masih terbuka
            if (el && modalOverlay.classList.contains('active')) {
                vrIdx = (vrIdx + 1) % vrTexts.length;
                el.style.opacity = 0;
                setTimeout(() => {
                    el.innerHTML = vrTexts[vrIdx].text;
                    el.style.color = vrTexts[vrIdx].role === 'SYSTEM' ? "#a78bfa" : (vrTexts[vrIdx].role === 'GUEST' ? "#ef4444" : "#34d399");
                    el.style.opacity = 1;
                    speakText(vrTexts[vrIdx].speak, vrTexts[vrIdx].role);
                }, 200);
            } else {
                clearInterval(vrInterval);
                synth.cancel();
            }
        }, 4000);
    });

});
