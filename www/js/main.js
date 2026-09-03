document.addEventListener('DOMContentLoaded', () => {
    Security.init();
    PurchaseManager.init();
    AudioManager.init();
    AdManager.init();
    InputManager.init();

    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    UIManager.init(game);

    window.addEventListener('resize', () => {
        if(game) game.setupCanvas();
    });

    document.addEventListener('backbutton', (e) => {
        e.preventDefault();
        if(document.getElementById('pause-overlay').classList.contains('hidden') && document.getElementById('game-screen').classList.contains('active')) {
            if(game) game.togglePause();
        } else if(!document.getElementById('pause-overlay').classList.contains('hidden')) {
            if(game) game.togglePause();
        } else {
            const activeScreen = document.querySelector('.screen.active');
            if(activeScreen && activeScreen.id !== 'menu-screen') {
                UIManager.showScreen('menu-screen');
            }
        }
    });

    console.log('🍔 Fat Runner: Trap World Loaded! 500 Levels!');
});