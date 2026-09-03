class ThemeManager {
    static themes = [
        { id: 'green', name: 'Green Valley', bg: '#1a3a2a', ground: '#3a6a3a', particle: 'leaves' },
        { id: 'amazon', name: 'Amazon', bg: '#0a2a1a', ground: '#2a5a2a', particle: 'rain' },
        { id: 'desert', name: 'Desert', bg: '#c8a050', ground: '#a08030', particle: 'sand' },
        { id: 'ocean', name: 'Ocean', bg: '#0a3a5a', ground: '#1a5a8a', particle: 'wave' },
        { id: 'ice', name: 'Siberian Ice', bg: '#c0d8e0', ground: '#e0f0f0', particle: 'snow' },
        { id: 'volcano', name: 'Volcano', bg: '#3a0a0a', ground: '#5a1a0a', particle: 'fire' },
        { id: 'hell', name: 'Hell', bg: '#1a0000', ground: '#4a0a00', particle: 'lava' },
        { id: 'haunted', name: 'Haunted', bg: '#1a1a2a', ground: '#2a2a3a', particle: 'ghost' },
        { id: 'cave', name: 'Deep Cave', bg: '#0a0a0a', ground: '#1a1a1a', particle: 'bats' },
        { id: 'temple', name: 'Ancient Temple', bg: '#2a2a1a', ground: '#4a4a2a', particle: 'dust' },
        { id: 'sky', name: 'Sky Kingdom', bg: '#8ac4ff', ground: '#d4a373', particle: 'cloud' },
        { id: 'space', name: 'Space', bg: '#0a0a1a', ground: '#2a2a4a', particle: 'star' },
        { id: 'alien', name: 'Alien Planet', bg: '#1a2a1a', ground: '#3a5a3a', particle: 'ufo' },
        { id: 'factory', name: 'Robot Factory', bg: '#2a2a2a', ground: '#4a4a4a', particle: 'smoke' },
        { id: 'city', name: 'Mega City', bg: '#1a1a2a', ground: '#3a3a5a', particle: 'neon' },
        { id: 'storm', name: 'Storm', bg: '#2a2a3a', ground: '#4a4a4a', particle: 'lightning' },
        { id: 'dream', name: 'Dream World', bg: '#2a1a3a', ground: '#5a3a6a', particle: 'bubble' },
        { id: 'glitch', name: 'Glitch World', bg: '#1a1a1a', ground: '#3a3a3a', particle: 'pixel' },
        { id: 'chaos', name: 'Chaos', bg: '#2a0a0a', ground: '#4a1a2a', particle: 'fire' },
        { id: 'final', name: 'Final World', bg: '#0a0a1a', ground: '#1a0a2a', particle: 'crown' },
        { id: 'swamp', name: 'Swamp', bg: '#1a2a0a', ground: '#2a4a1a', particle: 'frog' },
        { id: 'cloud', name: 'Cloud 9', bg: '#d0e8ff', ground: '#f0f8ff', particle: 'cloud' },
        { id: 'cyber', name: 'Cyberpunk', bg: '#0a0a2a', ground: '#2a0a4a', particle: 'matrix' },
        { id: 'neon', name: 'Neon Night', bg: '#1a0a2a', ground: '#3a1a5a', particle: 'neon' },
        { id: 'crystal', name: 'Crystal Cave', bg: '#e0f0ff', ground: '#c0d8f0', particle: 'shine' }
    ];
    static getTheme(worldId) {
        const idx = (worldId - 1) % this.themes.length;
        return this.themes[idx];
    }
}