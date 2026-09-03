
class LevelGenerator {
    static seededRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };
    }
    static generate(levelId) {
        const rand = this.seededRandom(levelId * 777 + 13);
        const worldId = Math.floor((levelId - 1) / 20) + 1;
        const theme = ThemeManager.getTheme(worldId);
        const difficulty = Math.min(1.6, 0.5 + (levelId / 500) * 1.0);
        const width = 1200, height = 400;
        let platforms = [], traps = [], collectibles = [];
        
        const numSegments = Math.floor(7 + difficulty * 8 + rand() * 3);
        let segments = [], cx = 50;
        for(let i=0; i<numSegments; i++) {
            let w = 60 + rand() * 120 + (20 - difficulty * 10);
            w = Math.max(35, Math.min(180, w));
            if(i === numSegments-1) w = 160;
            let y = height - 40 - rand() * (60 + difficulty * 20);
            y = Math.max(80, Math.min(height-40, y));
            segments.push({x: cx, y: y, w: w, h: 20});
            cx += w + (30 + rand() * (30 + difficulty * 40));
        }
        const lastSeg = segments[segments.length-1];
        lastSeg.x = Math.min(lastSeg.x, width - 200);
        lastSeg.w = 160;
        const startSeg = segments[0];
        const playerStart = {x: startSeg.x + 20, y: startSeg.y - 40};
        const goal = {x: lastSeg.x + lastSeg.w - 50, y: lastSeg.y - 30, w: 30, h: 30};

        const trapTypes = ['spike', 'crusher', 'lion', 'ufo', 'flappyPipe', 'lava', 'laser'];
        for(let i=0; i<segments.length-1; i++) {
            const seg = segments[i];
            if(rand() > 0.4) {
                const type = trapTypes[Math.floor(rand() * trapTypes.length)];
                const trap = TrapFactory.create(type, seg.x + 20 + rand()*(seg.w-40), seg.y - 20);
                if(trap) traps.push(trap);
            }
            if(difficulty > 0.6 && rand() > 0.5) {
                const type = trapTypes[Math.floor(rand() * trapTypes.length)];
                const trap = TrapFactory.create(type, seg.x + seg.w/2 - 15, seg.y - 40 - rand()*30);
                if(trap) traps.push(trap);
            }
        }
        if(difficulty > 0.8 && rand() > 0.5) {
            const idx = Math.floor(rand() * segments.length);
            const seg = segments[idx];
            traps.push(TrapFactory.create('flipTrigger', seg.x + seg.w/2 - 15, seg.y - 40));
        }

        for(let seg of segments) {
            if(rand() > 0.5) {
                collectibles.push({x: seg.x + seg.w/2 - 10, y: seg.y - 40 - rand()*40, w: 20, h: 20, collected: false});
            }
        }

        const levelData = {
            levelId, worldId, theme,
            width, height,
            playerStart, goal,
            platforms: segments,
            traps, collectibles,
            difficulty
        };
        if(!LevelValidator.validate(levelData) || !LevelValidator.isReachable(levelData)) {
            levelData.platforms = [{x: 50, y: height-40, w: 1100, h: 20}];
            levelData.playerStart = {x: 60, y: height-60};
            levelData.goal = {x: 1100, y: height-60, w: 30, h: 30};
            levelData.traps = [];
        }
        return levelData;
    }
}
