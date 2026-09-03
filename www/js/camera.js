class Camera {
    constructor() {
        this.x = 0; this.y = 0;
        this.targetX = 0; this.targetY = 0;
        this.lerp = 0.08;
    }

    follow(player, canvasW, canvasH, levelW, levelH) {
        this.targetX = player.x - canvasW/2;
        this.targetY = player.y - canvasH/2;
        this.x += (this.targetX - this.x) * this.lerp;
        this.y += (this.targetY - this.y) * this.lerp;
        this.x = Math.max(0, Math.min(this.x, levelW - canvasW));
        this.y = Math.max(-50, Math.min(this.y, levelH - canvasH));
    }

    apply(ctx) {
        ctx.translate(-this.x, -this.y);
    }
}