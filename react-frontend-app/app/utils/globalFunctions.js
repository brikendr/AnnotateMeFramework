var maximumSpeed = require('./constatns').maximumSpeed;
var GlobalFunctions = {
    caluclateWPM: function(wordsTypedSoFar, currentTime, start_time ) {
        var diffSeconds = (currentTime - start_time) / 1000; // 6 sec
        var wordsPerMin = 0;
        
        if(wordsTypedSoFar > 0) {
            var wordsPerSec = diffSeconds / wordsTypedSoFar; // in seconds 
            wordsPerMin = Math.round(60 / wordsPerSec); // WPM
        }
        return wordsPerMin >= maximumSpeed ? maximumSpeed: wordsPerMin;
    },
    removeWhitespacesBeginningAndEnd: function(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
}

module.exports = GlobalFunctions;