class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.levelId = 1;
        this.deaths = 0;
        this.coinsCollected = 0;
        this.startTime = 0;
        this.running = false;
        this.paused = false;
        this.flipped = false;
        this.flipTimer = 0;
        this.flipDuration = 180;
        
        this.camera = new Camera();
        this.player = null;
        this.levelData = null;
        this.collectibles = [];
        
        this.setupCanvas();
        this.loadLevel(this.levelId);
        this.loop = this.loop.bind(this);
        this.loop();
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    loadLevel(id) {
        this.levelData = LevelGenerator.generate(id);
        this.levelId = id;
        this.deaths = 0;
        this.coinsCollected = 0;
        this.startTime = Date.now();
        this.flipped = false;
        this.flipTimer = 0;
        this.collectibles = this.levelData.collectibles.map(c => ({...c, collected: false}));
        const start = this.levelData.playerStart;
        this.player = new Player(start.x, start.y);
        this.running = true;
        this.paused = false;
        
        const theme = this.levelData.theme;
        document.getElementById('gameCanvas').style.background = theme.bg;
        
        document.getElementById('hud-level').innerText = `Lv. ${id}`;
        document.getElementById('hud-deaths').innerText = `💀 0`;
        document.getElementById('hud-coins').innerText = `🪙 0`;
        document.getElementById('complete-overlay').classList.add('hidden');
        
        if(id % 5 === 0 && id > 1) AdManager.showInterstitial();
    }

    restartLevel() { this.loadLevel(this.levelId); }

    nextLevel() {
        if(this.levelId >= 500) {
            alert('🏆 You completed all 500 levels! You are the TRUE TRAP MASTER!');
            UIManager.showScreen('menu-screen');
            return;
        }
        this.loadLevel(this.levelId + 1);
        SaveManager.unlockLevel(this.levelId + 1);
    }

    loop() {
        if(!this.running) { requestAnimationFrame(this.loop); return; }
        const ctx = this.ctx;
        // Always start each frame from a clean identity transform so we never
        // accumulate translations across frames (this was the cause of the
        // game visually drifting / breaking after a while).
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 800, 400);
        
        if(!this.paused) this.update();
        
        this.camera.follow(this.player, 800, 400, this.levelData.width || 1200, this.levelData.height || 400);

        ctx.save();
        this.camera.apply(ctx);
        
        // Render with Flip support
        if(this.flipped) {
            ctx.save();
            ctx.translate(400, 200);
            ctx.rotate(Math.PI);
            ctx.translate(-400, -200);
        }
        this.render(ctx);
        if(this.flipped) {
            ctx.restore();
        }

        ctx.restore(); // undo camera transform, back to identity for the HUD/next frame

        document.getElementById('hud-deaths').innerHTML = `💀 ${this.deaths}`;
        document.getElementById('hud-coins').innerHTML = `🪙 ${this.coinsCollected}`;
        requestAnimationFrame(this.loop);
    }

    update() {
        const input = InputManager.getState();
        const player = this.player;
        const data = this.levelData;

        if(!player.alive) {
            player.deathTimer--;
            if(player.deathTimer <= 0) { this.deaths++; this.restartLevel(); return; }
            return;
        }

        this.updateTraps();

        // FLIP TRAP CHECK
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active !== false && Physics.aabb(player, t)) {
                this.flipped = true;
                this.flipTimer = this.flipDuration;
                t.active = false;
                // Visually indicate flip
            }
        }
        if(this.flipped) {
            this.flipTimer--;
            if(this.flipTimer <= 0) this.flipped = false;
        }

        // Controls
        let moveX = 0;
        if(input.left) moveX = -1;
        if(input.right) moveX = 1;
        if(this.flipped) moveX *= -1; // Invert controls
        if(data.specials && data.specials.reverseControls) moveX *= -1;

        if(moveX < 0) player.moveLeft();
        else if(moveX > 0) player.moveRight();
        if(input.jump) player.jump();

        // Gravity
        let grav = (data.specials && data.specials.gravity) ? data.specials.gravity : 0.5;
        if(this.flipped) grav = -grav;
        player.vy += grav;
        player.x += player.vx;
        player.y += player.vy;

        let platforms = data.platforms;
        const onGround = Physics.resolveCollisions(player, platforms);
        player.onGround = onGround;

        // Trap Collisions
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            if(Physics.aabb(player, t)) {
                if(t.damage) { player.die(); }
                if(t.type === 'flipTrigger' && t.active !== false) {
                    this.flipped = true;
                    this.flipTimer = this.flipDuration;
                    t.active = false;
                }
            }
        }

        // Collectibles
        for(let c of this.collectibles) {
            if(!c.collected && Physics.aabb(player, c)) {
                c.collected = true;
                this.coinsCollected++;
            }
        }

        // Goal
        if(Physics.aabb(player, data.goal)) this.completeLevel();
        if(player.y > 500 || player.y < -100) player.die();
    }

    updateTraps() {
        // Moving traps carry speed/dir but nothing was ever advancing their
        // position, so they used to sit frozen in place. Patrol/oscillate them.
        for(let t of this.levelData.traps) {
            switch(t.type) {
                case 'crusher':
                    t.y += t.speed * t.dir;
                    if(t.y <= t.startY) { t.y = t.startY; t.dir = 1; }
                    if(t.y >= t.endY) { t.y = t.endY; t.dir = -1; }
                    break;
                case 'angryBird':
                case 'eagle':
                case 'ufo':
                    if(t.originX === undefined) t.originX = t.x;
                    t.x += t.speed * t.dir;
                    if(t.x > t.originX + 90) t.dir = -1;
                    if(t.x < t.originX - 90) t.dir = 1;
                    break;
                case 'lion': case 'wolf': case 'bear': case 'tiger':
                case 'snake': case 'shark': case 'rhino': case 'hippo': case 'croc':
                    if(t.originX === undefined) t.originX = t.x;
                    t.x += t.speed * t.dir;
                    if(t.x > t.originX + 60) t.dir = -1;
                    if(t.x < t.originX - 60) t.dir = 1;
                    break;
            }
        }
    }

    render(ctx) {
        const data = this.levelData;
        // Background
        ctx.fillStyle = this.flipped ? '#0a0a1a' : data.theme.bg;
        ctx.fillRect(0, 0, 800, 400);

        // Platforms
        ctx.fillStyle = this.flipped ? '#4a4a5a' : '#4a6fa5';
        for(let p of data.platforms) {
            ctx.fillStyle = (p.isQuicksand) ? '#b8860b' : (this.flipped ? '#6a6a7a' : '#4a6fa5');
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }

        // Traps
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            
            if(t.type === 'fakeFloor') {
                ctx.fillStyle = this.flipped ? '#6a6a7a' : '#4a6fa5';
                ctx.fillRect(t.x - 10, t.y - 15, t.w + 20, 20);
            }
            if(t.type === 'spike') {
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.moveTo(t.x, t.y + t.h);
                ctx.lineTo(t.x + t.w/2, t.y);
                ctx.lineTo(t.x + t.w, t.y + t.h);
                ctx.fill();
            }
            if(t.type === 'crusher') {
                ctx.fillStyle = '#8B0000';
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 20;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
            }
            if(t.type === 'flappyPipe') {
                ctx.fillStyle = '#2a6a2a';
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.fillRect(t.x, t.y + t.h + t.gap, t.w, 80);
            }
            if(t.type === 'lion' || t.type === 'wolf' || t.type === 'bear' || t.type === 'tiger') {
                ctx.fillStyle = '#d4a373';
                ctx.beginPath();
                ctx.arc(t.x + 15, t.y + 15, 15, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.font = '20px sans-serif';
                ctx.fillText('🐾', t.x, t.y+20);
            }
            if(t.type === 'ufo') {
                ctx.fillStyle = '#7a7a8a';
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.ellipse(t.x+20, t.y+10, 20, 10, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                ctx.fillRect(t.x+15, t.y, 10, 5);
            }
            if(t.type === 'flipTrigger') {
                ctx.fillStyle = '#ff00ff';
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 25;
                ctx.font = '20px sans-serif';
                ctx.fillText('🌀', t.x, t.y+20);
                ctx.shadowBlur = 0;
            }
            if(t.type === 'lava') {
                ctx.fillStyle = '#ff4500';
                ctx.shadowColor = 'orange';
                ctx.shadowBlur = 30;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
            }
        }

        // Goal
        ctx.fillStyle = '#f5c842';
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 20;
        ctx.fillRect(data.goal.x, data.goal.y, data.goal.w, data.goal.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#333';
        ctx.font = '20px sans-serif';
        ctx.fillText('🏁', data.goal.x, data.goal.y + 25);

        // Collectibles
        for(let c of this.collectibles) {
            if(!c.collected) {
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = 'gold';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(c.x + 10, c.y + 10, 10, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        this.player.draw(ctx);
    }

    completeLevel() {
        if(!this.running) return;
        this.running = false;
        const time = Math.floor((Date.now() - this.startTime) / 1000);
        SaveManager.completeLevel(this.levelId, time, this.deaths, this.coinsCollected);
        document.getElementById('complete-stats').innerText = `Time: ${time}s | Deaths: ${this.deaths} | Coins: ${this.coinsCollected}`;
        document.getElementById('complete-overlay').classList.remove('hidden');
        AudioManager.play('victory');
    }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-overlay').classList.toggle('hidden');
    }
}