    render(ctx) {
        const data = this.levelData;
        const theme = data.theme;
        const W = 800, H = 400;

        // ===== থিম অনুযায়ী ব্যাকগ্রাউন্ড =====
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, theme.sky || theme.bg);
        grad.addColorStop(0.7, theme.bg);
        grad.addColorStop(1, theme.ground);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // ===== সূর্য / চাঁদ =====
        if (theme.env.sun) {
            ctx.fillStyle = '#ffdd44';
            ctx.shadowColor = '#ffdd44';
            ctx.shadowBlur = 80;
            ctx.beginPath();
            ctx.arc(700, 60, 45, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        if (theme.env.moon) {
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

        // ===== বৃষ্টি / তুষার =====
        if (theme.env.rain) {
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.4)';
            ctx.lineWidth = 1;
            for(let i=0; i<80; i++) {
                const x = (i * 37 + Date.now()*0.05) % W;
                const y = (i * 53 + Date.now()*0.1) % H;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x-5, y+15);
                ctx.stroke();
            }
        }
        if (theme.env.snow) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            for(let i=0; i<40; i++) {
                const x = (i * 67 + Date.now()*0.03) % W;
                const y = (i * 43 + Date.now()*0.06) % H;
                ctx.beginPath();
                ctx.arc(x, y, 2+Math.sin(i)*1, 0, Math.PI*2);
                ctx.fill();
            }
        }

        // ===== সমুদ্রের ঢেউ =====
        if (theme.env.waves) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
            ctx.lineWidth = 4;
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                const yBase = H - 20 + i*10;
                for(let x=0; x<W; x+=5) {
                    const y = yBase + Math.sin(x*0.02 + Date.now()*0.001 + i*2) * 10;
                    i===0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        // ===== প্ল্যাটফর্ম =====
        ctx.shadowBlur = 0;
        for(let p of data.platforms) {
            ctx.fillStyle = (p.isQuicksand) ? '#b8860b' : (this.flipped ? '#6a6a7a' : '#4a6fa5');
            ctx.fillRect(p.x, p.y, p.w, p.h);
            // গ্রাউন্ড টেক্সচার
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            for(let i=0; i<p.w; i+=20) {
                ctx.fillRect(p.x+i, p.y+4, 4, 3);
            }
        }

        // ===== ট্র্যাপ রেন্ডার (থিম অনুযায়ী রঙ) =====
        for(let t of data.traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            
            // ট্র্যাপের টাইপ অনুযায়ী ড্র
            if(t.type === 'spike') {
                ctx.fillStyle = t.color || '#ff4444';
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
                ctx.fillStyle = t.color || '#8B0000';
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 20;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
            }
            else if(t.type === 'flappyPipe') {
                ctx.fillStyle = t.color || '#2a6a2a';
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.fillRect(t.x, t.y + t.h + t.gap, t.w, 80);
                ctx.fillStyle = 'rgba(0,255,0,0.2)';
                ctx.fillRect(t.x-5, t.y + t.h, t.w+10, t.gap);
            }
            else if(t.type === 'angryBird') {
                ctx.fillStyle = '#ff0000';
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(t.x+15, t.y+15, 15, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 0;
                ctx.fillRect(t.x+10, t.y+10, 4, 4);
                ctx.fillRect(t.x+20, t.y+10, 4, 4);
                ctx.fillStyle = '#ffa500';
                ctx.beginPath();
                ctx.moveTo(t.x+15, t.y+20);
                ctx.lineTo(t.x+10, t.y+25);
                ctx.lineTo(t.x+20, t.y+25);
                ctx.fill();
            }
            else if(t.type === 'lion' || t.type === 'wolf' || t.type === 'bear' || t.type === 'tiger') {
                ctx.fillStyle = t.color || '#d4a373';
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(t.x+15, t.y+15, 15, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.shadowBlur = 0;
                ctx.font = '20px sans-serif';
                const emoji = {lion:'🦁', wolf:'🐺', bear:'🐻', tiger:'🐯', shark:'🦈', croc:'🐊', eagle:'🦅', snake:'🐍', rhino:'🦏', hippo:'🦛', bat:'🦇', scorpion:'🦂', frog:'🐸', demon:'👿', ghost:'👻', robot:'🤖', alien:'👽', ufo:'🛸', crystal:'💎', neon:'💡', glitch:'🌀', snowball:'❄️', lightning:'⚡', rock:'🪨', cloud:'☁️'};
                ctx.fillText(emoji[t.type] || '🐾', t.x, t.y+20);
            }
            else if(t.type === 'ufo') {
                ctx.fillStyle = t.color || '#7a7a8a';
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
                // লাভা বুদবুদ
                for(let i=0; i<3; i++) {
                    const bx = t.x + 10 + i*20 + Math.sin(Date.now()*0.002 + i)*5;
                    const by = t.y - 5 + Math.sin(Date.now()*0.003 + i*2)*5;
                    ctx.fillStyle = 'rgba(255,200,0,0.6)';
                    ctx.beginPath();
                    ctx.arc(bx, by, 4+Math.sin(Date.now()*0.01+i)*2, 0, Math.PI*2);
                    ctx.fill();
                }
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
                // ডিফল্ট ট্র্যাপ
                ctx.fillStyle = t.color || '#ff4444';
                ctx.fillRect(t.x, t.y, t.w, t.h);
            }
        }

        // ===== গোল (পতাকা) =====
        ctx.fillStyle = '#f5c842';
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 30;
        ctx.fillRect(data.goal.x, data.goal.y, data.goal.w, data.goal.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#333';
        ctx.font = '25px sans-serif';
        ctx.fillText('🏁', data.goal.x, data.goal.y + 28);

        // ===== কলেক্টিবল =====
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

        // ===== প্লেয়ার =====
        this.player.draw(ctx);
    }
