class TrapFactory {
    static traps = {
        spike: (x, y) => ({ x, y, w: 20, h: 15, type: 'spike', damage: true }),
        fakeFloor: (x, y) => ({ x, y: y-2, w: 40, h: 5, type: 'fakeFloor', damage: false }),
        crusher: (x, y) => ({ x: x-15, y: y-60, w: 30, h: 30, type: 'crusher', startY: y-60, endY: y-20, speed: 1.5, dir: 1, damage: true }),
        flappyPipe: (x, y) => ({ x, y, w: 30, h: 80, type: 'flappyPipe', gap: 60, damage: true }),
        angryBird: (x, y) => ({ x, y, w: 30, h: 30, type: 'angryBird', speed: 2, dir: 1, damage: true }),
        lion: (x, y) => ({ x, y, w: 40, h: 30, type: 'lion', speed: 1.5, dir: 1, damage: true }),
        eagle: (x, y) => ({ x, y, w: 35, h: 25, type: 'eagle', speed: 2, dir: 1, damage: true }),
        snake: (x, y) => ({ x, y, w: 30, h: 15, type: 'snake', speed: 1, dir: 1, damage: true }),
        shark: (x, y) => ({ x, y, w: 40, h: 20, type: 'shark', speed: 1.8, dir: 1, damage: true }),
        wolf: (x, y) => ({ x, y, w: 35, h: 25, type: 'wolf', speed: 2.2, dir: 1, damage: true }),
        bear: (x, y) => ({ x, y, w: 45, h: 35, type: 'bear', speed: 1.2, dir: 1, damage: true }),
        tiger: (x, y) => ({ x, y, w: 40, h: 30, type: 'tiger', speed: 2, dir: 1, damage: true }),
        rhino: (x, y) => ({ x, y, w: 50, h: 30, type: 'rhino', speed: 1.5, dir: 1, damage: true }),
        hippo: (x, y) => ({ x, y, w: 45, h: 25, type: 'hippo', speed: 1, dir: 1, damage: true }),
        croc: (x, y) => ({ x, y, w: 40, h: 20, type: 'croc', speed: 1.5, dir: 1, damage: true }),
        ufo: (x, y) => ({ x, y, w: 40, h: 20, type: 'ufo', speed: 1.2, dir: 1, damage: true }),
        flipTrigger: (x, y) => ({ x, y, w: 30, h: 30, type: 'flipTrigger', damage: false, duration: 180, active: true }),
        lava: (x, y) => ({ x, y, w: 60, h: 15, type: 'lava', damage: true }),
        quicksand: (x, y) => ({ x, y, w: 40, h: 10, type: 'quicksand', damage: false }),
        saw: (x, y) => ({ x, y, w: 25, h: 25, type: 'saw', damage: true, speed: 2 }),
        flame: (x, y) => ({ x, y, w: 20, h: 40, type: 'flame', damage: true, count: 0 }),
        laser: (x, y) => ({ x, y, w: 80, h: 10, type: 'laser', damage: true, active: false, timer: 0 }),
        trapdoor: (x, y) => ({ x, y, w: 40, h: 10, type: 'trapdoor', damage: false, triggered: false }),
    };

    static create(type, x, y) {
        if (this.traps[type]) return this.traps[type](x, y);
        return null;
    }

    static getRandomTrap() {
        const keys = Object.keys(this.traps);
        return keys[Math.floor(Math.random() * keys.length)];
    }
}