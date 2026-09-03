class InputManager {
    static init() {
        this.keys = { left: false, right: false, jump: false };
        this.touchLeft = false; this.touchRight = false; this.touchJump = false;
        
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = true;
            if(e.key === 'ArrowRight' || e.key === 'd') this.keys.right = true;
            if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); this.keys.jump = true; }
        });
        document.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = false;
            if(e.key === 'ArrowRight' || e.key === 'd') this.keys.right = false;
            if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); this.keys.jump = false; }
        });

        const bind = (el, onStart, onEnd) => {
            el.addEventListener('touchstart', (e) => { e.preventDefault(); onStart(); }, {passive: false});
            el.addEventListener('touchend', (e) => { e.preventDefault(); onEnd(); }, {passive: false});
            el.addEventListener('touchcancel', (e) => { e.preventDefault(); onEnd(); }, {passive: false});
            el.addEventListener('mousedown', (e) => { onStart(); });
            el.addEventListener('mouseup', (e) => { onEnd(); });
            el.addEventListener('mouseleave', (e) => { onEnd(); });
        };
        bind(document.getElementById('left-btn'), () => { this.touchLeft = true; }, () => { this.touchLeft = false; });
        bind(document.getElementById('right-btn'), () => { this.touchRight = true; }, () => { this.touchRight = false; });
        bind(document.getElementById('jump-btn'), () => { this.touchJump = true; }, () => { this.touchJump = false; });
    }

    static getState() {
        return {
            left: this.keys.left || this.touchLeft,
            right: this.keys.right || this.touchRight,
            jump: this.keys.jump || this.touchJump
        };
    }
}