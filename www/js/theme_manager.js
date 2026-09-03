class ThemeManager {
    static themes = [
        // ১-১০: ক্লাসিক থিম
        { id: 'green', name: 'Green Valley', bg: '#1a3a2a', ground: '#3a6a3a', sky: '#4a8a5a', particle: 'leaf', env: { sun: false, moon: false, rain: false, thunder: false, snow: false, waves: false, lava: false } },
        { id: 'amazon', name: 'Amazon Rain', bg: '#0a2a1a', ground: '#2a5a2a', sky: '#3a6a3a', particle: 'rain', env: { rain: true, sun: false } },
        { id: 'desert', name: 'Scorching Desert', bg: '#c8a050', ground: '#a08030', sky: '#e8c870', particle: 'sand', env: { sun: true, heat: true } },
        { id: 'ocean', name: 'Deep Ocean', bg: '#0a3a5a', ground: '#1a5a8a', sky: '#2a6a9a', particle: 'wave', env: { waves: true } },
        { id: 'ice', name: 'Siberian Ice', bg: '#c0d8e0', ground: '#e0f0f0', sky: '#f0f8ff', particle: 'snow', env: { snow: true } },
        { id: 'volcano', name: 'Volcano', bg: '#3a0a0a', ground: '#5a1a0a', sky: '#7a2a0a', particle: 'fire', env: { lava: true } },
        { id: 'hell', name: 'Hell Fire', bg: '#1a0000', ground: '#4a0a00', sky: '#6a0a00', particle: 'lava', env: { lava: true, fire: true } },
        { id: 'haunted', name: 'Haunted Mansion', bg: '#1a1a2a', ground: '#2a2a3a', sky: '#3a2a4a', particle: 'ghost', env: { moon: true } },
        { id: 'cave', name: 'Deep Cave', bg: '#0a0a0a', ground: '#1a1a1a', sky: '#0a0a1a', particle: 'bat', env: { dark: true } },
        { id: 'temple', name: 'Ancient Temple', bg: '#2a2a1a', ground: '#4a4a2a', sky: '#5a4a3a', particle: 'dust', env: { sun: true } },
        // ১১-২০: ফ্যান্টাসি থিম
        { id: 'sky', name: 'Sky Kingdom', bg: '#8ac4ff', ground: '#d4a373', sky: '#aad4ff', particle: 'cloud', env: { sun: true, cloud: true } },
        { id: 'space', name: 'Outer Space', bg: '#0a0a1a', ground: '#2a2a4a', sky: '#1a1a3a', particle: 'star', env: { moon: true, stars: true } },
        { id: 'alien', name: 'Alien Planet', bg: '#1a2a1a', ground: '#3a5a3a', sky: '#2a4a2a', particle: 'ufo', env: { alien: true } },
        { id: 'factory', name: 'Robot Factory', bg: '#2a2a2a', ground: '#4a4a4a', sky: '#3a3a3a', particle: 'smoke', env: { gears: true } },
        { id: 'city', name: 'Mega City', bg: '#1a1a2a', ground: '#3a3a5a', sky: '#2a2a4a', particle: 'neon', env: { neon: true } },
        { id: 'storm', name: 'Storm World', bg: '#2a2a3a', ground: '#4a4a4a', sky: '#3a3a4a', particle: 'lightning', env: { thunder: true, rain: true } },
        { id: 'dream', name: 'Dream World', bg: '#2a1a3a', ground: '#5a3a6a', sky: '#4a2a5a', particle: 'bubble', env: { rainbow: true } },
        { id: 'glitch', name: 'Glitch World', bg: '#1a1a1a', ground: '#3a3a3a', sky: '#2a2a2a', particle: 'pixel', env: { glitch: true } },
        { id: 'chaos', name: 'Chaos', bg: '#2a0a0a', ground: '#4a1a2a', sky: '#3a0a1a', particle: 'fire', env: { chaos: true } },
        { id: 'final', name: 'Final World', bg: '#0a0a1a', ground: '#1a0a2a', sky: '#1a0a3a', particle: 'crown', env: { sun: true, moon: true } },
        // ২১-২৫: এক্সট্রা থিম
        { id: 'swamp', name: 'Swamp', bg: '#1a2a0a', ground: '#2a4a1a', sky: '#3a5a2a', particle: 'frog', env: { rain: true } },
        { id: 'cloud9', name: 'Cloud 9', bg: '#d0e8ff', ground: '#f0f8ff', sky: '#e0f0ff', particle: 'cloud', env: { sun: true, cloud: true } },
        { id: 'cyber', name: 'Cyberpunk', bg: '#0a0a2a', ground: '#2a0a4a', sky: '#1a0a3a', particle: 'matrix', env: { neon: true } },
        { id: 'neon', name: 'Neon Night', bg: '#1a0a2a', ground: '#3a1a5a', sky: '#2a0a4a', particle: 'neon', env: { neon: true } },
        { id: 'crystal', name: 'Crystal Cave', bg: '#e0f0ff', ground: '#c0d8f0', sky: '#d0e8ff', particle: 'shine', env: { crystal: true } }
    ];

    static getTheme(worldId) {
        const idx = (worldId - 1) % this.themes.length;
        return this.themes[idx];
    }

    // থিম অনুযায়ী ট্র্যাপ তালিকা
    static getTrapsForTheme(themeId) {
        const trapMap = {
            'green': ['spike', 'fakeFloor', 'crusher', 'lion', 'eagle'],
            'amazon': ['spike', 'snake', 'croc', 'frog', 'flappyPipe'],
            'desert': ['spike', 'quicksand', 'scorpion', 'saw', 'crusher'],
            'ocean': ['shark', 'wave', 'croc', 'spike', 'flappyPipe'],
            'ice': ['spike', 'slippery', 'iceCrusher', 'snowball', 'eagle'],
            'volcano': ['lava', 'fire', 'crusher', 'spike', 'rock'],
            'hell': ['lava', 'fire', 'demon', 'spike', 'crusher', 'flame'],
            'haunted': ['ghost', 'spike', 'fakeFloor', 'bat', 'crusher'],
            'cave': ['spike', 'bat', 'snake', 'crusher', 'fakeFloor'],
            'temple': ['spike', 'crusher', 'snake', 'saw', 'flappyPipe'],
            'sky': ['eagle', 'cloud', 'spike', 'flappyPipe', 'crusher'],
            'space': ['ufo', 'alien', 'laser', 'spike', 'crusher'],
            'alien': ['alien', 'ufo', 'spike', 'laser', 'flappyPipe'],
            'factory': ['robot', 'saw', 'crusher', 'spike', 'laser'],
            'city': ['spike', 'saw', 'crusher', 'flappyPipe', 'neon'],
            'storm': ['lightning', 'spike', 'crusher', 'flappyPipe', 'angryBird'],
            'dream': ['bubble', 'spike', 'fakeFloor', 'crusher', 'flappyPipe'],
            'glitch': ['glitch', 'spike', 'fakeFloor', 'crusher', 'flappyPipe'],
            'chaos': ['spike', 'crusher', 'flappyPipe', 'angryBird', 'ufo'],
            'final': ['spike', 'crusher', 'flappyPipe', 'angryBird', 'ufo', 'laser', 'demon'],
            'swamp': ['spike', 'snake', 'croc', 'frog', 'quicksand'],
            'cloud9': ['eagle', 'cloud', 'spike', 'flappyPipe', 'crusher'],
            'cyber': ['robot', 'laser', 'spike', 'crusher', 'flappyPipe'],
            'neon': ['neon', 'spike', 'crusher', 'flappyPipe', 'saw'],
            'crystal': ['crystal', 'spike', 'crusher', 'flappyPipe', 'saw']
        };
        return trapMap[themeId] || ['spike', 'fakeFloor', 'crusher'];
    }
}
