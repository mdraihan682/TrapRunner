class AchievementManager {
    static list = [
        { id: 'first', name: 'First Step', desc: 'Complete Level 1', check: s => s.completedLevels.includes(1) },
        { id: '10lv', name: 'Explorer', desc: 'Complete 10 levels', check: s => s.completedLevels.length >= 10 },
        { id: '25lv', name: 'Adventurer', desc: 'Complete 25 levels', check: s => s.completedLevels.length >= 25 },
        { id: '50lv', name: 'Hero', desc: 'Complete 50 levels', check: s => s.completedLevels.length >= 50 },
        { id: '100lv', name: 'Champion', desc: 'Complete 100 levels', check: s => s.completedLevels.length >= 100 },
        { id: '250lv', name: 'Legend', desc: 'Complete 250 levels', check: s => s.completedLevels.length >= 250 },
        { id: '500lv', name: 'Trap Master', desc: 'Complete ALL 500 levels!', check: s => s.completedLevels.length >= 500 },
        { id: 'perfect', name: 'Perfectionist', desc: '0 deaths on a level', check: s => Object.values(s.bestScores).some(v => v > 0) },
        { id: 'rich', name: 'Rich', desc: 'Collect 1000 coins', check: s => s.coins >= 1000 },
    ];

    static checkAll(saveData) {
        let unlocked = saveData.achievements || [];
        let changed = false;
        for(let ach of this.list) {
            if(!unlocked.includes(ach.id) && ach.check(saveData)) {
                unlocked.push(ach.id);
                changed = true;
            }
        }
        if(changed) {
            saveData.achievements = unlocked;
            SaveManager.save(saveData);
        }
        return unlocked;
    }
}