class TrapFactory {
    static create(type, x, y, themeId) {
        const traps = {
            // ===== মৌলিক ট্র্যাপ =====
            spike: () => ({ x, y, w: 20, h: 15, type: 'spike', damage: true, color: '#ff4444' }),
            fakeFloor: () => ({ x, y: y-2, w: 40, h: 5, type: 'fakeFloor', damage: false, color: '#4a6fa5' }),
            crusher: () => ({ x: x-15, y: y-60, w: 30, h: 30, type: 'crusher', startY: y-60, endY: y-20, speed: 1.5, dir: 1, damage: true, color: '#8B0000' }),
            flappyPipe: () => ({ x, y, w: 30, h: 80, type: 'flappyPipe', gap: 60, damage: true, color: '#2a6a2a' }),
            angryBird: () => ({ x, y, w: 30, h: 30, type: 'angryBird', speed: 2, dir: 1, damage: true, color: '#ff0000' }),
            saw: () => ({ x, y, w: 25, h: 25, type: 'saw', speed: 2, damage: true, color: '#c0c0c0' }),
            laser: () => ({ x, y, w: 80, h: 10, type: 'laser', active: false, timer: 0, damage: true, color: '#ff00ff' }),
            flame: () => ({ x, y, w: 20, h: 40, type: 'flame', count: 0, damage: true, color: '#ff4500' }),
            quicksand: () => ({ x, y, w: 40, h: 10, type: 'quicksand', damage: false, color: '#b8860b' }),
            lava: () => ({ x, y, w: 60, h: 15, type: 'lava', damage: true, color: '#ff4500' }),

            // ===== অ্যানিমেল ট্র্যাপ (২৫টি) =====
            lion: () => ({ x, y, w: 40, h: 30, type: 'lion', speed: 1.5, dir: 1, damage: true, color: '#d4a373' }),
            eagle: () => ({ x, y, w: 35, h: 25, type: 'eagle', speed: 2, dir: 1, damage: true, color: '#8a6a4a' }),
            snake: () => ({ x, y, w: 30, h: 15, type: 'snake', speed: 1, dir: 1, damage: true, color: '#2a6a2a' }),
            shark: () => ({ x, y, w: 40, h: 20, type: 'shark', speed: 1.8, dir: 1, damage: true, color: '#4a6a8a' }),
            wolf: () => ({ x, y, w: 35, h: 25, type: 'wolf', speed: 2.2, dir: 1, damage: true, color: '#6a6a6a' }),
            bear: () => ({ x, y, w: 45, h: 35, type: 'bear', speed: 1.2, dir: 1, damage: true, color: '#5a3a2a' }),
            tiger: () => ({ x, y, w: 40, h: 30, type: 'tiger', speed: 2, dir: 1, damage: true, color: '#c87a2a' }),
            rhino: () => ({ x, y, w: 50, h: 30, type: 'rhino', speed: 1.5, dir: 1, damage: true, color: '#6a6a6a' }),
            hippo: () => ({ x, y, w: 45, h: 25, type: 'hippo', speed: 1, dir: 1, damage: true, color: '#4a5a4a' }),
            croc: () => ({ x, y, w: 40, h: 20, type: 'croc', speed: 1.5, dir: 1, damage: true, color: '#2a5a2a' }),
            frog: () => ({ x, y, w: 25, h: 20, type: 'frog', speed: 1.2, dir: 1, damage: true, color: '#3a8a3a' }),
            bat: () => ({ x, y, w: 25, h: 20, type: 'bat', speed: 2.5, dir: 1, damage: true, color: '#3a3a4a' }),
            scorpion: () => ({ x, y, w: 25, h: 15, type: 'scorpion', speed: 1.8, dir: 1, damage: true, color: '#8a6a2a' }),
            demon: () => ({ x, y, w: 35, h: 35, type: 'demon', speed: 1.3, dir: 1, damage: true, color: '#8a0a0a' }),
            ghost: () => ({ x, y, w: 30, h: 35, type: 'ghost', speed: 0.8, dir: 1, damage: true, color: '#c0c0e0' }),
            robot: () => ({ x, y, w: 35, h: 35, type: 'robot', speed: 1.2, dir: 1, damage: true, color: '#4a6a8a' }),
            alien: () => ({ x, y, w: 30, h: 35, type: 'alien', speed: 1.5, dir: 1, damage: true, color: '#3a8a3a' }),
            ufo: () => ({ x, y, w: 40, h: 20, type: 'ufo', speed: 1.2, dir: 1, damage: true, color: '#7a7a8a' }),
            crystal: () => ({ x, y, w: 25, h: 25, type: 'crystal', damage: true, color: '#aaddff' }),
            neon: () => ({ x, y, w: 20, h: 20, type: 'neon', speed: 2, dir: 1, damage: true, color: '#ff00ff' }),
            glitch: () => ({ x, y, w: 25, h: 25, type: 'glitch', damage: true, color: '#00ff00' }),
            snowball: () => ({ x, y, w: 20, h: 20, type: 'snowball', speed: 1.5, dir: 1, damage: true, color: '#ffffff' }),
            lightning: () => ({ x, y, w: 10, h: 40, type: 'lightning', timer: 0, damage: true, color: '#ffff00' }),
            rock: () => ({ x, y, w: 25, h: 20, type: 'rock', speed: 0.8, dir: 1, damage: true, color: '#6a6a6a' }),
            cloud: () => ({ x, y, w: 50, h: 20, type: 'cloud', speed: 1, dir: 1, damage: false, color: '#ffffff' })
        };

        if (traps[type]) return traps[type]();
        return null;
    }

    static getTrapsForTheme(themeId) {
        return ThemeManager.getTrapsForTheme(themeId);
    }

    static getRandomTrapForTheme(themeId) {
        const traps = this.getTrapsForTheme(themeId);
        return traps[Math.floor(Math.random() * traps.length)];
    }
}
