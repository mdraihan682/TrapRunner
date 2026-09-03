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
        
        // ===== 🚀 নতুন ডিফিকাল্টি স্কেল (Level 1 থেকেই কঠিন) =====
        // Level 1 → 0.5, Level 250 → 1.0, Level 500 → 1.5
        const difficulty = Math.min(1.6, 0.5 + (levelId / 500) * 1.0);
     
        const width = 1200, height = 400;
        let platforms = [], traps = [], collectibles = [];
        let specials = { theme: theme.id };

        // ===== ১. প্ল্যাটফর্ম তৈরি (কঠিনতর) =====
        // ডিফিকাল্টি বাড়লে প্ল্যাটফর্মের সংখ্যা বাড়ে, আকার ছোট হয় ও ফাঁকা জায়গা বাড়ে
        const numSegments = Math.floor(7 + difficulty * 8 + rand() * 3);
        let segments = [];
        let currentX = 50;
        
        for(let i=0; i<numSegments; i++) {
            // উচ্চ ডিফিকাল্টিতে প্ল্যাটফর্ম ছোট হয় (দাঁড়াতে কষ্ট হয়)
            let w = 60 + rand() * 120 + (20 - difficulty * 10);
            w = Math.max(35, Math.min(180, w));
            if(i === numSegments-1) w = 160;
            
            // উচ্চ ডিফিকাল্টিতে প্ল্যাটফর্ম উঁচু-নিচু হয় (লাফের টাইমিং কঠিন)
            let y = height - 40 - rand() * (60 + difficulty * 20);
            y = Math.max(80, Math.min(height-40, y));
            
            segments.push({x: currentX, y: y, w: w, h: 20});
            
            // ফাঁকা জায়গা (Gap) বাড়িয়ে দেওয়া হয়েছে
            const gap = 30 + rand() * (30 + difficulty * 40);
            currentX += w + gap;
        }
        
        // শেষ প্ল্যাটফর্ম ঠিক করা
        const lastSeg = segments[segments.length-1];
        lastSeg.x = Math.min(lastSeg.x, width - 200);
        lastSeg.w = 160;
        
        const startSeg = segments[0];
        const playerStart = {x: startSeg.x + 20, y: startSeg.y - 40};
        const goal = {x: lastSeg.x + lastSeg.w - 50, y: lastSeg.y - 30, w: 30, h: 30};

        // ===== ২. ট্র্যাপ যোগ করা (ভারী মাত্রায়) =====
        const availableTraps = TrapFactory.getTrapsForTheme(theme.id);
        
        for(let i=0; i<segments.length-1; i++) {
            const seg = segments[i];
            
            // প্রতি সেগমেন্টে ট্র্যাপ আসার সম্ভাবনা ৭০% থেকে ৯০% (ডিফিকাল্টি অনুযায়ী)
            const trapChance = 0.35 - difficulty * 0.1; // 0.5 হলে 0.3, 1.5 হলে 0.2
            if(rand() > trapChance) {
                const trapType = availableTraps[Math.floor(rand() * availableTraps.length)];
                const trap = TrapFactory.create(trapType, seg.x + 20 + rand()*(seg.w-40), seg.y - 20, theme.id);
                if(trap) traps.push(trap);
            }
            
            // দ্বিতীয় ট্র্যাপ (কঠিন লেভেলে বেশি হয়)
            if(difficulty > 0.4 && rand() > (0.7 - difficulty * 0.2)) {
                const extraType = availableTraps[Math.floor(rand() * availableTraps.length)];
                const trap = TrapFactory.create(extraType, seg.x + seg.w/2 - 15, seg.y - 40 - rand()*30, theme.id);
                if(trap) traps.push(trap);
            }
            
            // তৃতীয় ট্র্যাপ (খুব কঠিন লেভেলে - ৫০০ এর কাছাকাছি)
            if(difficulty > 1.2 && rand() > 0.6) {
                const extraType = availableTraps[Math.floor(rand() * availableTraps.length)];
                const trap = TrapFactory.create(extraType, seg.x + rand()*seg.w, seg.y - 60 - rand()*20, theme.id);
                if(trap) traps.push(trap);
            }
        }

        // ===== ৩. থিম-বিশেষ ট্র্যাপ (অতিরিক্ত) =====
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

        // ===== ৪. ইউএফও + এলিয়েন অ্যাটাক (কঠিন লেভেলে নিশ্চিত) =====
        if(difficulty > 0.8 && rand() > 0.4) {
            traps.push(TrapFactory.create('ufo', 800 + rand()*200, 50 + rand()*100, theme.id));
        }
        if(difficulty > 1.0 && rand() > 0.5) {
            traps.push(TrapFactory.create('alien', 600 + rand()*200, 50 + rand()*80, theme.id));
        }
        if(difficulty > 1.3 && rand() > 0.6) {
            traps.push(TrapFactory.create('angryBird', 500 + rand()*200, 100 + rand()*100, theme.id));
        }

        // ===== ৫. ফ্ল্যাপি বার্ড পাইপ (সবার জন্য) =====
        if(rand() > (0.7 - difficulty * 0.3)) { // ০.৫ হলে ০.৫৫, ১.৫ হলে ০.২৫ → বেশি আসে
            const idx = Math.floor(rand() * segments.length);
            const seg = segments[idx];
            traps.push(TrapFactory.create('flappyPipe', seg.x + seg.w/2 - 15, seg.y - 80, theme.id));
        }

        // ===== ৬. কলেক্টিবল (খুব কম কিন্তু লোভনীয়) =====
        for(let seg of segments) {
            if(rand() > (0.5 + difficulty * 0.2)) { // কঠিন লেভেলে কয়েন কম পাওয়া যায়
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
            difficulty // ডিবাগের জন্য রাখলাম
        };

        // ===== ৭. শেষ সুরক্ষা (নিশ্চিত ফিনিশযোগ্যতা) =====
        if(!LevelValidator.validate(levelData) || !LevelValidator.isReachable(levelData)) {
            // যদি কোনো কারণে অসম্ভব হয়ে যায়, তাহলে সোজা মাঠ বানিয়ে দাও
            levelData.platforms = [{x: 50, y: height-40, w: 1100, h: 20}];
            levelData.playerStart = {x: 60, y: height-60};
            levelData.goal = {x: 1100, y: height-60, w: 30, h: 30};
            levelData.traps = [];
            console.warn(`Level ${levelId} fixed by fallback.`);
        }
        return levelData;
    }
}
