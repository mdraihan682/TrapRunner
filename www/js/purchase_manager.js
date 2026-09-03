class PurchaseManager {
    static init() {
        // EXTERNAL: cordova-plugin-inapppurchase
    }

    static purchaseCosmetic(itemId) {
        const item = ShopManager.getItem(itemId);
        if(!item) return alert('Item not found!');
        const save = SaveManager.get();
        if(!save.ownedCosmetics) save.ownedCosmetics = [];
        if(save.ownedCosmetics.includes(itemId)) return alert('Already owned!');

        // Test mode (Free for html2app.dev)
        if(confirm(`Buy "${item.name}" for $${item.priceUsd.toFixed(2)}? (Test Mode - Free)`)) {
            save.ownedCosmetics.push(itemId);
            SaveManager.save(save);
            alert(`✅ "${item.name}" purchased!`);
            UIManager.showShop();
        }
        // EXTERNAL: inAppPurchase.purchase(itemId)
    }

    static purchaseRemoveAds() {
        if(confirm('Remove Ads for $0.99? (Test Mode)')) {
            AdManager.removeAds();
        }
        // EXTERNAL: inAppPurchase.purchase('remove_ads')
    }

    static restorePurchases() {
        alert('Restore purchases (Test Mode)');
        // EXTERNAL: inAppPurchase.restorePurchases()
    }
}