class LevelValidator {
    static validate(levelData) {
        if (!levelData.playerStart || !levelData.goal || !levelData.platforms || levelData.platforms.length === 0) return false;
        for(let e of [...levelData.platforms, ...levelData.traps, levelData.goal]) {
            if(e.x === undefined || e.y === undefined || e.w === undefined || e.h === undefined) return false;
            if(isNaN(e.x) || isNaN(e.y)) return false;
        }
        return true;
    }
    static isReachable(levelData) {
        const start = levelData.playerStart;
        const goal = levelData.goal;
        const platforms = levelData.platforms;
        const isOnPlatform = (x, y) => {
            for(let p of platforms) {
                if(x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) return true;
            }
            return false;
        };
        const visited = new Set();
        const queue = [{x: start.x, y: start.y}];
        const step = 15;
        while(queue.length > 0) {
            const cur = queue.shift();
            const key = `${Math.round(cur.x/step)},${Math.round(cur.y/step)}`;
            if(visited.has(key)) continue;
            visited.add(key);
            if(Math.abs(cur.x - goal.x) < 30 && Math.abs(cur.y - goal.y) < 30) return true;
            const dirs = [[step,0],[-step,0],[0, step],[0, -step]];
            for(let d of dirs) {
                const nx = cur.x + d[0];
                const ny = cur.y + d[1];
                if(isOnPlatform(nx, ny) || isOnPlatform(nx, ny + 10)) queue.push({x: nx, y: ny});
            }
        }
        return false;
    }
}