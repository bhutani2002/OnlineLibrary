//Load a book from disk
var filename;
function loadBook(filename, displayName) {
    var currentBook = "";
    let url = "books/" + filename;

    //reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";



    // create a server a request to load our book
    fetch(`./${url}`).then(res => res.text()).then(body => {
        //or fetch(`./books/${filename}`).then(res=>res.text()).then(body=>{


        currentBook = body;
        // console.log(body);

        getDocStats(currentBook);

        //remove line breaks and carriage returns and replace with a <br>
        currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');


        document.getElementById("fileContent").innerHTML = currentBook;
        var elmnt = document.getElementById("fileContent");
        elmnt.scrollTop = 0;
    })



}

//get the stats for the book
function getDocStats(fileContent) {
    // console.log(fileContent);
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    // console.log(text);
    var wordArray = text.match(/\b\S+\b/g);// getting individual words from the whole text, in the form of array.
    // console.log(wordArray);
    let wordDictionary = {};

    var uncommonWords = [];

    //   filter out the uncommon words
    uncommonWords = filterStopWords(wordArray);

    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    //sort the array
    var wordList = sortProperties(wordDictionary);
    //   console.log(wordList);
    //Return the top 5 words
    var top5Words = wordList.slice(0, 5);
    console.log(top5Words);
    //return the least 5 words
    var least5Words = wordList.slice(-5, wordList.length);
    console.log(least5Words);
    //Write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));
    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerHTML = "Word Count: " + wordArray.length;
}
var items;
function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";
    for (i = 0; i < items.length; i++) {
        // var zzzz=items[i][0];
        // zzzz.style.color="white";
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }
    console.log(resultsHTML);
    element.innerHTML = resultsHTML;
}

function sortProperties(obj) {
    //first convert the object to an array
    let rtnArray = Object.entries(obj);

    //Sort the array
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;

}

//filter out stop words
function filterStopWords(wordArray) {
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    for (i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }

    return uncommonArr;
}
// //a list of stop words we don't want to include in stats
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}
// //highlight the words in search
function performMark() {

    //     //read the keyword
    var keyword = document.getElementById("keyword").value;
    if (keyword == "") {
        alert("Please enter a word!");
        button.preventDefault();
    }
    var display = document.getElementById("fileContent");
    // console.log(display);
    var newContent = "";

    //find all the currently marked items
    let spans = document.querySelectorAll('mark');

    //<mark>Harry</mark>
    //Harry

    for (var i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi"); // g-> global ||  i-> case insensitive
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
    }
    else
        alert("Sorry, no word found!");

}

function replaceWord() {
    var changeWord = document.getElementById("changeWord").value;
    if (changeWord == "") {
        alert("Please enter a word!");
        button.preventDefault();
    }
    console.log(changeWord);
    var newWord = document.getElementById("newWord").value;
    if (newWord == "") {
        alert("Please enter a word!");
        button.preventDefault();
    }
    var output = document.getElementById("fileContent");
    var bookContent = output.innerHTML;
    console.log(bookContent);
    var r = new RegExp(changeWord, "gi") // g-> global ||  i-> case insensitive
    console.log(r);
    var zoom = r.toString();
    var leeeee = zoom.slice(1, zoom.length - 3);
    console.log(leeeee);
    var ze = new RegExp(newWord, "gi");
    console.log(ze);
    var zoomout = ze.toString();
    var leeeeett = zoomout.slice(1, zoomout.length - 3);
    console.log(leeeeett);
    while (bookContent.indexOf(changeWord) != -1) {
        // if((bookContent.toLowerCase || bookContent.toUpperCase)==leeeee)
        bookContent = bookContent.replace(leeeee, leeeeett);
        //   console.log(bookContent);
    }
    console.log(bookContent);
    output.innerHTML = bookContent;
    document.getElementById("changeWord").value = "";
    document.getElementById("newWord").value = "";
}

function resize() {
    var ttt = document.querySelector('.heighted');
    var abc = document.getElementById("wrapper");
    var raa = document.getElementById("fileContent");
    var abcd = document.getElementsByClassName("togg")[0];
    var fire = document.getElementsByClassName("z")[0];
    if (document.getElementsByClassName("active")) {
        fire.classList.toggle('rrr');
        raa.classList.toggle('good');
        abcd.classList.toggle('bad');
        ttt.classList.toggle('display');
        abc.classList.toggle('happy');
    }
    else {
        fire.classList.toggle('rrr');
        abcd.classList.toggle('bad');
        ttt.classList.toggle('display');
        abc.classList.toggle('happy');
        raa.classList.toggle('good');
    }

}



















// 2nd waycreate a server a request to load our book

  // var xhr = new XMLHttpRequest(); //Creates a request for the http to respond 
    // xhr.open("GET", url, true);   // takes the url of the file
    // xhr.send();        //initiates the network traffic

  // var xhr=  jQuery.get('url', function(data) {
  //       alert(data);
  //   });
    // xhr.onreadystatechange = function () {             // to check if it is done or done (request)

   // // readyState: 0-> file is unsend
     // //              1->file is now open
      // //             2->recieved headers and got information about the document
      // //             3->It is actually loading the document
      //  //            4-> done


      //  // staus==200 means it is sucessfull......

    //     if (xhr.readyState == 4 && xhr.status == 200) {        
    //         currentBook = xhr.responseText;

    //         getDocStats(currentBook);

    //         //remove line breaks and carriage returns and replace with a <br> and g means in global window
    //         currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //         document.getElementById("fileContent").innerHTML = currentBook;

    //         var elmnt = document.getElementById("fileContent");
    //         elmnt.scrollTop = 0;

    //     }
    // };