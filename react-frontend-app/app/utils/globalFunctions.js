var GlobalFunctions = {
    caluclateWPM: function(wordsTypedSoFar, currentTime, start_time ) {
        var diffSeconds = (currentTime - start_time) / 1000; // 6 sec
        var wordsPerMin = 0;
        
        if(wordsTypedSoFar > 0) {
            var wordsPerSec = diffSeconds / wordsTypedSoFar; // in seconds 
            wordsPerMin = Math.round(60 / wordsPerSec); // WPM
        }
        return wordsPerMin;
    },
}

module.exports = GlobalFunctions;