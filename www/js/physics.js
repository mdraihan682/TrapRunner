class Physics {
    static resolveCollisions(entity, platforms) {
        let onGround = false;
        for(let p of platforms) {
            if(this.aabb(entity, p)) {
                const overlapX = Math.min(entity.x + entity.w, p.x + p.w) - Math.max(entity.x, p.x);
                const overlapY = Math.min(entity.y + entity.h, p.y + p.h) - Math.max(entity.y, p.y);
                if(overlapX < overlapY) {
                    if(entity.vx > 0) entity.x = p.x - entity.w;
                    else entity.x = p.x + p.w;
                    entity.vx = 0;
                } else {
                    if(entity.vy > 0) { entity.y = p.y - entity.h; entity.vy = 0; onGround = true; }
                    else { entity.y = p.y + p.h; entity.vy = 0; }
                }
            }
        }
        return onGround;
    }

    static aabb(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    static resolveTraps(entity, traps) {
        for(let t of traps) {
            if(t.type === 'flipTrigger' && t.active === false) continue;
            if(this.aabb(entity, t)) {
                if(t.damage) return true;
                if(t.type === 'flipTrigger' && t.active !== false) return true;
            }
        }
        return false;
    }
}