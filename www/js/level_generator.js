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
        const difficulty = Math.min(1.3, (levelId / 500) * 2.0);
        const width = 1200, height = 400;
        let platforms = [], traps = [], collectibles = [];
        let specials = { theme: theme.id };

        // প্ল্যাটফর্ম জেনারেশন
        const numSegments = Math.floor(6 + difficulty * 8 + rand() * 3);
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
        
        const lastSeg = segments[segments.length-1];
        lastSeg.x = Math.min(lastSeg.x, width - 200);
        lastSeg.w = 180;
        
        const startSeg = segments[0];
        const playerStart = {x: startSeg.x + 20, y: startSeg.y - 40};
        const goal = {x: lastSeg.x + lastSeg.w - 50, y: lastSeg.y - 30, w: 30, h: 30};

        // ===== থিম অনুযায়ী ট্র্যাপ যোগ =====
        const availableTraps = TrapFactory.getTrapsForTheme(theme.id);
        
        for(let i=0; i<segments.length-1; i++) {
            const seg = segments[i];
            // প্রতি সেগমেন্টে ১-২টি ট্র্যাপ
            if(rand() > 0.2) {
                const trapType = availableTraps[Math.floor(rand() * availableTraps.length)];
                const trap = TrapFactory.create(trapType, seg.x + 20 + rand()*(seg.w-40), seg.y - 20, theme.id);
                if(trap) traps.push(trap);
            }
            // বাড়তি ট্র্যাপ (কঠিন লেভেলে)
            if(difficulty > 0.4 && rand() > 0.5) {
                const extraType = availableTraps[Math.floor(rand() * availableTraps.length)];
                const trap = TrapFactory.create(extraType, seg.x + seg.w/2 - 15, seg.y - 40 - rand()*30, theme.id);
                if(trap) traps.push(trap);
            }
        }

        // থিম-বিশেষ ট্র্যাপ (অতিরিক্ত)
        if(theme.id === 'hell' || theme.id === 'volcano') {
            traps.push(TrapFactory.create('lava', 200, height-15, theme.id));
            traps.push(TrapFactory.create('lava', 600, height-15, theme.id));
            traps.push(TrapFactory.create('flame', 400, height-40, theme.id));
        }
        if(theme.id === 'ocean') {
            traps.push(TrapFactory.create('shark', 300, height-25, theme.id));
            traps.push(TrapFactory.create('croc', 700, height-25, theme.id));
        }
        if(theme.id === 'space' || theme.id === 'alien') {
            traps.push(TrapFactory.create('ufo', 800, 50, theme.id));
            traps.push(TrapFactory.create('laser', 500, 100, theme.id));
        }
        if(theme.id === 'storm') {
            traps.push(TrapFactory.create('lightning', 300, 50, theme.id));
            traps.push(TrapFactory.create('lightning', 700, 50, theme.id));
        }
        if(theme.id === 'ice') {
            traps.push(TrapFactory.create('snowball', 400, 50, theme.id));
        }

        // UFO এলিয়েন অ্যাটাক (শক্ত লেভেলে)
        if(difficulty > 0.6 && rand() > 0.4) {
            traps.push(TrapFactory.create('ufo', 800 + rand()*200, 50 + rand()*100, theme.id));
            traps.push(TrapFactory.create('alien', 600 + rand()*200, 50 + rand()*80, theme.id));
        }

        // ফ্ল্যাপি বার্ড পাইপ (মাঝে মাঝে)
        if(rand() > 0.6 && difficulty > 0.3) {
            const idx = Math.floor(rand() * segments.length);
            const seg = segments[idx];
            traps.push(TrapFactory.create('flappyPipe', seg.x + seg.w/2 - 15, seg.y - 80, theme.id));
        }

        // অ্যাংরি বার্ড (হার্ড লেভেলে)
        if(difficulty > 0.7 && rand() > 0.5) {
            traps.push(TrapFactory.create('angryBird', 500 + rand()*200, 100 + rand()*100, theme.id));
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

        // ভ্যালিডেশন (নিশ্চিত ফিনিশযোগ্যতা)
        if(!LevelValidator.validate(levelData) || !LevelValidator.isReachable(levelData)) {
            // ফলব্যাক প্ল্যান
            levelData.platforms = [{x: 50, y: height-40, w: 1100, h: 20}];
            levelData.playerStart = {x: 60, y: height-60};
            levelData.goal = {x: 1100, y: height-60, w: 30, h: 30};
            levelData.traps = [];
        }
        return levelData;
    }
}
