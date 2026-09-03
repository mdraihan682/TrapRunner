class UIManager {
    static init(game) {
        this.game = game;
        document.querySelectorAll('[data-action="play"]').forEach(el => el.addEventListener('click', () => {
            this.showScreen('game-screen');
            if(game) game.loadLevel(SaveManager.get().unlockedLevel || 1);
        }));
        document.querySelectorAll('[data-action="levels"]').forEach(el => el.addEventListener('click', this.showLevelSelect.bind(this)));
        document.querySelectorAll('[data-action="shop"]').forEach(el => el.addEventListener('click', this.showShop.bind(this)));
        document.querySelectorAll('[data-action="achievements"]').forEach(el => el.addEventListener('click', this.showAchievements.bind(this)));
        document.querySelectorAll('[data-action="settings"]').forEach(el => el.addEventListener('click', () => this.showScreen('settings-screen')));
        document.querySelectorAll('[data-action="howto"]').forEach(el => el.addEventListener('click', () => this.showScreen('howto-screen')));
        document.querySelectorAll('[data-action="removeads"]').forEach(el => el.addEventListener('click', PurchaseManager.purchaseRemoveAds));
        document.querySelectorAll('[data-action="backMenu"]').forEach(el => el.addEventListener('click', () => this.showScreen('menu-screen')));
        document.querySelectorAll('[data-action="resume"]').forEach(el => el.addEventListener('click', () => { if(game) game.togglePause(); }));
        document.querySelectorAll('[data-action="restart"]').forEach(el => el.addEventListener('click', () => { if(game) { game.restartLevel(); document.getElementById('pause-overlay').classList.add('hidden'); } }));
        document.querySelectorAll('[data-action="levelSelect"]').forEach(el => el.addEventListener('click', () => { this.showScreen('level-screen'); if(game) game.running = false; }));
        document.querySelectorAll('[data-action="menu"]').forEach(el => el.addEventListener('click', () => { this.showScreen('menu-screen'); if(game) game.running = false; }));
        document.querySelectorAll('[data-action="nextLevel"]').forEach(el => el.addEventListener('click', () => { if(game) game.nextLevel(); }));
        document.querySelectorAll('[data-action="replayLevel"]').forEach(el => el.addEventListener('click', () => { if(game) { game.restartLevel(); document.getElementById('complete-overlay').classList.add('hidden'); } }));
        document.getElementById('pause-btn').addEventListener('click', () => { if(game) game.togglePause(); });
        
        document.getElementById('toggle-sound').addEventListener('change', (e) => {
            const s = SaveManager.get(); s.settings.sound = e.target.checked; SaveManager.save(s);
        });
        document.getElementById('toggle-vibration').addEventListener('change', (e) => {
            const s = SaveManager.get(); s.settings.vibration = e.target.checked; SaveManager.save(s);
        });
        const s = SaveManager.get();
        document.getElementById('toggle-sound').checked = s.settings.sound;
        document.getElementById('toggle-vibration').checked = s.settings.vibration;
    }

    static showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    static showLevelSelect() {
        this.showScreen('level-screen');
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        const save = SaveManager.get();
        for(let i = 1; i <= 500; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.innerText = i;
            if(save.completedLevels.includes(i)) btn.classList.add('completed');
            else if(i <= save.unlockedLevel) btn.classList.add('unlocked');
            else btn.classList.add('locked');
            if(i === save.unlockedLevel) btn.classList.add('current');
            btn.addEventListener('click', () => {
                if(i <= save.unlockedLevel) {
                    this.showScreen('game-screen');
                    if(this.game) this.game.loadLevel(i);
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
        if(!save.ownedCosmetics) save.ownedCosmetics = [];

        const categories = ShopManager.getCategories();
        const categoryNames = {
            skins: '👤 Characters', hats: '🎩 Hats', masks: '🎭 Masks',
            shields: '🛡️ Shields', pants: '👖 Pants', boots: '👢 Boots',
            trails: '✨ Trails', deaths: '💀 Deaths', victories: '🏆 Victories',
            emotes: '💬 Emotes'
        };

        for(let [catKey, items] of Object.entries(categories)) {
            const header = document.createElement('div');
            header.style.cssText = 'width:100%; text-align:center; font-size:1.3rem; color:#f5c842; margin-top:10px; border-bottom:1px solid #444; padding:5px 0;';
            header.innerText = categoryNames[catKey] || catKey;
            grid.appendChild(header);

            for(let item of items) {
                const div = document.createElement('div');
                div.className = 'shop-item';
                const owned = save.ownedCosmetics.includes(item.id);
                if(owned) div.classList.add('owned');

                div.innerHTML = `<div style="font-size:2rem;">${item.emoji}</div><h3>${item.name}</h3><p style="color:#4CAF50;">$${item.priceUsd.toFixed(2)}</p>`;
                if(!owned) {
                    const btn = document.createElement('button');
                    btn.innerText = 'BUY';
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

        // Remove Ads
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
        for(let ach of AchievementManager.list) {
            const div = document.createElement('div');
            div.className = 'achieve-item';
            if(unlocked.includes(ach.id)) div.classList.add('unlocked');
            div.innerHTML = `<h4>${ach.name}</h4><p>${ach.desc}</p><p>${unlocked.includes(ach.id) ? '✅' : '🔒'}</p>`;
            grid.appendChild(div);
        }
    }
}