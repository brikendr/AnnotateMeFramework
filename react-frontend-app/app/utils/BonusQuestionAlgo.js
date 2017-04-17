var maximumSpeed = require('./constatns').maximumSpeed;

var paragraph = [];


var BonusQuestionAlgo = {
    paragraph: [],
    commonWords: [
        "empty", "this", "appear", "allow", "east", "frame", "fool", "music", "battery", "flicker", "round", "south", "chapter", "weird", 
        "bare", "talk", "chair", "after", "do", "lucky", "nervous", "bloom", "flower", "this", "let", "did", "thing", "past", "list",
        "cat", "fear", "six", "old", "warm", "coat", "eyes", "keep", "matter", "cry", "somebody", "jump"
    ],
    wordsWithTimer: [],
    wrongCounter: 0,
    init: function(words) {
        this.paragraph = words;
    },
    setWordsWithTimer: function(wordIdx, startTime, endTime) {
        if(this.paragraph[wordIdx].length <= 4)
            return;
        var word = this.paragraph[wordIdx],
            pos = this.wordsWithTimer.map(function(e) { return e.word; }).indexOf(word),
            newSpeed = endTime - startTime;//in milliseconds
        if(pos != -1){
            if(newSpeed < this.wordsWithTimer[pos].speed) {
                this.wordsWithTimer[pos].speed = newSpeed;
            }
        }else {
            this.wordsWithTimer.push({
                'word': word,
                'speed': newSpeed
            });
        }
    },
    incrementWrongCounter() {
        this.wrongCounter++;
    },
    selectRandomQuestion: function() {
        var questionNr = this.randRange(1, 6); //1 - 6
        switch(questionNr) {
            case 1: {
                return this.bonusQuestionV1();
                break;
            }
            case 2: {
                return this.bonusQuestionV2();
                break;
            }
            case 3: {
                return this.bonusQuestionV3();
                break;
            }
            case 4: {
                return this.bonusQuestionV4();
                break;
            }
            case 5: {
                return this.bonusQuestionV5();
                break;
            }
            case 6: {
                return this.bonusQuestionV6();
                break;
            }
        }
    },
    bonusQuestionV1: function() {
        //Find occurrances of words 
        var counts = {},
            paragraph = this.paragraph;

        for(var i = 0; i< paragraph.length; i++) {
            var num = paragraph[i];
            counts[num] = counts[num] ? counts[num]+1 : 1;
        }

        //Select a random index 
        var randIDX = 4//this.randRange(0,paragraph.length - 1);
        
        //Loop until there is a number occurring more than twice (try ten times)
        /*var i = 0;
        while(counts[paragraph[randIDX]] <= 2 && i < 10) {
            randIDX = this.randRange(0,paragraph.length - 1);
            i++;
        }*/
        var selectedWord = paragraph[randIDX],
            occuringTimes = counts[selectedWord],
            candidates = [];

        if([1,2].indexOf(occuringTimes) != -1) {
            candidates[0] = occuringTimes;
            candidates[1] = 3;
            candidates[2] = occuringTimes == 1 ? 2:1;
            candidates[3] = 4;
        } else {
            candidates = this.candidateRandomizer(occuringTimes, 1);            
        }
        
        //Shuffle Array
        candidates = this.shuffle(candidates);

        var correctAnswer = candidates.indexOf(occuringTimes);

        candidates = this.addLabelsToCandidate(candidates, "time", "times");

        var bonus_q = {
            "question": "During your typing, how many times did the word [" + selectedWord.toUpperCase() + "] appear?",
            'correctAnswer': correctAnswer,
            'candidates': candidates,
            "gamePoints": 10
        }
        return bonus_q;
    },
    bonusQuestionV2: function() {
        var shouldPickWordFromList = this.randRange(1,2),
            idx = shouldPickWordFromList == 1 ? this.randRange(0, this.paragraph.length - 1) : this.randRange(0, this.commonWords.length-1);
            selectedWord = shouldPickWordFromList == 1 ? this.paragraph[idx]:this.commonWords[idx],
            candidates = ["YES", "NO"],
            correctAnswer = shouldPickWordFromList == 1 ? 0:1,
            bonus_q = {
                "question": "During your typing, did the word [" + selectedWord.toUpperCase() + "] occurr?",
                'correctAnswer': correctAnswer,
                'candidates': candidates,
                "gamePoints": 3
            }

            return bonus_q;
    },
    bonusQuestionV3: function(){
        var wordsArray = this.wordsWithTimer;
        //Sort Array
        wordsArray = this.wordsWithTimer.sort(function(a,b) {return (a.speed > b.speed) ? 1 : ((b.speed > a.speed) ? -1 : 0);});

        var candidates = [];
        for(var i =0; i < wordsArray.length; i++) {
            if(i == 4)
                break;//we take only the best 4 candidates
            candidates[i] = wordsArray[i].word;
        }
        //Shuffle Array
        candidates = this.shuffle(candidates);

        var correctAnswer = candidates.indexOf(wordsArray[0].word),
            bonus_q = {
                "question": "Which of the words below were you the fastest to type?",
                'correctAnswer': correctAnswer,
                'candidates': candidates,
                "gamePoints": 8
            }

        return bonus_q;
    },
    bonusQuestionV4: function() {
        var wrongCounter = this.wrongCounter,
            candidates = this.candidateRandomizer(wrongCounter, 1);
        
        
        var correctAnswer = candidates.indexOf(wrongCounter);
        candidates = this.addLabelsToCandidate(candidates, "time", "times");
        var bonus_q = {
            "question": "How many times did you wrongly type a word ?",
            'correctAnswer': correctAnswer,
            'candidates': candidates,
            "gamePoints": 3
        }
        return bonus_q;
    },
    bonusQuestionV5: function() {
        var idx  = -1,
            idxForRandomWord = -1,
            idxWithSuffix = "",
            correctAnswer = -1, word = "";
        if(this.paragraph.length > 5) {
            //randomly select to take an element in the beggining or the end 
            if(this.randRange(1,2) == 1){
                //Take from the begning of the array
                //Randomly select position 0 - 2 (one of the first three positions)
                idx = this.randRange(0 , 2);
                idxForRandomWord = this.randRange(0 , 2);
                idxWithSuffix = idx == 0 ? "1st": idx == 1 ? "2nd":"3rd";
                correctAnswer = this.paragraph[idxForRandomWord] == this.paragraph[idx] ? 0:1;
                word = this.paragraph[idxForRandomWord];
            } else {
                //take from the end of the array
                //Randomly choose to select the last or the previous last element 
                idx = this.randRange(1, 2);
                idxForRandomWord = this.randRange(1, 2);
                idxWithSuffix = idx == 1 ? "LAST":"PREVIOUS LAST";
                var length = this.paragraph.length;
                correctAnswer = this.paragraph[length - idxForRandomWord] == this.paragraph[length - idx] ? 0:1;
                word = this.paragraph[length - idxForRandomWord];
            }
        } else {
            //randomly select the number 
            idx = this.randRange(1, this.paragraph.length);
            idxForRandomWord = this.randRange(0, this.paragraph.length - 1);
            idxWithSuffix = idx == 1 ? "1st": idx == 2 ? "2nd": idx == 3 ? "3rd":idx+"th";
            correctAnswer = this.paragraph[idxForRandomWord] == this.paragraph[idx - 1] ? 0:1;
            word = this.paragraph[idxForRandomWord];
        }

        var candidates = ["YES", "NO"],
        
        bonus_q = {
            "question": "Did the word ["+word+"] appear as the ["+idxWithSuffix+"] in the word sequence?",
            'correctAnswer': correctAnswer,
            'candidates': candidates,
            "gamePoints": 3
        }
        
        return bonus_q;

    },
    bonusQuestionV6: function() {
        var wrongCounter = this.wrongCounter,
            candidates = this.candidateRandomizer(this.paragraph.length, 10);
        
        
        var correctAnswer = candidates.indexOf(this.paragraph.length);
        candidates = this.addLabelsToCandidate(candidates, "word", "words");
        var bonus_q = {
            "question": "How many words in total did you type?",
            'correctAnswer': correctAnswer,
            'candidates': candidates,
            "gamePoints": 8
        }
        return bonus_q;
    },
    shuffle: function(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    },
    randRange: function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    candidateRandomizer: function(occuringTimes, jIncrement) {
        var candidates = [],
            firstCand   = this.randRange(1, 3), // 1 - 3
            secondCand  = this.randRange(3, 6), // 3 - 6
            thirdCand   = this.randRange(6, 9); // 6 - 9
        
        //Randomly select a number between the number from the % of the occuringTimes to ocurring times (for each candidate)
        var cadArr = [];
        cadArr[0] = this.randRange(Math.round(occuringTimes * ( firstCand / 10)), occuringTimes),
        cadArr[1] = this.randRange(Math.round(occuringTimes * ( secondCand / 10)), occuringTimes),
        cadArr[2] = this.randRange(Math.round(occuringTimes * ( thirdCand / 10)), occuringTimes);

        candidates[0] = occuringTimes;
            
        for(var i = 1; i < cadArr.length + 1; i++) {
            var bullshit = true,
                j = 1;
            while(bullshit && j < (jIncrement * 10)) {
                
                var candidateOccr = this.randRange(1,2) == 1 ? Math.abs(cadArr[i-1] - j): cadArr[i-1] + j;
                if(candidates.indexOf(candidateOccr) == -1) {
                    candidates[i] =  candidateOccr;
                    bullshit = false;
                }
                j = j + jIncrement;
            }    
        }
        return candidates;
    },
    addLabelsToCandidate(candidates, wordSingular, wordPlural) {
        var newCandidates = [];
        for(var i = 0; i < candidates.length; i++) {
            newCandidates[i] =  (candidates[i] == 1 ? candidates[i]+ " "+wordSingular : candidates[i] + " "+wordPlural);   
        }
        return newCandidates;
    }
}

module.exports = BonusQuestionAlgo;