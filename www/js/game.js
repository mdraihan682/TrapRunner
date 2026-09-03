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
        this.particles = [];
        this.shakeDuration = 0;
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
        try {
            this.levelData = LevelGenerator.generate(id);
        } catch(e) {
            this.levelData = {
                levelId: id, worldId: 1,
                theme: ThemeManager.getTheme(1),
                width: 1200, height: 400,
                playerStart: {x: 60, y: 300},
                goal: {x: 1100, y: 300, w: 30, h: 30},
                platforms: [{x: 50, y: 360, w: 1100, h: 20}],
                traps: [], collectibles: [],
                difficulty: 0.5
            };
        }
        this.levelId = id;
        this.deaths = 0;
        this.coinsCollected = 0;
        this.startTime = Date.now();
        this.flipped = false;
        this.flipTimer = 0;
        this.particles = [];
        this.shakeDuration = 0;
        this.collectibles = this.levelData.collectibles.map(c => ({...c, collected: false}));
        const start = this.levelData.playerStart;
        this.player = new Player(start.x, start.y);
        this.running = true;
        this.paused = false;
        document.getElementById('hud-level').innerText = `Lv. ${id}`;
        document.getElementById('hud-deaths').innerHTML = `💀 0`;
        document.getElementById('hud-coins').innerHTML = `🪙 0`;
        document.getElementById('complete-overlay').classList.add('hidden');
    }

    restartLevel() { this.loadLevel(this.levelId); }

    nextLevel() {
        if(this.levelId >= 500) {
            alert('🏆 You completed all 500 levels!');
            UIManager.showScreen('menu-screen');
            return;
        }
        this.loadLevel(this.levelId + 1);
        SaveManager.unlockLevel(this.levelId + 1);
    }

    loop() {
        if(!this.running) { requestAnimationFrame(this.loop); return; }
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 800, 400);
        if(this.shakeDuration > 0) {
            this.shakeDuration--;
            const i = this.shakeDuration * 0.8;
            ctx.translate((Math.random()-0.5)*i, (Math.random()-0.5)*i);
        }
        if(!this.paused) this.update();
        this.camera.follow(this.player, 800, 400, this.levelData.width || 1200, this.levelData.height || 400);
        this.camera.apply(ctx);
        if(this.flipped) {
            ctx.save();
            ctx.translate(400, 200);
            ctx.rotate(Math.PI);
            ctx.translate(-400, -200);
        }
        this.render(ctx);
        if(this.flipped) ctx.restore();
        this.camera.apply(ctx, true);
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
        let moveX = 0;
        if(input.left) moveX = -1;
        if(input.right) moveX = 1;
        if(this.flipped) moveX *= -1;
        if(moveX < 0) player.moveLeft();
        else if(moveX > 0) player.moveRight();
        else { player.vx *= 0.85; if (Math.abs(player.vx) < 0.1) player.vx = 0; }
        if(input.jump) player.jump();
        let grav = 0.5;
        if(this.flipped) grav = -grav;
        player.vy += grav;
        player.x += player.vx;
        player.y += player.vy;
        const onGround = Physics.resolveCollisions(player, data.platforms);
        player.onGround = onGround;
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active !== false && Physics.aabb(player, t)) {
                this.flipped = true;
                this.flipTimer = this.flipDuration;
                t.active = false;
            }
        }
        if(this.flipped) {
            this.flipTimer--;
            if(this.flipTimer <= 0) this.flipped = false;
        }
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            if(Physics.aabb(player, t)) {
                if(t.damage && player.alive) {
                    for(let i=0; i<30; i++) {
                        this.particles.push({
                            x: player.x + player.w/2, y: player.y + player.h/2,
                            vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10-3,
                            life: 60+Math.random()*30, maxLife: 90,
                            size: 4+Math.random()*8,
                            color: `hsl(${Math.random()*360},80%,60%)`
                        });
                    }
                    player.die();
                    this.shakeDuration = 15;
                }
                if(t.type === 'flipTrigger' && t.active !== false) {
                    this.flipped = true;
                    this.flipTimer = this.flipDuration;
                    t.active = false;
                }
            }
        }
        for(let c of this.collectibles) {
            if(!c.collected && Physics.aabb(player, c)) {
                c.collected = true;
                this.coinsCollected++;
                for(let i=0; i<8; i++) {
                    this.particles.push({
                        x: c.x+10, y: c.y+10,
                        vx: (Math.random()-0.5)*6, vy: (Math.random()-0.5)*6-2,
                        life: 20, maxLife: 20, size: 3, color: '#ffd700'
                    });
                }
            }
        }
        if(Physics.aabb(player, data.goal)) this.completeLevel();
        if(player.y > 500 || player.y < -100) {
            if(player.alive) {
                for(let i=0; i<30; i++) {
                    this.particles.push({
                        x: player.x + player.w/2, y: player.y + player.h/2,
                        vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10-3,
                        life: 60, maxLife: 60,
                        size: 4+Math.random()*8,
                        color: `hsl(${Math.random()*360},80%,60%)`
                    });
                }
                player.die();
                this.shakeDuration = 15;
            }
        }
    }

    render(ctx) {
        const data = this.levelData;
        const theme = data.theme;
        const W = 800, H = 400;

        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, theme.sky || theme.bg);
        grad.addColorStop(0.7, theme.bg);
        grad.addColorStop(1, theme.ground);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        if (theme.env && theme.env.sun) {
            ctx.fillStyle = '#ffdd44';
            ctx.shadowColor = '#ffdd44';
            ctx.shadowBlur = 80;
            ctx.beginPath();
            ctx.arc(700, 60, 45, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        if (theme.env && theme.env.moon) {
            ctx.fillStyle = '#e0e8f0';
            ctx.shadowColor = '#e0e8f0';
            ctx.shadowBlur = 60;
            ctx.beginPath();
            ctx.arc(100, 60, 30, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#1a1a2e';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(90, 55, 8, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(110, 70, 5, 0, Math.PI*2);
            ctx.fill();
        }
        if (theme.env && theme.env.rain) {
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.4)';
            ctx.lineWidth = 1;
            for(let i=0; i<80; i++) {
                const x = (i * 37 + Date.now() * 0.05) % W;
                const y = (i * 53 + Date.now() * 0.1) % H;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x-5, y+15);
                ctx.stroke();
            }
        }
        if (theme.env && theme.env.snow) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            for(let i=0; i<40; i++) {
                const x = (i * 67 + Date.now() * 0.03) % W;
                const y = (i * 43 + Date.now() * 0.06) % H;
                ctx.beginPath();
                ctx.arc(x, y, 2+Math.sin(i)*1, 0, Math.PI*2);
                ctx.fill();
            }
        }
        if (theme.env && theme.env.waves) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
            ctx.lineWidth = 4;
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                const yBase = H - 20 + i * 10;
                for(let x=0; x<W; x+=5) {
                    const y = yBase + Math.sin(x*0.02 + Date.now()*0.001 + i*2) * 10;
                    i===0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        ctx.shadowBlur = 0;
        for(let p of data.platforms) {
            ctx.fillStyle = (p.isQuicksand) ? '#b8860b' : (this.flipped ? '#6a6a7a' : '#4a6fa5');
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            for(let i=0; i<p.w; i+=20) ctx.fillRect(p.x+i, p.y+4, 4, 3);
        }

        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            if(t.type === 'spike') {
                ctx.fillStyle = '#ff4444';
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(t.x, t.y + t.h);
                ctx.lineTo(t.x + t.w/2, t.y);
                ctx.lineTo(t.x + t.w, t.y + t.h);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'crusher') {
                ctx.fillStyle = '#8B0000';
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 20;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'flappyPipe') {
                ctx.fillStyle = '#2a6a2a';
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.fillRect(t.x, t.y + t.h + t.gap, t.w, 80);
            }
            else if(t.type === 'lion') {
                ctx.font = '28px sans-serif';
                ctx.fillText('🦁', t.x, t.y+20);
            }
            else if(t.type === 'ufo') {
                ctx.fillStyle = '#7a7a8a';
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.ellipse(t.x+20, t.y+10, 20, 10, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                ctx.fillRect(t.x+15, t.y, 10, 5);
                ctx.fillStyle = '#0f0';
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 10;
                ctx.fillRect(t.x+18, t.y-3, 4, 3);
                ctx.fillRect(t.x+28, t.y-3, 4, 3);
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'flipTrigger') {
                ctx.fillStyle = '#ff00ff';
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 30;
                ctx.font = '30px sans-serif';
                ctx.fillText('🌀', t.x, t.y+25);
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'lava') {
                ctx.fillStyle = '#ff4500';
                ctx.shadowColor = 'orange';
                ctx.shadowBlur = 40;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'laser') {
                if(Math.floor(Date.now()/1000) % 2 === 0) {
                    ctx.fillStyle = 'rgba(255,0,255,0.6)';
                    ctx.shadowColor = '#ff00ff';
                    ctx.shadowBlur = 30;
                    ctx.fillRect(t.x, t.y, t.w, t.h);
                    ctx.shadowBlur = 0;
                }
            }
            else {
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(t.x, t.y, t.w, t.h);
            }
        }

        ctx.fillStyle = '#f5c842';
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 30;
        ctx.fillRect(data.goal.x, data.goal.y, data.goal.w, data.goal.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#333';
        ctx.font = '25px sans-serif';
        ctx.fillText('🏁', data.goal.x, data.goal.y+28);

        for(let c of this.collectibles) {
            if(!c.collected) {
                const pulse = Math.sin(Date.now()*0.003 + c.x) * 0.3 + 0.7;
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = 'gold';
                ctx.shadowBlur = 20 * pulse;
                ctx.beginPath();
                ctx.arc(c.x + 10, c.y + 10, 10 * pulse, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.fillText('★', c.x+6, c.y+14);
            }
        }

        for(let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        this.particles = this.particles.filter(p => p.life > 0);

        this.player.draw(ctx);
    }

    completeLevel() {
        if(!this.running) return;
        this.running = false;
        const time = Math.floor((Date.now() - this.startTime) / 1000);
        SaveManager.completeLevel(this.levelId, time, this.deaths, this.coinsCollected);
        for(let i=0; i<80; i++) {
            this.particles.push({
                x: 400, y: 200,
                vx: (Math.random()-0.5)*20,
                vy: (Math.random()-0.5)*20-10,
                life: 120, maxLife: 120,
                size: 5+Math.random()*10,
                color: `hsl(${Math.random()*360},100%,70%)`
            });
        }
        document.getElementById('complete-stats').innerText = `Time: ${time}s | Deaths: ${this.deaths} | Coins: ${this.coinsCollected}`;
        document.getElementById('complete-overlay').classList.remove('hidden');
    }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-overlay').classList.toggle('hidden');
    }
}
