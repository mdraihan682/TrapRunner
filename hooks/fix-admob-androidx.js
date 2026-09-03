#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const filePath = path.join(
        context.opts.projectRoot,
        'platforms/android/app/src/main/java/name/ratson/cordova/admob/AdMob.java'
    );

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;

        content = content.replace(/android\.support\.annotation/g, 'androidx.annotation');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('[fix-admob-androidx] Patched AdMob.java to use androidx.annotation');
        }
    }
};
