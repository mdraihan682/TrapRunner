class UIManager {
    static init(game) {
        this.game = game;
        this.setupEventListeners();
        this.loadSettings();
    }

    static setupEventListeners() {
        // ===== ম্যাজিক ফিক্স: ডকুমেন্টে একক লিসেনার =====
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const action = target.dataset.action;
            console.log('Button clicked:', action); // ডিবাগের জন্য

            switch(action) {
                case 'play':
                    this.showScreen('game-screen');
                    if (this.game) {
                        const level = SaveManager.get().unlockedLevel || 1;
                        this.game.loadLevel(level);
                    }
                    break;
                case 'levels':
                    this.showLevelSelect();
                    break;
                case 'shop':
                    this.showShop();
                    break;
                case 'achievements':
                    this.showAchievements();
                    break;
                case 'settings':
                    this.showScreen('settings-screen');
                    break;
                case 'howto':
                    this.showScreen('howto-screen');
                    break;
                case 'removeads':
                    PurchaseManager.purchaseRemoveAds();
                    break;
                case 'backMenu':
                    this.showScreen('menu-screen');
                    break;
                case 'resume':
                    if (this.game) this.game.togglePause();
                    break;
                case 'restart':
                    if (this.game) {
                        this.game.restartLevel();
                        document.getElementById('pause-overlay').classList.add('hidden');
                    }
                    break;
                case 'levelSelect':
                    this.showScreen('level-screen');
                    if (this.game) this.game.running = false;
                    break;
                case 'menu':
                    this.showScreen('menu-screen');
                    if (this.game) this.game.running = false;
                    break;
                case 'nextLevel':
                    if (this.game) this.game.nextLevel();
                    break;
                case 'replayLevel':
                    if (this.game) {
                        this.game.restartLevel();
                        document.getElementById('complete-overlay').classList.add('hidden');
                    }
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
        });

        // পজ বাটন আলাদাভাবে
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.game) this.game.togglePause();
        });

        // সেটিংস টগল
        document.getElementById('toggle-sound').addEventListener('change', (e) => {
            const s = SaveManager.get();
            s.settings.sound = e.target.checked;
            SaveManager.save(s);
        });
        document.getElementById('toggle-vibration').addEventListener('change', (e) => {
            const s = SaveManager.get();
            s.settings.vibration = e.target.checked;
            SaveManager.save(s);
        });
    }

    static loadSettings() {
        const s = SaveManager.get();
        const soundToggle = document.getElementById('toggle-sound');
        const vibToggle = document.getElementById('toggle-vibration');
        if (soundToggle) soundToggle.checked = s.settings.sound;
        if (vibToggle) vibToggle.checked = s.settings.vibration;
    }

    static showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }

    static showLevelSelect() {
        this.showScreen('level-screen');
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        const save = SaveManager.get();
        for (let i = 1; i <= 500; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.innerText = i;
            btn.dataset.action = 'levelSelectBtn';
            if (save.completedLevels.includes(i)) btn.classList.add('completed');
            else if (i <= save.unlockedLevel) btn.classList.add('unlocked');
            else btn.classList.add('locked');
            if (i === save.unlockedLevel) btn.classList.add('current');
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (i <= save.unlockedLevel) {
                    this.showScreen('game-screen');
                    if (this.game) this.game.loadLevel(i);
                }
            });
            grid.appendChild(btn);
        }
    }

    static showShop() {
        this.showScreen('shop-screen');
        const grid = document.getElementById('shop-grid');
        grid.innerHTML = '';
        const save = SaveManager.get();
        if (!save.ownedCosmetics) save.ownedCosmetics = [];

        const categories = ShopManager.getCategories();
        const categoryNames = {
            skins: '👤 Characters', hats: '🎩 Hats', masks: '🎭 Masks',
            shields: '🛡️ Shields', pants: '👖 Pants', boots: '👢 Boots',
            trails: '✨ Trails', deaths: '💀 Deaths', victories: '🏆 Victories',
            emotes: '💬 Emotes'
        };

        for (let [catKey, items] of Object.entries(categories)) {
            const header = document.createElement('div');
            header.style.cssText = 'width:100%; text-align:center; font-size:1.3rem; color:#f5c842; margin-top:10px; border-bottom:1px solid #444; padding:5px 0;';
            header.innerText = categoryNames[catKey] || catKey;
            grid.appendChild(header);

            for (let item of items) {
                const div = document.createElement('div');
                div.className = 'shop-item';
                const owned = save.ownedCosmetics.includes(item.id);
                if (owned) div.classList.add('owned');

                div.innerHTML = `<div style="font-size:2rem;">${item.emoji}</div><h3>${item.name}</h3><p style="color:#4CAF50;">$${item.priceUsd.toFixed(2)}</p>`;
                if (!owned) {
                    const btn = document.createElement('button');
                    btn.innerText = 'BUY';
                    btn.dataset.action = 'shopBuy';
                    btn.style.minWidth = '60px';
                    btn.style.padding = '5px 10px';
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        PurchaseManager.purchaseCosmetic(item.id);
                    });
                    div.appendChild(btn);
                } else {
                    div.innerHTML += `<p style="color:gold;">✅ OWNED</p>`;
                }
                grid.appendChild(div);
            }
        }

        // রিমুভ অ্যাডস
        const adsDiv = document.createElement('div');
        adsDiv.style.cssText = 'width:100%; text-align:center; margin:15px; padding:15px; background:#2a1a2a; border-radius:15px;';
        adsDiv.innerHTML = `<h2 style="color:#e94560;">🚫 REMOVE ADS</h2><p style="color:#aaa;">$0.99 One-time</p><button id="remove-ads-shop-btn" style="background:#e94560;">BUY</button>`;
        grid.appendChild(adsDiv);
        document.getElementById('remove-ads-shop-btn')?.addEventListener('click', PurchaseManager.purchaseRemoveAds);
    }

    static showAchievements() {
        this.showScreen('achieve-screen');
        const grid = document.getElementById('achieve-grid');
        grid.innerHTML = '';
        const save = SaveManager.get();
        const unlocked = AchievementManager.checkAll(save);
        for (let ach of AchievementManager.list) {
            const div = document.createElement('div');
            div.className = 'achieve-item';
            if (unlocked.includes(ach.id)) div.classList.add('unlocked');
            div.innerHTML = `<h4>${ach.name}</h4><p>${ach.desc}</p><p>${unlocked.includes(ach.id) ? '✅' : '🔒'}</p>`;
            grid.appendChild(div);
        }
    }
}
