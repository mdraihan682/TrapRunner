class Player {
    constructor(x, y) {
        this.x = x; this.y = y; 
        this.w = 34; this.h = 40;
        this.vx = 0; this.vy = 0;
        this.onGround = false;
        this.facing = 1;
        this.alive = true;
        this.deathTimer = 0;
        this.skin = 'fat';
    }

    draw(ctx) {
        if(!this.alive && this.deathTimer % 10 < 5) return;
        ctx.save();
        ctx.translate(this.x + this.w/2, this.y + this.h/2);
        
        // Fat Body
        ctx.fillStyle = '#f5a623';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.w/2, this.h/2.5, 0, 0, Math.PI*2);
        ctx.fill();
        
        // Belly
        ctx.fillStyle = '#f7c948';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.ellipse(0, 8, 12, 14, 0, 0, Math.PI*2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#f5a623';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, -14, 14, 0, Math.PI*2);
        ctx.fill();
        
        // Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-6, -18, 5, 0, Math.PI*2);
        ctx.arc(6, -18, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(-6 + this.facing*2, -18, 2.5, 0, Math.PI*2);
        ctx.arc(6 + this.facing*2, -18, 2.5, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    jump() {
        if(this.onGround && this.alive) {
            this.vy = -9;
            this.onGround = false;
        }
    }

    moveLeft() { this.vx = -4.5; this.facing = -1; }
    moveRight() { this.vx = 4.5; this.facing = 1; }

    die() {
        if(!this.alive) return;
        this.alive = false;
        this.deathTimer = 30;
    }

    respawn(x, y) {
        this.x = x; this.y = y;
        this.vx = 0; this.vy = 0;
        this.alive = true;
        this.onGround = false;
    }
}