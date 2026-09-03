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
        const difficulty = Math.min(1.2, (levelId / 500) * 1.8);
        const width = 1200, height = 400;
        let platforms = [], traps = [], collectibles = [];
        let specials = { theme: theme.id };

        const numSegments = Math.floor(5 + difficulty * 8 + rand() * 3);
        let segments = [];
        let currentX = 50;
        for(let i=0; i<numSegments; i++) {
            let w = 60 + rand() * 140 + (10 - difficulty * 3);
            w = Math.max(40, Math.min(200, w));
            if(i === numSegments-1) w = 180;
            let y = height - 40 - rand() * 80;
            y = Math.max(100, Math.min(height-40, y));
            segments.push({x: currentX, y: y, w: w, h: 20});
            currentX += w + 30 + rand() * (50 + difficulty * 30);
        }
        
        // Ensure last segment is reachable
        const lastSeg = segments[segments.length-1];
        lastSeg.x = Math.min(lastSeg.x, width - 200);
        lastSeg.w = 180;
        
        const startSeg = segments[0];
        const playerStart = {x: startSeg.x + 20, y: startSeg.y - 40};
        const goal = {x: lastSeg.x + lastSeg.w - 50, y: lastSeg.y - 30, w: 30, h: 30};

        // Add Traps
        for(let i=0; i<segments.length-1; i++) {
            const seg = segments[i];
            let trapType = null;
            if(difficulty > 0.1 && rand() > 0.3) {
                const types = ['spike', 'fakeFloor', 'crusher', 'flappyPipe', 'angryBird', 'lion', 'eagle', 'snake'];
                trapType = types[Math.floor(rand() * types.length)];
                const trap = TrapFactory.create(trapType, seg.x + 20 + rand()*(seg.w-40), seg.y - 20);
                if(trap) traps.push(trap);
            }
            // Animal traps
            if(rand() > 0.5) {
                const animals = ['shark', 'wolf', 'bear', 'tiger', 'rhino', 'hippo', 'croc'];
                const animal = animals[Math.floor(rand() * animals.length)];
                const trap = TrapFactory.create(animal, seg.x + 10, seg.y - 30);
                if(trap) traps.push(trap);
            }
            // Flip Trap (Upside-down trick)
            if(difficulty > 0.3 && rand() > 0.65) {
                const flip = TrapFactory.create('flipTrigger', seg.x + seg.w/2 - 15, seg.y - 40);
                if(flip) traps.push(flip);
            }
        }

        // UFO in space/hard levels
        if(difficulty > 0.6 && rand() > 0.4) {
            traps.push(TrapFactory.create('ufo', 800 + rand()*200, 50 + rand()*100));
        }

        // Lava in hell/volcano
        if(theme.id === 'hell' || theme.id === 'volcano') {
            traps.push(TrapFactory.create('lava', 200, height-15));
            traps.push(TrapFactory.create('lava', 600, height-15));
        }

        // Collectibles
        for(let seg of segments) {
            if(rand() > 0.4) {
                collectibles.push({x: seg.x + seg.w/2 - 10, y: seg.y - 40 - rand()*40, w: 20, h: 20, collected: false});
            }
        }

        const levelData = {
            levelId, worldId, theme,
            width, height,
            playerStart, goal,
            platforms: segments,
            traps, collectibles,
            specials,
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