class ShopManager {
    static items = [
        // Skins
        { id: 'ninja', name: 'Ninja', category: 'skins', priceUsd: 0.50, emoji: '🥷' },
        { id: 'astro', name: 'Astronaut', category: 'skins', priceUsd: 0.50, emoji: '👨‍🚀' },
        { id: 'robot', name: 'Cyborg', category: 'skins', priceUsd: 0.50, emoji: '🤖' },
        { id: 'ghost', name: 'Ghostly', category: 'skins', priceUsd: 0.50, emoji: '👻' },
        { id: 'alien', name: 'Alien', category: 'skins', priceUsd: 0.50, emoji: '👽' },
        { id: 'demon', name: 'Demon', category: 'skins', priceUsd: 0.50, emoji: '😈' },
        { id: 'angel', name: 'Angel', category: 'skins', priceUsd: 0.50, emoji: '👼' },
        { id: 'pirate', name: 'Pirate', category: 'skins', priceUsd: 0.50, emoji: '🏴‍☠️' },
        { id: 'cowboy', name: 'Cowboy', category: 'skins', priceUsd: 0.50, emoji: '🤠' },
        { id: 'super', name: 'Superhero', category: 'skins', priceUsd: 0.50, emoji: '🦸' },
        // Hats
        { id: 'tophat', name: 'Top Hat', category: 'hats', priceUsd: 0.50, emoji: '🎩' },
        { id: 'cap', name: 'Baseball Cap', category: 'hats', priceUsd: 0.50, emoji: '🧢' },
        { id: 'crown', name: 'Crown', category: 'hats', priceUsd: 0.50, emoji: '👑' },
        { id: 'dreads', name: 'Dreadlocks', category: 'hats', priceUsd: 0.50, emoji: '🧑‍🦱' },
        { id: 'headphones', name: 'Headphones', category: 'hats', priceUsd: 0.50, emoji: '🎧' },
        { id: 'santa', name: 'Santa Hat', category: 'hats', priceUsd: 0.50, emoji: '🎅' },
        // Masks
        { id: 'ninja_mask', name: 'Ninja Mask', category: 'masks', priceUsd: 0.50, emoji: '🥷' },
        { id: 'gas', name: 'Gas Mask', category: 'masks', priceUsd: 0.50, emoji: '😷' },
        { id: 'bandit', name: 'Bandit Mask', category: 'masks', priceUsd: 0.50, emoji: '🥸' },
        { id: 'skull', name: 'Skull Face', category: 'masks', priceUsd: 0.50, emoji: '💀' },
        // Shields
        { id: 'energy', name: 'Energy Shield', category: 'shields', priceUsd: 0.50, emoji: '🛡️' },
        { id: 'wood', name: 'Wood Shield', category: 'shields', priceUsd: 0.50, emoji: '🪵' },
        { id: 'crystal', name: 'Crystal Shield', category: 'shields', priceUsd: 0.50, emoji: '💎' },
        { id: 'fire_shield', name: 'Fire Shield', category: 'shields', priceUsd: 0.50, emoji: '🔥' },
        // Pants
        { id: 'camo', name: 'Camo Pants', category: 'pants', priceUsd: 0.50, emoji: '🌿' },
        { id: 'leather', name: 'Leather Pants', category: 'pants', priceUsd: 0.50, emoji: '🦎' },
        { id: 'space_pants', name: 'Space Pants', category: 'pants', priceUsd: 0.50, emoji: '🌌' },
        { id: 'jeans', name: 'Torn Jeans', category: 'pants', priceUsd: 0.50, emoji: '👖' },
        // Boots
        { id: 'rocket', name: 'Rocket Boots', category: 'boots', priceUsd: 0.50, emoji: '🚀' },
        { id: 'ice_boots', name: 'Ice Boots', category: 'boots', priceUsd: 0.50, emoji: '🧊' },
        { id: 'sneakers', name: 'Sneakers', category: 'boots', priceUsd: 0.50, emoji: '👟' },
        { id: 'heavy', name: 'Heavy Boots', category: 'boots', priceUsd: 0.50, emoji: '🥾' },
        // Trails
        { id: 'trail_fire', name: 'Fire Trail', category: 'trails', priceUsd: 0.50, emoji: '🔥' },
        { id: 'trail_ice', name: 'Ice Trail', category: 'trails', priceUsd: 0.50, emoji: '❄️' },
        { id: 'trail_light', name: 'Lightning Trail', category: 'trails', priceUsd: 0.50, emoji: '⚡' },
        { id: 'trail_rainbow', name: 'Rainbow Trail', category: 'trails', priceUsd: 0.50, emoji: '🌈' },
        { id: 'trail_star', name: 'Star Trail', category: 'trails', priceUsd: 0.50, emoji: '⭐' },
        { id: 'trail_shadow', name: 'Shadow Trail', category: 'trails', priceUsd: 0.50, emoji: '🌑' },
        // Death Effects
        { id: 'death_smoke', name: 'Smoke Burst', category: 'deaths', priceUsd: 0.50, emoji: '💨' },
        { id: 'death_fire', name: 'Fire Burst', category: 'deaths', priceUsd: 0.50, emoji: '💥' },
        { id: 'death_confetti', name: 'Confetti', category: 'deaths', priceUsd: 0.50, emoji: '🎊' },
        { id: 'death_pixel', name: 'Pixel Explosion', category: 'deaths', priceUsd: 0.50, emoji: '🟥' },
        // Victory Effects
        { id: 'victory_confetti', name: 'Victory Confetti', category: 'victories', priceUsd: 0.50, emoji: '🎉' },
        { id: 'victory_fireworks', name: 'Fireworks', category: 'victories', priceUsd: 0.50, emoji: '🎇' },
        { id: 'victory_light', name: 'Lightning Strike', category: 'victories', priceUsd: 0.50, emoji: '⚡' },
        // Emotes
        { id: 'emote_dance', name: 'Dance', category: 'emotes', priceUsd: 0.50, emoji: '💃' },
        { id: 'emote_laugh', name: 'Laugh', category: 'emotes', priceUsd: 0.50, emoji: '😂' },
        { id: 'emote_taunt', name: 'Taunt', category: 'emotes', priceUsd: 0.50, emoji: '😜' },
        { id: 'emote_wave', name: 'Wave', category: 'emotes', priceUsd: 0.50, emoji: '👋' },
        { id: 'emote_heart', name: 'Heart', category: 'emotes', priceUsd: 0.50, emoji: '❤️' }
    ];

    static getCategories() {
        const cats = {};
        for(let item of this.items) {
            if(!cats[item.category]) cats[item.category] = [];
            cats[item.category].push(item);
        }
        return cats;
    }

    static getItem(id) {
        return this.items.find(i => i.id === id);
    }
}