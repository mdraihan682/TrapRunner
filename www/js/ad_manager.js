class AdManager {
    static init() {
        this.adsRemoved = SaveManager.get().adsRemoved || false;
        // EXTERNAL: Add real AdMob plugin here
    }
    static showInterstitial(callback) {
        if(this.adsRemoved) { if(callback) callback(); return; }
        // Test mode - just callback
        if(callback) callback();
        // EXTERNAL: admob.interstitial.show()
    }
    static showRewarded(callback) {
        if(this.adsRemoved) { callback(true); return; }
        callback(true);
        // EXTERNAL: admob.rewarded.show()
    }
    static removeAds() {
        this.adsRemoved = true;
        const s = SaveManager.get();
        s.adsRemoved = true;
        SaveManager.save(s);
        alert('🚫 Ads Removed! Thank you!');
    }
}