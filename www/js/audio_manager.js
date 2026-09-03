class AudioManager {
    static init() {
        this.sounds = {};
        this.enabled = SaveManager.get().settings.sound;
    }
    static play(name) {
        if(!this.enabled) return;
        // Stub for future sound implementation
    }
}