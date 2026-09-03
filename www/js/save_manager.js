class SaveManager {
    static get() {
        try {
            const data = localStorage.getItem('fatRunnerSave');
            if(data) return JSON.parse(data);
        } catch(e) { console.warn("Save corrupted."); }
        return this.defaults();
    }
    static defaults() {
        return {
            unlockedLevel: 1,
            completedLevels: [],
            bestTimes: {},
            bestScores: {},
            coins: 0,
            ownedCosmetics: [],
            equippedCosmetic: null,
            achievements: [],
            settings: { sound: true, vibration: true },
            adsRemoved: false
        };
    }
    static save(data) {
        localStorage.setItem('fatRunnerSave', JSON.stringify(data));
    }
    static unlockLevel(id) {
        const s = this.get();
        if(id > s.unlockedLevel) s.unlockedLevel = id;
        this.save(s);
        return s;
    }
    static completeLevel(id, time, deaths, coins) {
        const s = this.get();
        if(!s.completedLevels.includes(id)) s.completedLevels.push(id);
        if(!s.bestTimes[id] || time < s.bestTimes[id]) s.bestTimes[id] = time;
        if(!s.bestScores[id] || coins > s.bestScores[id]) s.bestScores[id] = coins;
        s.coins += coins;
        if(id >= s.unlockedLevel) s.unlockedLevel = id + 1;
        this.save(s);
        AchievementManager.checkAll(s);
        return s;
    }
    static addCoins(amount) {
        const s = this.get();
        s.coins += amount;
        this.save(s);
        return s.coins;
    }
}