class Security {
    // NOTE: the previous version of this file ran a `debugger`-timing check
    // every 2 seconds and wiped the whole screen with "Debugging not allowed"
    // whenever the check was even slightly slow (e.g. a GC pause on a lower
    // end phone) — this was randomly bricking the game for real players, not
    // just people with devtools open. It also permanently disabled
    // window.console (breaking log output some Cordova plugins rely on) and
    // froze Array.prototype/Object.prototype (which can break third-party
    // plugin code that patches those prototypes, e.g. AdMob/IAP SDK shims).
    // This is a safe, no-op replacement so the app never self-destructs.
    static init() {
        // Intentionally does nothing harmful. Add real anti-tamper /
        // obfuscation at build time (e.g. via a bundler) instead of at
        // runtime if you need it later.
    }
}
