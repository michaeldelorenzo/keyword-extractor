(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//  include the Keyword Extractor
var keyword_extractor = require("../lib/keyword_extractor");

var sentence = "Google LLC este o corporație americană multinațională care administrează motorul de căutare pe Internet cu același nume."

//  Extract the keywords
var extraction_result = keyword_extractor.extract(sentence,{
                                                                language:"romanian",
                                                                remove_digits: true,
                                                                return_changed_case:false,
                                                                remove_duplicates: false

                                                           });
console.log(extraction_result);


document.addEventListener("DOMContentLoaded", function(event) {
    var _list = document.getElementsByClassName("keywords")[0];
    
    extraction_result.forEach(function(currentValue, index,){
        var li = document.createElement("li");
        var liText = document.createTextNode(currentValue);
        li.appendChild(liText);
        _list.appendChild(li);
    });
});

},{"../lib/keyword_extractor":2}],2:[function(require,module,exports){
var _ = require("underscore");
_.str = require('underscore.string');
var supported_languages = ["danish","dutch","english","french","galician","german","italian","polish","portuguese","romanian","russian","spanish","swedish"];
var stopwords = require("./stopwords/stopwords");

function _extract(str, options){
    if(_.isEmpty(str)){
        return [];
    }
    if(_.isEmpty(options)){
        options = {
            remove_digits: true,
            return_changed_case: true
        };
    }
    var return_changed_case = options.return_changed_case;
    var return_chained_words = options.return_chained_words;
    var remove_digits = options.remove_digits;
    var _language = options.language || "english";
    var _remove_duplicates = options.remove_duplicates || false;
    var return_max_ngrams = options.return_max_ngrams;

    if(supported_languages.indexOf(_language) < 0){
        throw new Error("Language must be one of ["+supported_languages.join(",")+"]");
    }

    //  strip any HTML and trim whitespace
    var text = _.str.trim(_.str.stripTags(str));
    if(_.isEmpty(text)){
        return [];
    }else{
        var words = text.split(/\s/);
        var unchanged_words = [];
        var low_words = [];
        //  change the case of all the words
        for(var x = 0;x < words.length; x++){
            var w = words[x].match(/https?:\/\/.*[\r\n]*/g) ? words[x] : words[x].replace(/\.|,|;|!|\?|\(|\)|:|"|^'|'$|“|”|‘|’/g,'');
            //  remove periods, question marks, exclamation points, commas, and semi-colons
            //  if this is a short result, make sure it's not a single character or something 'odd'
            if(w.length === 1){
                w = w.replace(/-|_|@|&|#/g,'');
            }
            //  if it's a number, remove it
            var digits_match = w.match(/\d/g);
            if(remove_digits && digits_match && digits_match.length === w.length){
                w = "";
            }
            if(w.length > 0){
                low_words.push(w.toLowerCase());
                unchanged_words.push(w);
            }
        }
        var results = [];
        var _stopwords = options.stopwords || _getStopwords({ language: _language });
        var _last_result_word_index = 0;
        var _start_result_word_index = 0;
	var _unbroken_word_chain = false;
        for(var y = 0; y < low_words.length; y++){

            if(_stopwords.indexOf(low_words[y]) < 0){
                
                if(_last_result_word_index !== y - 1){
                    _start_result_word_index = y;
                    _unbroken_word_chain = false; 
		} else {
	            _unbroken_word_chain = true;
		}
                var result_word = return_changed_case && !unchanged_words[y].match(/https?:\/\/.*[\r\n]*/g) ? low_words[y] : unchanged_words[y];
                
                if (return_max_ngrams && _unbroken_word_chain && !return_chained_words && return_max_ngrams > (y - _start_result_word_index) && _last_result_word_index === y - 1){
                    var change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
                    results[change_pos] = results[change_pos] ? results[change_pos] + ' ' + result_word : result_word;
                } else if (return_chained_words && _last_result_word_index === y - 1) {
                  var change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
                  results[change_pos] = results[change_pos] ? results[change_pos] + ' ' + result_word : result_word;
                } else {
                  results.push(result_word);
                }

                _last_result_word_index = y;
            } else {
		_unbroken_word_chain = false;
	    }
        }

        if(_remove_duplicates) {
            results= _.uniq(results, function (item) {
                return item;
            });
        }

        return results;
    }
}

function _getStopwords(options){
    options = options || {};

    var _language = options.language || "english";
    if(supported_languages.indexOf(_language) < 0){
        throw new Error("Language must be one of ["+supported_languages.join(",")+"]");
    }

    return stopwords[_language];
}

module.exports = {
    extract:_extract,
    getStopwords: _getStopwords
};

},{"./stopwords/stopwords":16,"underscore":18,"underscore.string":17}],3:[function(require,module,exports){
// Danish stopwords
// http://www.ranks.nl/stopwords/danish
// https://github.com/dnohr

module.exports = {
    stopwords: [
		"ad",
		"af",
		"aldrig",
		"alle",
		"alt",
		"altid",
		"anden",
		"andet",
		"andre",
		"at",
		"bagved",
		"begge",
		"blev",
		"blive",
		"bliver",
		"da",
		"de",
		"dem",
		"den",
		"denne",
		"der",
		"deres",
		"det",
		"dette",
		"dig",
		"din",
		"disse",
		"dog",
		"du",
		"efter",
		"ej",
		"eller",
		"en",
		"end",
		"endnu",
		"ene",
		"eneste",
		"enhver",
		"er",
		"et",
		"fem",
		"fire",
		"fjernt",
		"flere",
		"fleste",
		"for",
		"foran",
		"fordi",
		"forrige",
		"fra",
		"få",
		"før",
		"gennem",
		"god",
		"ham",
		"han",
		"hans",
		"har",
		"havde",
		"have",
		"hende",
		"hendes",
		"her",
		"hos",
		"hovfor",
		"hun",
		"hurtig",
		"hvad",
		"hvem",
		"hver",
		"hvilken",
		"hvis",
		"hvonår",
		"hvor",
		"hvordan",
		"hvorfor",
		"hvorhen",
		"hvornår",
		"i",
		"ikke",
		"imod",
		"ind",
		"ingen",
		"intet",
		"ja",
		"jeg",
		"jer",
		"jeres",
		"jo",
		"kan",
		"kom",
		"kommer",
		"kunne",
		"langsom",
		"lav",
		"lidt",
		"lille",
		"man",
		"mand",
		"mange",
		"med",
		"meget",
		"mellem",
		"men",
		"mens",
		"mere",
		"mig",
		"min",
		"mindre",
		"mine",
		"mit",
		"mod",
		"måske",
		"ned",
		"nede",
		"nej",
		"ni",
		"nogen",
		"noget",
		"nogle",
		"nok",
		"nu",
		"ny",
		"nyt",
		"når",
		"nær",
		"næste",
		"næsten",
		"og",
		"også",
		"om",
		"op",
		"oppe",
		"os",
		"otte",
		"over",
		"på",
		"rask",
		"sammen",
		"se",
		"seks",
		"selv",
		"ses",
		"sig",
		"sin",
		"sine",
		"sit",
		"skal",
		"skulle",
		"som",
		"stor",
		"store",
		"syv",
		"sådan",
		"temmelig",
		"thi",
		"ti",
		"til",
		"to",
		"tre",
		"ud",
		"uden",
		"udenfor",
		"under",
		"var",
		"ved",
		"vi",
		"vil",
		"ville",
		"vor",
		"være",
		"været"
    ]
};
},{}],4:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// German stopwords
// via https://code.google.com/p/stop-words/
module.exports = {
    stopwords: [
        "a",
        "ab",
        "aber",
        "ach",
        "acht",
        "achte",
        "achten",
        "achter",
        "achtes",
        "ag",
        "alle",
        "allein",
        "allem",
        "allen",
        "aller",
        "allerdings",
        "alles",
        "allgemeinen",
        "als",
        "also",
        "am",
        "an",
        "andere",
        "anderen",
        "andern",
        "anders",
        "au",
        "auch",
        "auf",
        "aus",
        "ausser",
        "außer",
        "ausserdem",
        "außerdem",
        "b",
        "bald",
        "bei",
        "beide",
        "beiden",
        "beim",
        "beispiel",
        "bekannt",
        "bereits",
        "besonders",
        "besser",
        "besten",
        "bin",
        "bis",
        "bisher",
        "bist",
        "c",
        "d",
        "da",
        "dabei",
        "dadurch",
        "dafür",
        "dagegen",
        "daher",
        "dahin",
        "dahinter",
        "damals",
        "damit",
        "danach",
        "daneben",
        "dank",
        "dann",
        "daran",
        "darauf",
        "daraus",
        "darf",
        "darfst",
        "darin",
        "darüber",
        "darum",
        "darunter",
        "das",
        "dasein",
        "daselbst",
        "dass",
        "daß",
        "dasselbe",
        "davon",
        "davor",
        "dazu",
        "dazwischen",
        "dein",
        "deine",
        "deinem",
        "deiner",
        "dem",
        "dementsprechend",
        "demgegenüber",
        "demgemäss",
        "demgemäß",
        "demselben",
        "demzufolge",
        "den",
        "denen",
        "denn",
        "denselben",
        "der",
        "deren",
        "derjenige",
        "derjenigen",
        "dermassen",
        "dermaßen",
        "derselbe",
        "derselben",
        "des",
        "deshalb",
        "desselben",
        "dessen",
        "deswegen",
        "d.h",
        "dich",
        "die",
        "diejenige",
        "diejenigen",
        "dies",
        "diese",
        "dieselbe",
        "dieselben",
        "diesem",
        "diesen",
        "dieser",
        "dieses",
        "dir",
        "doch",
        "dort",
        "drei",
        "drin",
        "dritte",
        "dritten",
        "dritter",
        "drittes",
        "du",
        "durch",
        "durchaus",
        "dürfen",
        "dürft",
        "durfte",
        "durften",
        "e",
        "eben",
        "ebenso",
        "ehrlich",
        "ei",
        "ei,",
        "eigen",
        "eigene",
        "eigenen",
        "eigener",
        "eigenes",
        "ein",
        "einander",
        "eine",
        "einem",
        "einen",
        "einer",
        "eines",
        "einige",
        "einigen",
        "einiger",
        "einiges",
        "einmal",
        "eins",
        "elf",
        "en",
        "ende",
        "endlich",
        "entweder",
        "er",
        "Ernst",
        "erst",
        "erste",
        "ersten",
        "erster",
        "erstes",
        "es",
        "etwa",
        "etwas",
        "euch",
        "f",
        "früher",
        "fünf",
        "fünfte",
        "fünften",
        "fünfter",
        "fünftes",
        "für",
        "g",
        "gab",
        "ganz",
        "ganze",
        "ganzen",
        "ganzer",
        "ganzes",
        "gar",
        "gedurft",
        "gegen",
        "gegenüber",
        "gehabt",
        "gehen",
        "geht",
        "gekannt",
        "gekonnt",
        "gemacht",
        "gemocht",
        "gemusst",
        "genug",
        "gerade",
        "gern",
        "gesagt",
        "geschweige",
        "gewesen",
        "gewollt",
        "geworden",
        "gibt",
        "ging",
        "gleich",
        "gott",
        "gross",
        "groß",
        "grosse",
        "große",
        "grossen",
        "großen",
        "grosser",
        "großer",
        "grosses",
        "großes",
        "gut",
        "gute",
        "guter",
        "gutes",
        "h",
        "habe",
        "haben",
        "habt",
        "hast",
        "hat",
        "hatte",
        "hätte",
        "hatten",
        "hätten",
        "heisst",
        "her",
        "heute",
        "hier",
        "hin",
        "hinter",
        "hoch",
        "i",
        "ich",
        "ihm",
        "ihn",
        "ihnen",
        "ihr",
        "ihre",
        "ihrem",
        "ihren",
        "ihrer",
        "ihres",
        "im",
        "immer",
        "in",
        "indem",
        "infolgedessen",
        "ins",
        "irgend",
        "ist",
        "j",
        "ja",
        "jahr",
        "jahre",
        "jahren",
        "je",
        "jede",
        "jedem",
        "jeden",
        "jeder",
        "jedermann",
        "jedermanns",
        "jedoch",
        "jemand",
        "jemandem",
        "jemanden",
        "jene",
        "jenem",
        "jenen",
        "jener",
        "jenes",
        "jetzt",
        "k",
        "kam",
        "kann",
        "kannst",
        "kaum",
        "kein",
        "keine",
        "keinem",
        "keinen",
        "keiner",
        "kleine",
        "kleinen",
        "kleiner",
        "kleines",
        "kommen",
        "kommt",
        "können",
        "könnt",
        "konnte",
        "könnte",
        "konnten",
        "kurz",
        "l",
        "lang",
        "lange",
        "leicht",
        "leide",
        "lieber",
        "los",
        "m",
        "machen",
        "macht",
        "machte",
        "mag",
        "magst",
        "mahn",
        "man",
        "manche",
        "manchem",
        "manchen",
        "mancher",
        "manches",
        "mann",
        "mehr",
        "mein",
        "meine",
        "meinem",
        "meinen",
        "meiner",
        "meines",
        "mensch",
        "menschen",
        "mich",
        "mir",
        "mit",
        "mittel",
        "mochte",
        "möchte",
        "mochten",
        "mögen",
        "möglich",
        "mögt",
        "morgen",
        "muss",
        "muß",
        "müssen",
        "musst",
        "müsst",
        "musste",
        "mussten",
        "n",
        "na",
        "nach",
        "nachdem",
        "nahm",
        "natürlich",
        "neben",
        "nein",
        "neue",
        "neuen",
        "neun",
        "neunte",
        "neunten",
        "neunter",
        "neuntes",
        "nicht",
        "nichts",
        "nie",
        "niemand",
        "niemandem",
        "niemanden",
        "noch",
        "nun",
        "nur",
        "o",
        "ob",
        "oben",
        "oder",
        "offen",
        "oft",
        "ohne",
        "Ordnung",
        "p",
        "q",
        "r",
        "recht",
        "rechte",
        "rechten",
        "rechter",
        "rechtes",
        "richtig",
        "rund",
        "s",
        "sa",
        "sache",
        "sagt",
        "sagte",
        "sah",
        "satt",
        "schlecht",
        "Schluss",
        "schon",
        "sechs",
        "sechste",
        "sechsten",
        "sechster",
        "sechstes",
        "sehr",
        "sei",
        "seid",
        "seien",
        "sein",
        "seine",
        "seinem",
        "seinen",
        "seiner",
        "seines",
        "seit",
        "seitdem",
        "selbst",
        "sich",
        "sie",
        "sieben",
        "siebente",
        "siebenten",
        "siebenter",
        "siebentes",
        "sind",
        "so",
        "solang",
        "solche",
        "solchem",
        "solchen",
        "solcher",
        "solches",
        "soll",
        "sollen",
        "sollte",
        "sollten",
        "sondern",
        "sonst",
        "sowie",
        "später",
        "statt",
        "t",
        "tag",
        "tage",
        "tagen",
        "tat",
        "teil",
        "tel",
        "tritt",
        "trotzdem",
        "tun",
        "u",
        "über",
        "überhaupt",
        "übrigens",
        "uhr",
        "um",
        "und",
        "und?",
        "uns",
        "unser",
        "unsere",
        "unserer",
        "unter",
        "v",
        "vergangenen",
        "viel",
        "viele",
        "vielem",
        "vielen",
        "vielleicht",
        "vier",
        "vierte",
        "vierten",
        "vierter",
        "viertes",
        "vom",
        "von",
        "vor",
        "w",
        "wahr?",
        "während",
        "währenddem",
        "währenddessen",
        "wann",
        "war",
        "wäre",
        "waren",
        "wart",
        "warum",
        "was",
        "wegen",
        "weil",
        "weit",
        "weiter",
        "weitere",
        "weiteren",
        "weiteres",
        "welche",
        "welchem",
        "welchen",
        "welcher",
        "welches",
        "wem",
        "wen",
        "wenig",
        "wenige",
        "weniger",
        "weniges",
        "wenigstens",
        "wenn",
        "wer",
        "werde",
        "werden",
        "werdet",
        "wessen",
        "wie",
        "wieder",
        "will",
        "willst",
        "wir",
        "wird",
        "wirklich",
        "wirst",
        "wo",
        "wohl",
        "wollen",
        "wollt",
        "wollte",
        "wollten",
        "worden",
        "wurde",
        "würde",
        "wurden",
        "würden",
        "x",
        "y",
        "z",
        "z.b",
        "zehn",
        "zehnte",
        "zehnten",
        "zehnter",
        "zehntes",
        "zeit",
        "zu",
        "zuerst",
        "zugleich",
        "zum",
        "zunächst",
        "zur",
        "zurück",
        "zusammen",
        "zwanzig",
        "zwar",
        "zwei",
        "zweite",
        "zweiten",
        "zweiter",
        "zweites",
        "zwischen",
        "zwölf",
        "﻿aber",
        "euer",
        "eure",
        "hattest",
        "hattet",
        "jedes",
        "mußt",
        "müßt",
        "sollst",
        "sollt",
        "soweit",
        "weshalb",
        "wieso",
        "woher",
        "wohin"
    ]

};
},{}],5:[function(require,module,exports){
// via http://jmlr.org/papers/volume5/lewis04a/a11-smart-stop-list/english.stop
module.exports = {
    stopwords:[
        "a",
        "a's",
        "able",
        "about",
        "above",
        "according",
        "accordingly",
        "across",
        "actually",
        "after",
        "afterwards",
        "again",
        "against",
        "ain't",
        "all",
        "allow",
        "allows",
        "almost",
        "alone",
        "along",
        "already",
        "also",
        "although",
        "always",
        "am",
        "among",
        "amongst",
        "an",
        "and",
        "another",
        "any",
        "anybody",
        "anyhow",
        "anyone",
        "anything",
        "anyway",
        "anyways",
        "anywhere",
        "apart",
        "appear",
        "appreciate",
        "appropriate",
        "are",
        "aren't",
        "around",
        "as",
        "aside",
        "ask",
        "asking",
        "associated",
        "at",
        "available",
        "away",
        "awfully",
        "b",
        "be",
        "became",
        "because",
        "become",
        "becomes",
        "becoming",
        "been",
        "before",
        "beforehand",
        "behind",
        "being",
        "believe",
        "below",
        "beside",
        "besides",
        "best",
        "better",
        "between",
        "beyond",
        "both",
        "brief",
        "but",
        "by",
        "c",
        "c'mon",
        "c's",
        "came",
        "can",
        "can't",
        "cannot",
        "cant",
        "cause",
        "causes",
        "certain",
        "certainly",
        "changes",
        "clearly",
        "co",
        "com",
        "come",
        "comes",
        "concerning",
        "consequently",
        "consider",
        "considering",
        "contain",
        "containing",
        "contains",
        "corresponding",
        "could",
        "couldn't",
        "course",
        "currently",
        "d",
        "definitely",
        "described",
        "despite",
        "did",
        "didn't",
        "different",
        "do",
        "does",
        "doesn't",
        "doing",
        "don't",
        "done",
        "down",
        "downwards",
        "during",
        "e",
        "each",
        "edu",
        "eg",
        "eight",
        "either",
        "else",
        "elsewhere",
        "enough",
        "entirely",
        "especially",
        "et",
        "etc",
        "even",
        "ever",
        "every",
        "everybody",
        "everyone",
        "everything",
        "everywhere",
        "ex",
        "exactly",
        "example",
        "except",
        "f",
        "far",
        "few",
        "fifth",
        "first",
        "five",
        "followed",
        "following",
        "follows",
        "for",
        "former",
        "formerly",
        "forth",
        "four",
        "from",
        "further",
        "furthermore",
        "g",
        "get",
        "gets",
        "getting",
        "given",
        "gives",
        "go",
        "goes",
        "going",
        "gone",
        "got",
        "gotten",
        "greetings",
        "h",
        "had",
        "hadn't",
        "happens",
        "hardly",
        "has",
        "hasn't",
        "have",
        "haven't",
        "having",
        "he",
        "he's",
        "hello",
        "help",
        "hence",
        "her",
        "here",
        "here's",
        "hereafter",
        "hereby",
        "herein",
        "hereupon",
        "hers",
        "herself",
        "hi",
        "him",
        "himself",
        "his",
        "hither",
        "hopefully",
        "how",
        "howbeit",
        "however",
        "i",
        "i'd",
        "i'll",
        "i'm",
        "i've",
        "ie",
        "if",
        "ignored",
        "immediate",
        "in",
        "inasmuch",
        "inc",
        "indeed",
        "indicate",
        "indicated",
        "indicates",
        "inner",
        "insofar",
        "instead",
        "into",
        "inward",
        "is",
        "isn't",
        "it",
        "it'd",
        "it'll",
        "it's",
        "its",
        "itself",
        "j",
        "just",
        "k",
        "keep",
        "keeps",
        "kept",
        "know",
        "knows",
        "known",
        "l",
        "last",
        "lately",
        "later",
        "latter",
        "latterly",
        "least",
        "less",
        "lest",
        "let",
        "let's",
        "like",
        "liked",
        "likely",
        "little",
        "look",
        "looking",
        "looks",
        "ltd",
        "m",
        "mainly",
        "many",
        "may",
        "maybe",
        "me",
        "mean",
        "meanwhile",
        "merely",
        "might",
        "more",
        "moreover",
        "most",
        "mostly",
        "much",
        "must",
        "my",
        "myself",
        "n",
        "name",
        "namely",
        "nd",
        "near",
        "nearly",
        "necessary",
        "need",
        "needs",
        "neither",
        "never",
        "nevertheless",
        "new",
        "next",
        "nine",
        "no",
        "nobody",
        "non",
        "none",
        "noone",
        "nor",
        "normally",
        "not",
        "nothing",
        "novel",
        "now",
        "nowhere",
        "o",
        "obviously",
        "of",
        "off",
        "often",
        "oh",
        "ok",
        "okay",
        "old",
        "on",
        "once",
        "one",
        "ones",
        "only",
        "onto",
        "or",
        "other",
        "others",
        "otherwise",
        "ought",
        "our",
        "ours",
        "ourselves",
        "out",
        "outside",
        "over",
        "overall",
        "own",
        "p",
        "particular",
        "particularly",
        "per",
        "perhaps",
        "placed",
        "please",
        "plus",
        "possible",
        "presumably",
        "probably",
        "provides",
        "q",
        "que",
        "quite",
        "qv",
        "r",
        "rather",
        "rd",
        "re",
        "really",
        "reasonably",
        "regarding",
        "regardless",
        "regards",
        "relatively",
        "respectively",
        "right",
        "s",
        "said",
        "same",
        "saw",
        "say",
        "saying",
        "says",
        "second",
        "secondly",
        "see",
        "seeing",
        "seem",
        "seemed",
        "seeming",
        "seems",
        "seen",
        "self",
        "selves",
        "sensible",
        "sent",
        "serious",
        "seriously",
        "seven",
        "several",
        "shall",
        "she",
        "should",
        "shouldn't",
        "since",
        "six",
        "so",
        "some",
        "somebody",
        "somehow",
        "someone",
        "something",
        "sometime",
        "sometimes",
        "somewhat",
        "somewhere",
        "soon",
        "sorry",
        "specified",
        "specify",
        "specifying",
        "still",
        "sub",
        "such",
        "sup",
        "sure",
        "t",
        "t's",
        "take",
        "taken",
        "tell",
        "tends",
        "th",
        "than",
        "thank",
        "thanks",
        "thanx",
        "that",
        "that's",
        "thats",
        "the",
        "their",
        "theirs",
        "them",
        "themselves",
        "then",
        "thence",
        "there",
        "there's",
        "thereafter",
        "thereby",
        "therefore",
        "therein",
        "theres",
        "thereupon",
        "these",
        "they",
        "they'd",
        "they'll",
        "they're",
        "they've",
        "think",
        "third",
        "this",
        "thorough",
        "thoroughly",
        "those",
        "though",
        "three",
        "through",
        "throughout",
        "thru",
        "thus",
        "to",
        "together",
        "too",
        "took",
        "toward",
        "towards",
        "tried",
        "tries",
        "truly",
        "try",
        "trying",
        "twice",
        "two",
        "u",
        "un",
        "under",
        "unfortunately",
        "unless",
        "unlikely",
        "until",
        "unto",
        "up",
        "upon",
        "us",
        "use",
        "used",
        "useful",
        "uses",
        "using",
        "usually",
        "uucp",
        "v",
        "value",
        "various",
        "very",
        "via",
        "viz",
        "vs",
        "w",
        "want",
        "wants",
        "was",
        "wasn't",
        "way",
        "we",
        "we'd",
        "we'll",
        "we're",
        "we've",
        "welcome",
        "well",
        "went",
        "were",
        "weren't",
        "what",
        "what's",
        "whatever",
        "when",
        "whence",
        "whenever",
        "where",
        "where's",
        "whereafter",
        "whereas",
        "whereby",
        "wherein",
        "whereupon",
        "wherever",
        "whether",
        "which",
        "while",
        "whither",
        "who",
        "who's",
        "whoever",
        "whole",
        "whom",
        "whose",
        "why",
        "will",
        "willing",
        "wish",
        "with",
        "within",
        "without",
        "won't",
        "wonder",
        "would",
        "would",
        "wouldn't",
        "x",
        "y",
        "yes",
        "yet",
        "you",
        "you'd",
        "you'll",
        "you're",
        "you've",
        "your",
        "yours",
        "yourself",
        "yourselves",
        "z",
        "zero"
    ]
};
},{}],6:[function(require,module,exports){
//  via https://stop-words.googlecode.com/svn/trunk/stop-words/stop-words/stop-words-spanish.txt
module.exports = {
    stopwords: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '_',
        'a',
        'actualmente',
        'acuerdo',
        'adelante',
        'ademas',
        'además',
        'adrede',
        'afirmó',
        'agregó',
        'ahi',
        'ahora',
        'ahí',
        'al',
        'algo',
        'alguna',
        'algunas',
        'alguno',
        'algunos',
        'algún',
        'alli',
        'allí',
        'alrededor',
        'ambos',
        'ampleamos',
        'antano',
        'antaño',
        'ante',
        'anterior',
        'antes',
        'apenas',
        'aproximadamente',
        'aquel',
        'aquella',
        'aquellas',
        'aquello',
        'aquellos',
        'aqui',
        'aquél',
        'aquélla',
        'aquéllas',
        'aquéllos',
        'aquí',
        'arriba',
        'arribaabajo',
        'aseguró',
        'asi',
        'así',
        'atras',
        'aun',
        'aunque',
        'ayer',
        'añadió',
        'aún',
        'b',
        'bajo',
        'bastante',
        'bien',
        'breve',
        'buen',
        'buena',
        'buenas',
        'bueno',
        'buenos',
        'c',
        'cada',
        'casi',
        'cerca',
        'cierta',
        'ciertas',
        'cierto',
        'ciertos',
        'cinco',
        'claro',
        'comentó',
        'como',
        'con',
        'conmigo',
        'conocer',
        'conseguimos',
        'conseguir',
        'considera',
        'consideró',
        'consigo',
        'consigue',
        'consiguen',
        'consigues',
        'contigo',
        'contra',
        'cosas',
        'creo',
        'cual',
        'cuales',
        'cualquier',
        'cuando',
        'cuanta',
        'cuantas',
        'cuanto',
        'cuantos',
        'cuatro',
        'cuenta',
        'cuál',
        'cuáles',
        'cuándo',
        'cuánta',
        'cuántas',
        'cuánto',
        'cuántos',
        'cómo',
        'd',
        'da',
        'dado',
        'dan',
        'dar',
        'de',
        'debajo',
        'debe',
        'deben',
        'debido',
        'decir',
        'dejó',
        'del',
        'delante',
        'demasiado',
        'demás',
        'dentro',
        'deprisa',
        'desde',
        'despacio',
        'despues',
        'después',
        'detras',
        'detrás',
        'dia',
        'dias',
        'dice',
        'dicen',
        'dicho',
        'dieron',
        'diferente',
        'diferentes',
        'dijeron',
        'dijo',
        'dio',
        'donde',
        'dos',
        'durante',
        'día',
        'días',
        'dónde',
        'e',
        'ejemplo',
        'el',
        'ella',
        'ellas',
        'ello',
        'ellos',
        'embargo',
        'empleais',
        'emplean',
        'emplear',
        'empleas',
        'empleo',
        'en',
        'encima',
        'encuentra',
        'enfrente',
        'enseguida',
        'entonces',
        'entre',
        'era',
        'erais',
        'eramos',
        'eran',
        'eras',
        'eres',
        'es',
        'esa',
        'esas',
        'ese',
        'eso',
        'esos',
        'esta',
        'estaba',
        'estabais',
        'estaban',
        'estabas',
        'estad',
        'estada',
        'estadas',
        'estado',
        'estados',
        'estais',
        'estamos',
        'estan',
        'estando',
        'estar',
        'estaremos',
        'estará',
        'estarán',
        'estarás',
        'estaré',
        'estaréis',
        'estaría',
        'estaríais',
        'estaríamos',
        'estarían',
        'estarías',
        'estas',
        'este',
        'estemos',
        'esto',
        'estos',
        'estoy',
        'estuve',
        'estuviera',
        'estuvierais',
        'estuvieran',
        'estuvieras',
        'estuvieron',
        'estuviese',
        'estuvieseis',
        'estuviesen',
        'estuvieses',
        'estuvimos',
        'estuviste',
        'estuvisteis',
        'estuviéramos',
        'estuviésemos',
        'estuvo',
        'está',
        'estábamos',
        'estáis',
        'están',
        'estás',
        'esté',
        'estéis',
        'estén',
        'estés',
        'ex',
        'excepto',
        'existe',
        'existen',
        'explicó',
        'expresó',
        'f',
        'fin',
        'final',
        'fue',
        'fuera',
        'fuerais',
        'fueran',
        'fueras',
        'fueron',
        'fuese',
        'fueseis',
        'fuesen',
        'fueses',
        'fui',
        'fuimos',
        'fuiste',
        'fuisteis',
        'fuéramos',
        'fuésemos',
        'g',
        'general',
        'gran',
        'grandes',
        'gueno',
        'h',
        'ha',
        'haber',
        'habia',
        'habida',
        'habidas',
        'habido',
        'habidos',
        'habiendo',
        'habla',
        'hablan',
        'habremos',
        'habrá',
        'habrán',
        'habrás',
        'habré',
        'habréis',
        'habría',
        'habríais',
        'habríamos',
        'habrían',
        'habrías',
        'habéis',
        'había',
        'habíais',
        'habíamos',
        'habían',
        'habías',
        'hace',
        'haceis',
        'hacemos',
        'hacen',
        'hacer',
        'hacerlo',
        'haces',
        'hacia',
        'haciendo',
        'hago',
        'han',
        'has',
        'hasta',
        'hay',
        'haya',
        'hayamos',
        'hayan',
        'hayas',
        'hayáis',
        'he',
        'hecho',
        'hemos',
        'hicieron',
        'hizo',
        'horas',
        'hoy',
        'hube',
        'hubiera',
        'hubierais',
        'hubieran',
        'hubieras',
        'hubieron',
        'hubiese',
        'hubieseis',
        'hubiesen',
        'hubieses',
        'hubimos',
        'hubiste',
        'hubisteis',
        'hubiéramos',
        'hubiésemos',
        'hubo',
        'i',
        'igual',
        'incluso',
        'indicó',
        'informo',
        'informó',
        'intenta',
        'intentais',
        'intentamos',
        'intentan',
        'intentar',
        'intentas',
        'intento',
        'ir',
        'j',
        'junto',
        'k',
        'l',
        'la',
        'lado',
        'largo',
        'las',
        'le',
        'lejos',
        'les',
        'llegó',
        'lleva',
        'llevar',
        'lo',
        'los',
        'luego',
        'lugar',
        'm',
        'mal',
        'manera',
        'manifestó',
        'mas',
        'mayor',
        'me',
        'mediante',
        'medio',
        'mejor',
        'mencionó',
        'menos',
        'menudo',
        'mi',
        'mia',
        'mias',
        'mientras',
        'mio',
        'mios',
        'mis',
        'misma',
        'mismas',
        'mismo',
        'mismos',
        'modo',
        'momento',
        'mucha',
        'muchas',
        'mucho',
        'muchos',
        'muy',
        'más',
        'mí',
        'mía',
        'mías',
        'mío',
        'míos',
        'n',
        'nada',
        'nadie',
        'ni',
        'ninguna',
        'ningunas',
        'ninguno',
        'ningunos',
        'ningún',
        'no',
        'nos',
        'nosotras',
        'nosotros',
        'nuestra',
        'nuestras',
        'nuestro',
        'nuestros',
        'nueva',
        'nuevas',
        'nuevo',
        'nuevos',
        'nunca',
        'o',
        'ocho',
        'os',
        'otra',
        'otras',
        'otro',
        'otros',
        'p',
        'pais',
        'para',
        'parece',
        'parte',
        'partir',
        'pasada',
        'pasado',
        'paìs',
        'peor',
        'pero',
        'pesar',
        'poca',
        'pocas',
        'poco',
        'pocos',
        'podeis',
        'podemos',
        'poder',
        'podria',
        'podriais',
        'podriamos',
        'podrian',
        'podrias',
        'podrá',
        'podrán',
        'podría',
        'podrían',
        'poner',
        'por',
        'por qué',
        'porque',
        'posible',
        'primer',
        'primera',
        'primero',
        'primeros',
        'principalmente',
        'pronto',
        'propia',
        'propias',
        'propio',
        'propios',
        'proximo',
        'próximo',
        'próximos',
        'pudo',
        'pueda',
        'puede',
        'pueden',
        'puedo',
        'pues',
        'q',
        'qeu',
        'que',
        'quedó',
        'queremos',
        'quien',
        'quienes',
        'quiere',
        'quiza',
        'quizas',
        'quizá',
        'quizás',
        'quién',
        'quiénes',
        'qué',
        'r',
        'raras',
        'realizado',
        'realizar',
        'realizó',
        'repente',
        'respecto',
        's',
        'sabe',
        'sabeis',
        'sabemos',
        'saben',
        'saber',
        'sabes',
        'sal',
        'salvo',
        'se',
        'sea',
        'seamos',
        'sean',
        'seas',
        'segun',
        'segunda',
        'segundo',
        'según',
        'seis',
        'ser',
        'sera',
        'seremos',
        'será',
        'serán',
        'serás',
        'seré',
        'seréis',
        'sería',
        'seríais',
        'seríamos',
        'serían',
        'serías',
        'seáis',
        'señaló',
        'si',
        'sido',
        'siempre',
        'siendo',
        'siete',
        'sigue',
        'siguiente',
        'sin',
        'sino',
        'sobre',
        'sois',
        'sola',
        'solamente',
        'solas',
        'solo',
        'solos',
        'somos',
        'son',
        'soy',
        'soyos',
        'su',
        'supuesto',
        'sus',
        'suya',
        'suyas',
        'suyo',
        'suyos',
        'sé',
        'sí',
        'sólo',
        't',
        'tal',
        'tambien',
        'también',
        'tampoco',
        'tan',
        'tanto',
        'tarde',
        'te',
        'temprano',
        'tendremos',
        'tendrá',
        'tendrán',
        'tendrás',
        'tendré',
        'tendréis',
        'tendría',
        'tendríais',
        'tendríamos',
        'tendrían',
        'tendrías',
        'tened',
        'teneis',
        'tenemos',
        'tener',
        'tenga',
        'tengamos',
        'tengan',
        'tengas',
        'tengo',
        'tengáis',
        'tenida',
        'tenidas',
        'tenido',
        'tenidos',
        'teniendo',
        'tenéis',
        'tenía',
        'teníais',
        'teníamos',
        'tenían',
        'tenías',
        'tercera',
        'ti',
        'tiempo',
        'tiene',
        'tienen',
        'tienes',
        'toda',
        'todas',
        'todavia',
        'todavía',
        'todo',
        'todos',
        'total',
        'trabaja',
        'trabajais',
        'trabajamos',
        'trabajan',
        'trabajar',
        'trabajas',
        'trabajo',
        'tras',
        'trata',
        'través',
        'tres',
        'tu',
        'tus',
        'tuve',
        'tuviera',
        'tuvierais',
        'tuvieran',
        'tuvieras',
        'tuvieron',
        'tuviese',
        'tuvieseis',
        'tuviesen',
        'tuvieses',
        'tuvimos',
        'tuviste',
        'tuvisteis',
        'tuviéramos',
        'tuviésemos',
        'tuvo',
        'tuya',
        'tuyas',
        'tuyo',
        'tuyos',
        'tú',
        'u',
        'ultimo',
        'un',
        'una',
        'unas',
        'uno',
        'unos',
        'usa',
        'usais',
        'usamos',
        'usan',
        'usar',
        'usas',
        'uso',
        'usted',
        'ustedes',
        'v',
        'va',
        'vais',
        'valor',
        'vamos',
        'van',
        'varias',
        'varios',
        'vaya',
        'veces',
        'ver',
        'verdad',
        'verdadera',
        'verdadero',
        'vez',
        'vosotras',
        'vosotros',
        'voy',
        'vuestra',
        'vuestras',
        'vuestro',
        'vuestros',
        'w',
        'x',
        'y',
        'ya',
        'yo',
        'z',
        'él',
        'éramos',
        'ésa',
        'ésas',
        'ése',
        'ésos',
        'ésta',
        'éstas',
        'éste',
        'éstos',
        'última',
        'últimas',
        'último',
        'últimos'
    ]

};

},{}],7:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// French stopwords
// via https://code.google.com/p/stop-words/

module.exports = {
    stopwords: [
        "a",
        "à",
        "â",
        "abord",
        "afin",
        "ah",
        "ai",
        "aie",
        "ainsi",
        "allaient",
        "allo",
        "allô",
        "allons",
        "après",
        "assez",
        "attendu",
        "au",
        "aucun",
        "aucune",
        "aujourd",
        "aujourd'hui",
        "auquel",
        "aura",
        "auront",
        "aussi",
        "autre",
        "autres",
        "aux",
        "auxquelles",
        "auxquels",
        "avaient",
        "avais",
        "avait",
        "avant",
        "avec",
        "avoir",
        "ayant",
        "b",
        "bah",
        "beaucoup",
        "bien",
        "bigre",
        "boum",
        "bravo",
        "brrr",
        "c",
        "ça",
        "car",
        "ce",
        "ceci",
        "cela",
        "celle",
        "celle-ci",
        "celle-là",
        "celles",
        "celles-ci",
        "celles-là",
        "celui",
        "celui-ci",
        "celui-là",
        "cent",
        "cependant",
        "certain",
        "certaine",
        "certaines",
        "certains",
        "certes",
        "ces",
        "cet",
        "cette",
        "ceux",
        "ceux-ci",
        "ceux-là",
        "chacun",
        "chaque",
        "cher",
        "chère",
        "chères",
        "chers",
        "chez",
        "chiche",
        "chut",
        "ci",
        "cinq",
        "cinquantaine",
        "cinquante",
        "cinquantième",
        "cinquième",
        "clac",
        "clic",
        "combien",
        "comme",
        "comment",
        "compris",
        "concernant",
        "contre",
        "couic",
        "crac",
        "d",
        "da",
        "dans",
        "de",
        "debout",
        "dedans",
        "dehors",
        "delà",
        "depuis",
        "derrière",
        "des",
        "dès",
        "désormais",
        "desquelles",
        "desquels",
        "dessous",
        "dessus",
        "deux",
        "deuxième",
        "deuxièmement",
        "devant",
        "devers",
        "devra",
        "différent",
        "différente",
        "différentes",
        "différents",
        "dire",
        "divers",
        "diverse",
        "diverses",
        "dix",
        "dix-huit",
        "dixième",
        "dix-neuf",
        "dix-sept",
        "doit",
        "doivent",
        "donc",
        "dont",
        "douze",
        "douzième",
        "dring",
        "du",
        "duquel",
        "durant",
        "e",
        "effet",
        "eh",
        "elle",
        "elle-même",
        "elles",
        "elles-mêmes",
        "en",
        "encore",
        "entre",
        "envers",
        "environ",
        "es",
        "ès",
        "est",
        "et",
        "etant",
        "étaient",
        "étais",
        "était",
        "étant",
        "etc",
        "été",
        "etre",
        "être",
        "eu",
        "euh",
        "eux",
        "eux-mêmes",
        "excepté",
        "f",
        "façon",
        "fais",
        "faisaient",
        "faisant",
        "fait",
        "feront",
        "fi",
        "flac",
        "floc",
        "font",
        "g",
        "gens",
        "h",
        "ha",
        "hé",
        "hein",
        "hélas",
        "hem",
        "hep",
        "hi",
        "ho",
        "holà",
        "hop",
        "hormis",
        "hors",
        "hou",
        "houp",
        "hue",
        "hui",
        "huit",
        "huitième",
        "hum",
        "hurrah",
        "i",
        "il",
        "ils",
        "importe",
        "j",
        "je",
        "jusqu",
        "jusque",
        "k",
        "l",
        "la",
        "là",
        "laquelle",
        "las",
        "le",
        "lequel",
        "les",
        "lès",
        "lesquelles",
        "lesquels",
        "leur",
        "leurs",
        "longtemps",
        "lorsque",
        "lui",
        "lui-même",
        "m",
        "ma",
        "maint",
        "mais",
        "malgré",
        "me",
        "même",
        "mêmes",
        "merci",
        "mes",
        "mien",
        "mienne",
        "miennes",
        "miens",
        "mille",
        "mince",
        "moi",
        "moi-même",
        "moins",
        "mon",
        "moyennant",
        "n",
        "na",
        "ne",
        "néanmoins",
        "neuf",
        "neuvième",
        "ni",
        "nombreuses",
        "nombreux",
        "non",
        "nos",
        "notre",
        "nôtre",
        "nôtres",
        "nous",
        "nous-mêmes",
        "nul",
        "o",
        "o|",
        "ô",
        "oh",
        "ohé",
        "olé",
        "ollé",
        "on",
        "ont",
        "onze",
        "onzième",
        "ore",
        "ou",
        "où",
        "ouf",
        "ouias",
        "oust",
        "ouste",
        "outre",
        "p",
        "paf",
        "pan",
        "par",
        "parmi",
        "partant",
        "particulier",
        "particulière",
        "particulièrement",
        "pas",
        "passé",
        "pendant",
        "personne",
        "peu",
        "peut",
        "peuvent",
        "peux",
        "pff",
        "pfft",
        "pfut",
        "pif",
        "plein",
        "plouf",
        "plus",
        "plusieurs",
        "plutôt",
        "pouah",
        "pour",
        "pourquoi",
        "premier",
        "première",
        "premièrement",
        "près",
        "proche",
        "psitt",
        "puisque",
        "q",
        "qu",
        "quand",
        "quant",
        "quanta",
        "quant-à-soi",
        "quarante",
        "quatorze",
        "quatre",
        "quatre-vingt",
        "quatrième",
        "quatrièmement",
        "que",
        "quel",
        "quelconque",
        "quelle",
        "quelles",
        "quelque",
        "quelques",
        "quelqu'un",
        "quels",
        "qui",
        "quiconque",
        "quinze",
        "quoi",
        "quoique",
        "r",
        "revoici",
        "revoilà",
        "rien",
        "s",
        "sa",
        "sacrebleu",
        "sans",
        "sapristi",
        "sauf",
        "se",
        "seize",
        "selon",
        "sept",
        "septième",
        "sera",
        "seront",
        "ses",
        "si",
        "sien",
        "sienne",
        "siennes",
        "siens",
        "sinon",
        "six",
        "sixième",
        "soi",
        "soi-même",
        "soit",
        "soixante",
        "son",
        "sont",
        "sous",
        "stop",
        "suis",
        "suivant",
        "sur",
        "surtout",
        "t",
        "ta",
        "tac",
        "tant",
        "te",
        "té",
        "tel",
        "telle",
        "tellement",
        "telles",
        "tels",
        "tenant",
        "tes",
        "tic",
        "tien",
        "tienne",
        "tiennes",
        "tiens",
        "toc",
        "toi",
        "toi-même",
        "ton",
        "touchant",
        "toujours",
        "tous",
        "tout",
        "toute",
        "toutes",
        "treize",
        "trente",
        "très",
        "trois",
        "troisième",
        "troisièmement",
        "trop",
        "tsoin",
        "tsouin",
        "tu",
        "u",
        "un",
        "une",
        "unes",
        "uns",
        "v",
        "va",
        "vais",
        "vas",
        "vé",
        "vers",
        "via",
        "vif",
        "vifs",
        "vingt",
        "vivat",
        "vive",
        "vives",
        "vlan",
        "voici",
        "voilà",
        "vont",
        "vos",
        "votre",
        "vôtre",
        "vôtres",
        "vous",
        "vous-mêmes",
        "vu",
        "w",
        "x",
        "y",
        "z",
        "zut",
        "﻿alors",
        "aucuns",
        "bon",
        "devrait",
        "dos",
        "droite",
        "début",
        "essai",
        "faites",
        "fois",
        "force",
        "haut",
        "ici",
        "juste",
        "maintenant",
        "mine",
        "mot",
        "nommés",
        "nouveaux",
        "parce",
        "parole",
        "personnes",
        "pièce",
        "plupart",
        "seulement",
        "soyez",
        "sujet",
        "tandis",
        "valeur",
        "voie",
        "voient",
        "état",
        "étions"

    ]

};

},{}],8:[function(require,module,exports){
//  via http://www.ranks.nl/stopwords/galician
module.exports = {
    stopwords: [
        'a',
        'aínda',
        'alí',
        'aquel',
        'aquela',
        'aquelas',
        'aqueles',
        'aquilo',
        'aquí',
        'ao',
        'aos',
        'as',
        'así',
        'á',
        'ben',
        'cando',
        'che',
        'co',
        'coa',
        'comigo',
        'con',
        'connosco',
        'contigo',
        'convosco',
        'coas',
        'cos',
        'cun',
        'cuns',
        'cunha',
        'cunhas',
        'da',
        'dalgunha',
        'dalgunhas',
        'dalgún',
        'dalgúns',
        'das',
        'de',
        'del',
        'dela',
        'delas',
        'deles',
        'desde',
        'deste',
        'do',
        'dos',
        'dun',
        'duns',
        'dunha',
        'dunhas',
        'e',
        'el',
        'ela',
        'elas',
        'eles',
        'en',
        'era',
        'eran',
        'esa',
        'esas',
        'ese',
        'eses',
        'esta',
        'estar',
        'estaba',
        'está',
        'están',
        'este',
        'estes',
        'estiven',
        'estou',
        'eu',
        'é',
        'facer',
        'foi',
        'foron',
        'fun',
        'había',
        'hai',
        'iso',
        'isto',
        'la',
        'las',
        'lle',
        'lles',
        'lo',
        'los',
        'mais',
        'me',
        'meu',
        'meus',
        'min',
        'miña',
        'miñas',
        'moi',
        'na',
        'nas',
        'neste',
        'nin',
        'no',
        'non',
        'nos',
        'nosa',
        'nosas',
        'noso',
        'nosos',
        'nós',
        'nun',
        'nunha',
        'nuns',
        'nunhas',
        'o',
        'os',
        'ou',
        'ó',
        'ós',
        'para',
        'pero',
        'pode',
        'pois',
        'pola',
        'polas',
        'polo',
        'polos',
        'por',
        'que',
        'se',
        'senón',
        'ser',
        'seu',
        'seus',
        'sexa',
        'sido',
        'sobre',
        'súa',
        'súas',
        'tamén',
        'tan',
        'te',
        'ten',
        'teñen',
        'teño',
        'ter',
        'teu',
        'teus',
        'ti',
        'tido',
        'tiña',
        'tiven',
        'túa',
        'túas',
        'un',
        'unha',
        'unhas',
        'uns',
        'vos',
        'vosa',
        'vosas',
        'voso',
        'vosos',
        'vós'
    ]
};

},{}],9:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// Italian stopwords
// via https://code.google.com/p/stop-words/

module.exports = {
    stopwords: [
        "a",
        "adesso",
        "ai",
        "al",
        "alla",
        "allo",
        "allora",
        "altre",
        "altri",
        "altro",
        "anche",
        "ancora",
        "avere",
        "aveva",
        "avevano",
        "ben",
        "buono",
        "che",
        "chi",
        "cinque",
        "comprare",
        "con",
        "consecutivi",
        "consecutivo",
        "cosa",
        "cui",
        "da",
        "del",
        "della",
        "dello",
        "dentro",
        "deve",
        "devo",
        "di",
        "doppio",
        "due",
        "e",
        "ecco",
        "fare",
        "fine",
        "fino",
        "fra",
        "gente",
        "giu",
        "ha",
        "hai",
        "hanno",
        "ho",
        "il",
        "indietro",
        "invece",
        "io",
        "la",
        "lavoro",
        "le",
        "lei",
        "lo",
        "loro",
        "lui",
        "lungo",
        "ma",
        "me",
        "meglio",
        "molta",
        "molti",
        "molto",
        "nei",
        "nella",
        "no",
        "noi",
        "nome",
        "nostro",
        "nove",
        "nuovi",
        "nuovo",
        "o",
        "oltre",
        "ora",
        "otto",
        "peggio",
        "pero",
        "persone",
        "piu",
        "poco",
        "primo",
        "promesso",
        "qua",
        "quarto",
        "quasi",
        "quattro",
        "quello",
        "questo",
        "qui",
        "quindi",
        "quinto",
        "rispetto",
        "sara",
        "secondo",
        "sei",
        "sembra",
        "sembrava",
        "senza",
        "sette",
        "sia",
        "siamo",
        "siete",
        "solo",
        "sono",
        "sopra",
        "soprattutto",
        "sotto",
        "stati",
        "stato",
        "stesso",
        "su",
        "subito",
        "sul",
        "sulla",
        "tanto",
        "te",
        "tempo",
        "terzo",
        "tra",
        "tre",
        "triplo",
        "ultimo",
        "un",
        "una",
        "uno",
        "va",
        "vai",
        "voi",
        "volte",
        "vostro",
        "a",
        "abbastanza",
        "accidenti",
        "ad",
        "affinche",
        "agli",
        "ahime",
        "ahimÃ",
        "alcuna",
        "alcuni",
        "alcuno",
        "all",
        "alle",
        "altrimenti",
        "altrui",
        "anni",
        "anno",
        "ansa",
        "assai",
        "attesa",
        "avanti",
        "avendo",
        "avente",
        "aver",
        "avete",
        "avuta",
        "avute",
        "avuti",
        "avuto",
        "basta",
        "bene",
        "benissimo",
        "berlusconi",
        "brava",
        "bravo",
        "c",
        "casa",
        "caso",
        "cento",
        "certa",
        "certe",
        "certi",
        "certo",
        "chicchessia",
        "chiunque",
        "ci",
        "ciascuna",
        "ciascuno",
        "cima",
        "cio",
        "ciÃ",
        "cioe",
        "cioÃ",
        "circa",
        "citta",
        "cittÃ",
        "codesta",
        "codesti",
        "codesto",
        "cogli",
        "coi",
        "col",
        "colei",
        "coll",
        "coloro",
        "colui",
        "come",
        "concernente",
        "consiglio",
        "contro",
        "cortesia",
        "cos",
        "cosi",
        "cosÃ",
        "d",
        "dagli",
        "dai",
        "dal",
        "dall",
        "dalla",
        "dalle",
        "dallo",
        "davanti",
        "degli",
        "dei",
        "dell",
        "delle",
        "detto",
        "dice",
        "dietro",
        "dire",
        "dirimpetto",
        "dopo",
        "dove",
        "dovra",
        "dovrÃ",
        "dunque",
        "durante",
        "Ã",
        "ed",
        "egli",
        "ella",
        "eppure",
        "era",
        "erano",
        "esse",
        "essendo",
        "esser",
        "essere",
        "essi",
        "ex",
        "fa",
        "fatto",
        "favore",
        "fin",
        "finalmente",
        "finche",
        "forse",
        "fuori",
        "gia",
        "giÃ",
        "giacche",
        "giorni",
        "giorno",
        "gli",
        "gliela",
        "gliele",
        "glieli",
        "glielo",
        "gliene",
        "governo",
        "grande",
        "grazie",
        "gruppo",
        "i",
        "ieri",
        "improvviso",
        "in",
        "infatti",
        "insieme",
        "intanto",
        "intorno",
        "l",
        "lÃ",
        "li",
        "lontano",
        "macche",
        "magari",
        "mai",
        "male",
        "malgrado",
        "malissimo",
        "medesimo",
        "mediante",
        "meno",
        "mentre",
        "mesi",
        "mezzo",
        "mi",
        "mia",
        "mie",
        "miei",
        "mila",
        "miliardi",
        "milioni",
        "ministro",
        "mio",
        "moltissimo",
        "mondo",
        "nazionale",
        "ne",
        "negli",
        "nel",
        "nell",
        "nelle",
        "nello",
        "nemmeno",
        "neppure",
        "nessuna",
        "nessuno",
        "niente",
        "non",
        "nondimeno",
        "nostra",
        "nostre",
        "nostri",
        "nulla",
        "od",
        "oggi",
        "ogni",
        "ognuna",
        "ognuno",
        "oppure",
        "ore",
        "osi",
        "ossia",
        "paese",
        "parecchi",
        "parecchie",
        "parecchio",
        "parte",
        "partendo",
        "peccato",
        "per",
        "perche",
        "perchÃ",
        "percio",
        "perciÃ",
        "perfino",
        "perÃ",
        "piedi",
        "pieno",
        "piglia",
        "piÃ",
        "po",
        "pochissimo",
        "poi",
        "poiche",
        "press",
        "prima",
        "proprio",
        "puo",
        "puÃ",
        "pure",
        "purtroppo",
        "qualche",
        "qualcuna",
        "qualcuno",
        "quale",
        "quali",
        "qualunque",
        "quando",
        "quanta",
        "quante",
        "quanti",
        "quanto",
        "quantunque",
        "quel",
        "quella",
        "quelli",
        "quest",
        "questa",
        "queste",
        "questi",
        "riecco",
        "salvo",
        "sarÃ",
        "sarebbe",
        "scopo",
        "scorso",
        "se",
        "seguente",
        "sempre",
        "si",
        "solito",
        "sta",
        "staranno",
        "stata",
        "state",
        "sua",
        "successivo",
        "sue",
        "sugli",
        "sui",
        "sull",
        "sulle",
        "sullo",
        "suo",
        "suoi",
        "tale",
        "talvolta",
        "ti",
        "torino",
        "tranne",
        "troppo",
        "tu",
        "tua",
        "tue",
        "tuo",
        "tuoi",
        "tutta",
        "tuttavia",
        "tutte",
        "tutti",
        "tutto",
        "uguali",
        "uomo",
        "vale",
        "varia",
        "varie",
        "vario",
        "verso",
        "vi",
        "via",
        "vicino",
        "visto",
        "vita",
        "volta",
        "vostra",
        "vostre",
        "vostri"
    ]
};

},{}],10:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// Dutch stopwords
// via https://code.google.com/p/stop-words/



module.exports = {
    stopwords:[
        "aan",
        "af",
        "al",
        "als",
        "bij",
        "dan",
        "dat",
        "die",
        "dit",
        "een",
        "en",
        "er",
        "had",
        "heb",
        "hem",
        "het",
        "hij",
        "hoe",
        "hun",
        "ik",
        "in",
        "is",
        "je",
        "kan",
        "me",
        "men",
        "met",
        "mij",
        "nog",
        "nu",
        "of",
        "ons",
        "ook",
        "te",
        "tot",
        "uit",
        "van",
        "was",
        "wat",
        "we",
        "wel",
        "wij",
        "zal",
        "ze",
        "zei",
        "zij",
        "zo",
        "zou",
        "aan",
        "aangaande",
        "aangezien",
        "achter",
        "achterna",
        "afgelopen",
        "al",
        "aldaar",
        "aldus",
        "alhoewel",
        "alias",
        "alle",
        "allebei",
        "alleen",
        "alsnog",
        "altijd",
        "altoos",
        "ander",
        "andere",
        "anders",
        "anderszins",
        "behalve",
        "behoudens",
        "beide",
        "beiden",
        "ben",
        "beneden",
        "bent",
        "bepaald",
        "betreffende",
        "bij",
        "binnen",
        "binnenin",
        "boven",
        "bovenal",
        "bovendien",
        "bovengenoemd",
        "bovenstaand",
        "bovenvermeld",
        "buiten",
        "daar",
        "daarheen",
        "daarin",
        "daarna",
        "daarnet",
        "daarom",
        "daarop",
        "daarvanlangs",
        "dan",
        "dat",
        "de",
        "die",
        "dikwijls",
        "dit",
        "door",
        "doorgaand",
        "dus",
        "echter",
        "eer",
        "eerdat",
        "eerder",
        "eerlang",
        "eerst",
        "elk",
        "elke",
        "en",
        "enig",
        "enigszins",
        "enkel",
        "er",
        "erdoor",
        "even",
        "eveneens",
        "evenwel",
        "gauw",
        "gedurende",
        "geen",
        "gehad",
        "gekund",
        "geleden",
        "gelijk",
        "gemoeten",
        "gemogen",
        "geweest",
        "gewoon",
        "gewoonweg",
        "haar",
        "had",
        "hadden",
        "hare",
        "heb",
        "hebben",
        "hebt",
        "heeft",
        "hem",
        "hen",
        "het",
        "hierbeneden",
        "hierboven",
        "hij",
        "hoe",
        "hoewel",
        "hun",
        "hunne",
        "ik",
        "ikzelf",
        "in",
        "inmiddels",
        "inzake",
        "is",
        "jezelf",
        "jij",
        "jijzelf",
        "jou",
        "jouw",
        "jouwe",
        "juist",
        "jullie",
        "kan",
        "klaar",
        "kon",
        "konden",
        "krachtens",
        "kunnen",
        "kunt",
        "later",
        "liever",
        "maar",
        "mag",
        "meer",
        "met",
        "mezelf",
        "mij",
        "mijn",
        "mijnent",
        "mijner",
        "mijzelf",
        "misschien",
        "mocht",
        "mochten",
        "moest",
        "moesten",
        "moet",
        "moeten",
        "mogen",
        "na",
        "naar",
        "nadat",
        "net",
        "niet",
        "noch",
        "nog",
        "nogal",
        "nu",
        "of",
        "ofschoon",
        "om",
        "omdat",
        "omhoog",
        "omlaag",
        "omstreeks",
        "omtrent",
        "omver",
        "onder",
        "ondertussen",
        "ongeveer",
        "ons",
        "onszelf",
        "onze",
        "ook",
        "op",
        "opnieuw",
        "opzij",
        "over",
        "overeind",
        "overigens",
        "pas",
        "precies",
        "reeds",
        "rond",
        "rondom",
        "sedert",
        "sinds",
        "sindsdien",
        "slechts",
        "sommige",
        "spoedig",
        "steeds",
        "tamelijk",
        "tenzij",
        "terwijl",
        "thans",
        "tijdens",
        "toch",
        "toen",
        "toenmaals",
        "toenmalig",
        "tot",
        "totdat",
        "tussen",
        "uit",
        "uitgezonderd",
        "vaakwat",
        "van",
        "vandaan",
        "vanuit",
        "vanwege",
        "veeleer",
        "verder",
        "vervolgens",
        "vol",
        "volgens",
        "voor",
        "vooraf",
        "vooral",
        "vooralsnog",
        "voorbij",
        "voordat",
        "voordezen",
        "voordien",
        "voorheen",
        "voorop",
        "vooruit",
        "vrij",
        "vroeg",
        "waar",
        "waarom",
        "wanneer",
        "want",
        "waren",
        "was",
        "weer",
        "weg",
        "wegens",
        "wel",
        "weldra",
        "welk",
        "welke",
        "wie",
        "wiens",
        "wier",
        "wij",
        "wijzelf",
        "zal",
        "ze",
        "zelfs",
        "zichzelf",
        "zij",
        "zijn",
        "zijne",
        "zo",
        "zodra",
        "zonder",
        "zou",
        "zouden",
        "zowat",
        "zulke",
        "zullen",
        "zult"
    ]
};


},{}],11:[function(require,module,exports){
// via http://hackage.haskell.org/package/glider-nlp-0.1/docs/src/Glider-NLP-Language-Polish-StopWords.html
module.exports = {
    stopwords:[
        "a",
"aby",
"ach",
"acz",
"aczkolwiek",
"aj",
"albo",
"ale",
"alez",
"ależ",
"ani",
"az",
"aż",
"bardziej",
"bardzo",
"bo",
"bowiem",
"by",
"byli",
"bynajmniej",
"byc",
"być",
"byl",
"był",
"byla",
"bylo",
"byly",
"była",
"było",
"były",
"bedzie",
"będzie",
"beda",
"będą",
"cali",
"cala",
"cała",
"caly",
"cały",
"ci",
"cie",
"cię",
"ciebie",
"co",
"cokolwiek",
"cos",
"coś",
"czasami",
"czasem",
"czemu",
"czy",
"czyli",
"daleko",
"dla",
"dlaczego",
"dlatego",
"do",
"dobrze",
"dokad",
"dokąd",
"dosc",
"dość",
"duzo",
"dużo",
"dwa",
"dwaj",
"dwie",
"dwoje",
"dzis",
"dziś",
"dzisiaj",
"gdy",
"gdyby",
"gdyz",
"gdyż",
"gdzie",
"gdziekolwiek",
"gdzies",
"gdzieś",
"go",
"i",
"ich",
"ile",
"im",
"inna",
"inne",
"inny",
"innych",
"iz",
"iż",
"ja",
"ją",
"jak",
"jakas",
"jakaś",
"jakby",
"jaki",
"jakichs",
"jakichś",
"jakie",
"jakis",
"jakiś",
"jakiz",
"jakiż",
"jakkolwiek",
"jako",
"jakos",
"jakoś",
"je",
"jeden",
"jedna",
"jedno",
"jednak",
"jednakze",
"jednakże",
"jego",
"jej",
"jemu",
"jest",
"jestem",
"jeszcze",
"jesli",
"jeśli",
"jezeli",
"jeżeli",
"juz",
"już",
"kazdy",
"każdy",
"kiedy",
"kilka",
"kims",
"kimś",
"kto",
"ktokolwiek",
"ktos",
"ktoś",
"ktora",
"ktore",
"które",
"ktorego",
"ktorej",
"ktory",
"ktorych",
"ktorym",
"ktorzy",
"która",
"którego",
"której",
"który",
"których",
"którym",
"którzy",
"ku",
"lat",
"lecz",
"lub",
"ma",
"mają",
"mało",
"mam",
"mi",
"mimo",
"miedzy",
"między",
"mna",
"mną",
"mnie",
"moga",
"mogą",
"moi",
"moim",
"moja",
"moje",
"moze",
"może",
"mozliwe",
"mozna",
"możliwe",
"można",
"moj",
"mój",
"mu",
"musi",
"my",
"na",
"nad",
"nam",
"nami",
"nas",
"nasi",
"nasz",
"nasza",
"nasze",
"naszego",
"naszych",
"natomiast",
"natychmiast",
"nawet",
"nia",
"nią",
"nic",
"nich",
"nie",
"niech",
"niego",
"niej",
"niemu",
"nigdy",
"nim",
"nimi",
"niz",
"niż",
"no",
"o",
"obok",
"od",
"około",
"on",
"ona",
"one",
"oni",
"ono",
"oraz",
"oto",
"owszem",
"pan",
"pana",
"pani",
"po",
"pod",
"podczas",
"pomimo",
"ponad",
"poniewaz",
"ponieważ",
"powinien",
"powinna",
"powinni",
"powinno",
"poza",
"prawie",
"przeciez",
"przecież",
"przed",
"przede",
"przedtem",
"przez",
"przy",
"roku",
"rowniez",
"również",
"sam",
"sama",
"są",
"sie",
"się",
"skad",
"skąd",
"sobie",
"soba",
"sobą",
"sposob",
"sposób",
"swoje",
"ta",
"tak",
"taka",
"taki",
"takie",
"takze",
"także",
"tam",
"te",
"tego",
"tej",
"ten",
"teraz",
"też",
"to",
"toba",
"tobą",
"tobie",
"totez",
"toteż",
"trzeba",
"tu",
"tutaj",
"twoi",
"twoim",
"twoja",
"twoje",
"twym",
"twoj",
"twój",
"ty",
"tych",
"tylko",
"tym",
"u",
"w",
"wam",
"wami",
"was",
"wasz",
"wasza",
"wasze",
"we",
"według",
"wiele",
"wielu",
"więc",
"więcej",
"wszyscy",
"wszystkich",
"wszystkie",
"wszystkim",
"wszystko",
"wtedy",
"wy",
"wlasnie",
"właśnie",
"z",
"za",
"zapewne",
"zawsze",
"ze",
"znowu",
"znow",
"znów",
"zostal",
"został",
"zaden",
"zadna",
"zadne",
"zadnych",
"ze",
"zeby",
"żaden",
"żadna",
"żadne",
"żadnych",
"że",
"żeby"
    ]
};

},{}],12:[function(require,module,exports){
/**
 * Created by rodrigo on 01/10/15.
 */

//Portuguese (BRAZIL) stopwords
// via https://sites.google.com/site/kevinbouge/stopwords-lists
module.exports = {
    stopwords: [
        "a",
        "à",
        "adeus",
        "agora",
        "aí",
        "ainda",
        "além",
        "algo",
        "algumas",
        "alguns",
        "ali",
        "ano",
        "anos",
        "antes",
        "ao",
        "aos",
        "apenas",
        "apoio",
        "após",
        "aquela",
        "aquelas",
        "aquele",
        "aqueles",
        "aqui",
        "aquilo",
        "área",
        "as",
        "às",
        "assim",
        "até",
        "atrás",
        "através",
        "baixo",
        "bastante",
        "bem",
        "boa",
        "boas",
        "bom",
        "bons",
        "breve",
        "cá",
        "cada",
        "catorze",
        "cedo",
        "cento",
        "certamente",
        "certeza",
        "cima",
        "cinco",
        "coisa",
        "com",
        "como",
        "conselho",
        "contra",
        "custa",
        "da",
        "dá",
        "dão",
        "daquela",
        "daquelas",
        "daquele",
        "daqueles",
        "dar",
        "das",
        "de",
        "debaixo",
        "demais",
        "dentro",
        "depois",
        "desde",
        "dessa",
        "dessas",
        "desse",
        "desses",
        "desta",
        "destas",
        "deste",
        "destes",
        "deve",
        "deverá",
        "dez",
        "dezanove",
        "dezasseis",
        "dezassete",
        "dezoito",
        "dia",
        "diante",
        "diz",
        "dizem",
        "dizer",
        "do",
        "dois",
        "dos",
        "doze",
        "duas",
        "dúvida",
        "e",
        "é",
        "ela",
        "elas",
        "ele",
        "eles",
        "em",
        "embora",
        "entre",
        "era",
        "és",
        "essa",
        "essas",
        "esse",
        "esses",
        "esta",
        "está",
        "estão",
        "estar",
        "estas",
        "estás",
        "estava",
        "este",
        "estes",
        "esteve",
        "estive",
        "estivemos",
        "estiveram",
        "estiveste",
        "estivestes",
        "estou",
        "eu",
        "exemplo",
        "faço",
        "falta",
        "favor",
        "faz",
        "fazeis",
        "fazem",
        "fazemos",
        "fazer",
        "fazes",
        "fez",
        "fim",
        "final",
        "foi",
        "fomos",
        "for",
        "foram",
        "forma",
        "foste",
        "fostes",
        "fui",
        "geral",
        "grande",
        "grandes",
        "grupo",
        "há",
        "hoje",
        "hora",
        "horas",
        "isso",
        "isto",
        "já",
        "lá",
        "lado",
        "local",
        "logo",
        "longe",
        "lugar",
        "maior",
        "maioria",
        "mais",
        "mal",
        "mas",
        "máximo",
        "me",
        "meio",
        "menor",
        "menos",
        "mês",
        "meses",
        "meu",
        "meus",
        "mil",
        "minha",
        "minhas",
        "momento",
        "muito",
        "muitos",
        "na",
        "nada",
        "não",
        "naquela",
        "naquelas",
        "naquele",
        "naqueles",
        "nas",
        "nem",
        "nenhuma",
        "nessa",
        "nessas",
        "nesse",
        "nesses",
        "nesta",
        "nestas",
        "neste",
        "nestes",
        "nível",
        "no",
        "noite",
        "nome",
        "nos",
        "nós",
        "nossa",
        "nossas",
        "nosso",
        "nossos",
        "nova",
        "novas",
        "nove",
        "novo",
        "novos",
        "num",
        "numa",
        "número",
        "nunca",
        "o",
        "obra",
        "obrigada",
        "obrigado",
        "oitava",
        "oitavo",
        "oito",
        "onde",
        "ontem",
        "onze",
        "os",
        "ou",
        "outra",
        "outras",
        "outro",
        "outros",
        "para",
        "parece",
        "parte",
        "partir",
        "paucas",
        "pela",
        "pelas",
        "pelo",
        "pelos",
        "perto",
        "pode",
        "pôde",
        "podem",
        "poder",
        "põe",
        "põem",
        "ponto",
        "pontos",
        "por",
        "porque",
        "porquê",
        "posição",
        "possível",
        "possivelmente",
        "posso",
        "pouca",
        "pouco",
        "poucos",
        "primeira",
        "primeiras",
        "primeiro",
        "primeiros",
        "própria",
        "próprias",
        "próprio",
        "próprios",
        "próxima",
        "próximas",
        "próximo",
        "próximos",
        "puderam",
        "quáis",
        "qual",
        "quando",
        "quanto",
        "quarta",
        "quarto",
        "quatro",
        "que",
        "quê",
        "quem",
        "quer",
        "quereis",
        "querem",
        "queremas",
        "queres",
        "quero",
        "questão",
        "quinta",
        "quinto",
        "quinze",
        "relação",
        "sabe",
        "sabem",
        "são",
        "se",
        "segunda",
        "segundo",
        "sei",
        "seis",
        "sem",
        "sempre",
        "ser",
        "seria",
        "sete",
        "sétima",
        "sétimo",
        "seu",
        "seus",
        "sexta",
        "sexto",
        "sim",
        "sistema",
        "sob",
        "sobre",
        "sois",
        "somos",
        "sou",
        "sua",
        "suas",
        "tal",
        "talvez",
        "também",
        "tanta",
        "tantas",
        "tanto",
        "tão",
        "tarde",
        "te",
        "tem",
        "têm",
        "temos",
        "tendes",
        "tenho",
        "tens",
        "ter",
        "terceira",
        "terceiro",
        "teu",
        "teus",
        "teve",
        "tive",
        "tivemos",
        "tiveram",
        "tiveste",
        "tivestes",
        "toda",
        "todas",
        "todo",
        "todos",
        "trabalho",
        "três",
        "treze",
        "tu",
        "tua",
        "tuas",
        "tudo",
        "um",
        "uma",
        "umas",
        "uns",
        "vai",
        "vais",
        "vão",
        "vários",
        "vem",
        "vêm",
        "vens",
        "ver",
        "vez",
        "vezes",
        "viagem",
        "vindo",
        "vinte",
        "você",
        "vocês",
        "vos",
        "vós",
        "vossa",
        "vossas",
        "vosso",
        "vossos",
        "zero"
    ]
};
},{}],13:[function(require,module,exports){
// credits to: https://raw.githubusercontent.com/stopwords-iso/stopwords-ro/master/stopwords-ro.json
module.exports = {
    stopwords: [
        "a",
        "abia",
        "acea",
        "aceasta",
        "această",
        "aceea",
        "aceeasi",
        "acei",
        "aceia",
        "acel",
        "acela",
        "acelasi",
        "acele",
        "acelea",
        "acest",
        "acesta",
        "aceste",
        "acestea",
        "acestei",
        "acestia",
        "acestui",
        "aceşti",
        "aceştia",
        "acolo",
        "acord",
        "acum",
        "adica",
        "ai",
        "aia",
        "aibă",
        "aici",
        "aiurea",
        "al",
        "ala",
        "alaturi",
        "ale",
        "alea",
        "alt",
        "alta",
        "altceva",
        "altcineva",
        "alte",
        "altfel",
        "alti",
        "altii",
        "altul",
        "am",
        "anume",
        "apoi",
        "ar",
        "are",
        "as",
        "asa",
        "asemenea",
        "asta",
        "astazi",
        "astea",
        "astfel",
        "astăzi",
        "asupra",
        "atare",
        "atat",
        "atata",
        "atatea",
        "atatia",
        "ati",
        "atit",
        "atita",
        "atitea",
        "atitia",
        "atunci",
        "au",
        "avea",
        "avem",
        "aveţi",
        "avut",
        "azi",
        "aş",
        "aşadar",
        "aţi",
        "b",
        "ba",
        "bine",
        "bucur",
        "bună",
        "c",
        "ca",
        "cam",
        "cand",
        "capat",
        "care",
        "careia",
        "carora",
        "caruia",
        "cat",
        "catre",
        "caut",
        "ce",
        "cea",
        "ceea",
        "cei",
        "ceilalti",
        "cel",
        "cele",
        "celor",
        "ceva",
        "chiar",
        "ci",
        "cinci",
        "cind",
        "cine",
        "cineva",
        "cit",
        "cita",
        "cite",
        "citeva",
        "citi",
        "citiva",
        "conform",
        "contra",
        "cu",
        "cui",
        "cum",
        "cumva",
        "curând",
        "curînd",
        "când",
        "cât",
        "câte",
        "câtva",
        "câţi",
        "cînd",
        "cît",
        "cîte",
        "cîtva",
        "cîţi",
        "că",
        "căci",
        "cărei",
        "căror",
        "cărui",
        "către",
        "d",
        "da",
        "daca",
        "dacă",
        "dar",
        "dat",
        "datorită",
        "dată",
        "dau",
        "de",
        "deasupra",
        "deci",
        "decit",
        "degraba",
        "deja",
        "deoarece",
        "departe",
        "desi",
        "despre",
        "deşi",
        "din",
        "dinaintea",
        "dintr",
        "dintr-",
        "dintre",
        "doar",
        "doi",
        "doilea",
        "două",
        "drept",
        "dupa",
        "după",
        "dă",
        "e",
        "ea",
        "ei",
        "el",
        "ele",
        "era",
        "eram",
        "este",
        "eu",
        "exact",
        "eşti",
        "f",
        "face",
        "fara",
        "fata",
        "fel",
        "fi",
        "fie",
        "fiecare",
        "fii",
        "fim",
        "fiu",
        "fiţi",
        "foarte",
        "fost",
        "frumos",
        "fără",
        "g",
        "geaba",
        "graţie",
        "h",
        "halbă",
        "i",
        "ia",
        "iar",
        "ieri",
        "ii",
        "il",
        "imi",
        "in",
        "inainte",
        "inapoi",
        "inca",
        "incit",
        "insa",
        "intr",
        "intre",
        "isi",
        "iti",
        "j",
        "k",
        "l",
        "la",
        "le",
        "li",
        "lor",
        "lui",
        "lângă",
        "lîngă",
        "m",
        "ma",
        "mai",
        "mare",
        "mea",
        "mei",
        "mele",
        "mereu",
        "meu",
        "mi",
        "mie",
        "mine",
        "mod",
        "mult",
        "multa",
        "multe",
        "multi",
        "multă",
        "mulţi",
        "mulţumesc",
        "mâine",
        "mîine",
        "mă",
        "n",
        "ne",
        "nevoie",
        "ni",
        "nici",
        "niciodata",
        "nicăieri",
        "nimeni",
        "nimeri",
        "nimic",
        "niste",
        "nişte",
        "noastre",
        "noastră",
        "noi",
        "noroc",
        "nostri",
        "nostru",
        "nou",
        "noua",
        "nouă",
        "noştri",
        "nu",
        "numai",
        "o",
        "opt",
        "or",
        "ori",
        "oricare",
        "orice",
        "oricine",
        "oricum",
        "oricând",
        "oricât",
        "oricînd",
        "oricît",
        "oriunde",
        "p",
        "pai",
        "parca",
        "patra",
        "patru",
        "patrulea",
        "pe",
        "pentru",
        "peste",
        "pic",
        "pina",
        "plus",
        "poate",
        "pot",
        "prea",
        "prima",
        "primul",
        "prin",
        "printr-",
        "putini",
        "puţin",
        "puţina",
        "puţină",
        "până",
        "pînă",
        "r",
        "rog",
        "s",
        "sa",
        "sa-mi",
        "sa-ti",
        "sai",
        "sale",
        "sau",
        "se",
        "si",
        "sint",
        "sintem",
        "spate",
        "spre",
        "sub",
        "sunt",
        "suntem",
        "sunteţi",
        "sus",
        "sută",
        "sînt",
        "sîntem",
        "sînteţi",
        "să",
        "săi",
        "său",
        "t",
        "ta",
        "tale",
        "te",
        "ti",
        "timp",
        "tine",
        "toata",
        "toate",
        "toată",
        "tocmai",
        "tot",
        "toti",
        "totul",
        "totusi",
        "totuşi",
        "toţi",
        "trei",
        "treia",
        "treilea",
        "tu",
        "tuturor",
        "tăi",
        "tău",
        "u",
        "ul",
        "ului",
        "un",
        "una",
        "unde",
        "undeva",
        "unei",
        "uneia",
        "unele",
        "uneori",
        "unii",
        "unor",
        "unora",
        "unu",
        "unui",
        "unuia",
        "unul",
        "v",
        "va",
        "vi",
        "voastre",
        "voastră",
        "voi",
        "vom",
        "vor",
        "vostru",
        "vouă",
        "voştri",
        "vreme",
        "vreo",
        "vreun",
        "vă",
        "x",
        "z",
        "zece",
        "zero",
        "zi",
        "zice",
        "îi",
        "îl",
        "îmi",
        "împotriva",
        "în",
        "înainte",
        "înaintea",
        "încotro",
        "încât",
        "încît",
        "între",
        "întrucât",
        "întrucît",
        "îţi",
        "ăla",
        "ălea",
        "ăsta",
        "ăstea",
        "ăştia",
        "şapte",
        "şase",
        "şi",
        "ştiu",
        "ţi",
        "ţie"
    ]
};
},{}],14:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// Russian stopwords
// via https://code.google.com/p/stop-words/

module.exports = {
    stopwords: [
        "а",
        "е",
        "и",
        "ж",
        "м",
        "о",
        "на",
        "не",
        "ни",
        "об",
        "но",
        "он",
        "мне",
        "мои",
        "мож",
        "она",
        "они",
        "оно",
        "мной",
        "много",
        "многочисленное",
        "многочисленная",
        "многочисленные",
        "многочисленный",
        "мною",
        "мой",
        "мог",
        "могут",
        "можно",
        "может",
        "можхо",
        "мор",
        "моя",
        "моё",
        "мочь",
        "над",
        "нее",
        "оба",
        "нам",
        "нем",
        "нами",
        "ними",
        "мимо",
        "немного",
        "одной",
        "одного",
        "менее",
        "однажды",
        "однако",
        "меня",
        "нему",
        "меньше",
        "ней",
        "наверху",
        "него",
        "ниже",
        "мало",
        "надо",
        "один",
        "одиннадцать",
        "одиннадцатый",
        "назад",
        "наиболее",
        "недавно",
        "миллионов",
        "недалеко",
        "между",
        "низко",
        "меля",
        "нельзя",
        "нибудь",
        "непрерывно",
        "наконец",
        "никогда",
        "никуда",
        "нас",
        "наш",
        "нет",
        "нею",
        "неё",
        "них",
        "мира",
        "наша",
        "наше",
        "наши",
        "ничего",
        "начала",
        "нередко",
        "несколько",
        "обычно",
        "опять",
        "около",
        "мы",
        "ну",
        "нх",
        "от",
        "отовсюду",
        "особенно",
        "нужно",
        "очень",
        "отсюда",
        "в",
        "во",
        "вон",
        "вниз",
        "внизу",
        "вокруг",
        "вот",
        "восемнадцать",
        "восемнадцатый",
        "восемь",
        "восьмой",
        "вверх",
        "вам",
        "вами",
        "важное",
        "важная",
        "важные",
        "важный",
        "вдали",
        "везде",
        "ведь",
        "вас",
        "ваш",
        "ваша",
        "ваше",
        "ваши",
        "впрочем",
        "весь",
        "вдруг",
        "вы",
        "все",
        "второй",
        "всем",
        "всеми",
        "времени",
        "время",
        "всему",
        "всего",
        "всегда",
        "всех",
        "всею",
        "всю",
        "вся",
        "всё",
        "всюду",
        "г",
        "год",
        "говорил",
        "говорит",
        "года",
        "году",
        "где",
        "да",
        "ее",
        "за",
        "из",
        "ли",
        "же",
        "им",
        "до",
        "по",
        "ими",
        "под",
        "иногда",
        "довольно",
        "именно",
        "долго",
        "позже",
        "более",
        "должно",
        "пожалуйста",
        "значит",
        "иметь",
        "больше",
        "пока",
        "ему",
        "имя",
        "пор",
        "пора",
        "потом",
        "потому",
        "после",
        "почему",
        "почти",
        "посреди",
        "ей",
        "два",
        "две",
        "двенадцать",
        "двенадцатый",
        "двадцать",
        "двадцатый",
        "двух",
        "его",
        "дел",
        "или",
        "без",
        "день",
        "занят",
        "занята",
        "занято",
        "заняты",
        "действительно",
        "давно",
        "девятнадцать",
        "девятнадцатый",
        "девять",
        "девятый",
        "даже",
        "алло",
        "жизнь",
        "далеко",
        "близко",
        "здесь",
        "дальше",
        "для",
        "лет",
        "зато",
        "даром",
        "первый",
        "перед",
        "затем",
        "зачем",
        "лишь",
        "десять",
        "десятый",
        "ею",
        "её",
        "их",
        "бы",
        "еще",
        "при",
        "был",
        "про",
        "процентов",
        "против",
        "просто",
        "бывает",
        "бывь",
        "если",
        "люди",
        "была",
        "были",
        "было",
        "будем",
        "будет",
        "будете",
        "будешь",
        "прекрасно",
        "буду",
        "будь",
        "будто",
        "будут",
        "ещё",
        "пятнадцать",
        "пятнадцатый",
        "друго",
        "другое",
        "другой",
        "другие",
        "другая",
        "других",
        "есть",
        "пять",
        "быть",
        "лучше",
        "пятый",
        "к",
        "ком",
        "конечно",
        "кому",
        "кого",
        "когда",
        "которой",
        "которого",
        "которая",
        "которые",
        "который",
        "которых",
        "кем",
        "каждое",
        "каждая",
        "каждые",
        "каждый",
        "кажется",
        "как",
        "какой",
        "какая",
        "кто",
        "кроме",
        "куда",
        "кругом",
        "с",
        "т",
        "у",
        "я",
        "та",
        "те",
        "уж",
        "со",
        "то",
        "том",
        "снова",
        "тому",
        "совсем",
        "того",
        "тогда",
        "тоже",
        "собой",
        "тобой",
        "собою",
        "тобою",
        "сначала",
        "только",
        "уметь",
        "тот",
        "тою",
        "хорошо",
        "хотеть",
        "хочешь",
        "хоть",
        "хотя",
        "свое",
        "свои",
        "твой",
        "своей",
        "своего",
        "своих",
        "свою",
        "твоя",
        "твоё",
        "раз",
        "уже",
        "сам",
        "там",
        "тем",
        "чем",
        "сама",
        "сами",
        "теми",
        "само",
        "рано",
        "самом",
        "самому",
        "самой",
        "самого",
        "семнадцать",
        "семнадцатый",
        "самим",
        "самими",
        "самих",
        "саму",
        "семь",
        "чему",
        "раньше",
        "сейчас",
        "чего",
        "сегодня",
        "себе",
        "тебе",
        "сеаой",
        "человек",
        "разве",
        "теперь",
        "себя",
        "тебя",
        "седьмой",
        "спасибо",
        "слишком",
        "так",
        "такое",
        "такой",
        "такие",
        "также",
        "такая",
        "сих",
        "тех",
        "чаще",
        "четвертый",
        "через",
        "часто",
        "шестой",
        "шестнадцать",
        "шестнадцатый",
        "шесть",
        "четыре",
        "четырнадцать",
        "четырнадцатый",
        "сколько",
        "сказал",
        "сказала",
        "сказать",
        "ту",
        "ты",
        "три",
        "эта",
        "эти",
        "что",
        "это",
        "чтоб",
        "этом",
        "этому",
        "этой",
        "этого",
        "чтобы",
        "этот",
        "стал",
        "туда",
        "этим",
        "этими",
        "рядом",
        "тринадцать",
        "тринадцатый",
        "этих",
        "третий",
        "тут",
        "эту",
        "суть",
        "чуть",
        "тысяч"
    ]
};

},{}],15:[function(require,module,exports){
/**
 * Created by jan on 9-3-15.
 */
// Swedish stopwords
// http://www.ranks.nl/stopwords/swedish
// https://github.com/AlexGustafsson

module.exports = {
    stopwords: [
        "aderton",
        "adertonde",
        "adjö",
        "aldrig",
        "alla",
        "allas",
        "allt",
        "alltid",
        "alltså",
        "än",
        "andra",
        "andras",
        "annan",
        "annat",
        "ännu",
        "artonde",
        "artonn",
        "åtminstone",
        "att",
        "åtta",
        "åttio",
        "åttionde",
        "åttonde",
        "av",
        "även",
        "båda",
        "bådas",
        "bakom",
        "bara",
        "bäst",
        "bättre",
        "behöva",
        "behövas",
        "behövde",
        "behövt",
        "beslut",
        "beslutat",
        "beslutit",
        "bland",
        "blev",
        "bli",
        "blir",
        "blivit",
        "bort",
        "borta",
        "bra",
        "då",
        "dag",
        "dagar",
        "dagarna",
        "dagen",
        "där",
        "därför",
        "de",
        "del",
        "delen",
        "dem",
        "den",
        "deras",
        "dess",
        "det",
        "detta",
        "dig",
        "din",
        "dina",
        "dit",
        "ditt",
        "dock",
        "du",
        "efter",
        "eftersom",
        "elfte",
        "eller",
        "elva",
        "en",
        "enkel",
        "enkelt",
        "enkla",
        "enligt",
        "er",
        "era",
        "ert",
        "ett",
        "ettusen",
        "få",
        "fanns",
        "får",
        "fått",
        "fem",
        "femte",
        "femtio",
        "femtionde",
        "femton",
        "femtonde",
        "fick",
        "fin",
        "finnas",
        "finns",
        "fjärde",
        "fjorton",
        "fjortonde",
        "fler",
        "flera",
        "flesta",
        "följande",
        "för",
        "före",
        "förlåt",
        "förra",
        "första",
        "fram",
        "framför",
        "från",
        "fyra",
        "fyrtio",
        "fyrtionde",
        "gå",
        "gälla",
        "gäller",
        "gällt",
        "går",
        "gärna",
        "gått",
        "genast",
        "genom",
        "gick",
        "gjorde",
        "gjort",
        "god",
        "goda",
        "godare",
        "godast",
        "gör",
        "göra",
        "gott",
        "ha",
        "hade",
        "haft",
        "han",
        "hans",
        "har",
        "här",
        "heller",
        "hellre",
        "helst",
        "helt",
        "henne",
        "hennes",
        "hit",
        "hög",
        "höger",
        "högre",
        "högst",
        "hon",
        "honom",
        "hundra",
        "hundraen",
        "hundraett",
        "hur",
        "i",
        "ibland",
        "idag",
        "igår",
        "igen",
        "imorgon",
        "in",
        "inför",
        "inga",
        "ingen",
        "ingenting",
        "inget",
        "innan",
        "inne",
        "inom",
        "inte",
        "inuti",
        "ja",
        "jag",
        "jämfört",
        "kan",
        "kanske",
        "knappast",
        "kom",
        "komma",
        "kommer",
        "kommit",
        "kr",
        "kunde",
        "kunna",
        "kunnat",
        "kvar",
        "länge",
        "längre",
        "långsam",
        "långsammare",
        "långsammast",
        "långsamt",
        "längst",
        "långt",
        "lätt",
        "lättare",
        "lättast",
        "legat",
        "ligga",
        "ligger",
        "lika",
        "likställd",
        "likställda",
        "lilla",
        "lite",
        "liten",
        "litet",
        "man",
        "många",
        "måste",
        "med",
        "mellan",
        "men",
        "mer",
        "mera",
        "mest",
        "mig",
        "min",
        "mina",
        "mindre",
        "minst",
        "mitt",
        "mittemot",
        "möjlig",
        "möjligen",
        "möjligt",
        "möjligtvis",
        "mot",
        "mycket",
        "någon",
        "någonting",
        "något",
        "några",
        "när",
        "nästa",
        "ned",
        "nederst",
        "nedersta",
        "nedre",
        "nej",
        "ner",
        "ni",
        "nio",
        "nionde",
        "nittio",
        "nittionde",
        "nitton",
        "nittonde",
        "nödvändig",
        "nödvändiga",
        "nödvändigt",
        "nödvändigtvis",
        "nog",
        "noll",
        "nr",
        "nu",
        "nummer",
        "och",
        "också",
        "ofta",
        "oftast",
        "olika",
        "olikt",
        "om",
        "oss",
        "över",
        "övermorgon",
        "överst",
        "övre",
        "på",
        "rakt",
        "rätt",
        "redan",
        "redigera",
        "så",
        "sade",
        "säga",
        "säger",
        "sagt",
        "samma",
        "sämre",
        "sämst",
        "se",
        "sedan",
        "senare",
        "senast",
        "sent",
        "sex",
        "sextio",
        "sextionde",
        "sexton",
        "sextonde",
        "sig",
        "sin",
        "sina",
        "sist",
        "sista",
        "siste",
        "sitt",
        "sjätte",
        "sju",
        "sjunde",
        "sjuttio",
        "sjuttionde",
        "sjutton",
        "sjuttonde",
        "ska",
        "skall",
        "skulle",
        "slutligen",
        "små",
        "smått",
        "snart",
        "som",
        "stor",
        "stora",
        "större",
        "störst",
        "stort",
        "tack",
        "tidig",
        "tidigare",
        "tidigast",
        "tidigt",
        "till",
        "tills",
        "tillsammans",
        "tio",
        "tionde",
        "tjugo",
        "tjugoen",
        "tjugoett",
        "tjugonde",
        "tjugotre",
        "tjugotvå",
        "tjungo",
        "tolfte",
        "tolv",
        "tre",
        "tredje",
        "trettio",
        "trettionde",
        "tretton",
        "trettonde",
        "två",
        "tvåhundra",
        "under",
        "upp",
        "ur",
        "ursäkt",
        "ut",
        "utan",
        "utanför",
        "ute",
        "vad",
        "vänster",
        "vänstra",
        "vår",
        "vara",
        "våra",
        "varför",
        "varifrån",
        "varit",
        "varken",
        "värre",
        "varsågod",
        "vart",
        "vårt",
        "vem",
        "vems",
        "verkligen",
        "vi",
        "vid",
        "vidare",
        "viktig",
        "viktigare",
        "viktigast",
        "viktigt",
        "vilka",
        "vilken",
        "vilket",
        "vill",
        "är",
        "år",

        "även",
        "dessa",
        "wikitext",
        "wikipedia",
        "tyngre",
        "tung",
        "tyngst",
        "kall",
        "var",
        "minimum",
        "min",
        "max",
        "maximum",
        "ökning",
        "öka",
        "kallar",
        "hjälp",
        "använder",
        "betydligt",
        "sätt",
        "denna",
        "detta",
        "det",
        "hjälpa",
        "används",
        "består",
        "tränger",
        "igenom",
        "denna",
        "utöka",
        "utarmat",
        "ungefär",
        "sprids",
        "betydligt",
        "omgivande",
        "via",
        "huvudartikel",
        "exempel",
        "exempelvis",
        "vanligt",
        "per",
        "största",
        "stor",
        "ord",
        "ordet",
        "kallas",
        "påbörjad",
        "höra",
        "främst",
        "ihop",
        "antalet",
        "the",
        "uttryck",
        "uttrycket",
        "ändra",
        "presenteras",
        "presenterades",
        "tänka",
        "delar",
        "söka",
        "hämta",
        "innehåll",
        "definera",
        "använda",
        "pekar",
        "istället",
        "stället",
        "pekar",
        "standard",
        "vanligaste",
        "heter",
        "precist",
        "felaktigt",
        "källor",
        "höga",
        "mottagare",
        "eng",
        "bildade",
        "bytte",
        "bildades",
        "grundades",
        "svar",
        "betyder",
        "betydelse",
        "möjligheter",
        "möjlig",
        "möjlighet",
        "syfte",
        "gamla",
        "tioårig",
        "år",
        "övergångsperiod",
        "ersättas",
        "användes",
        "används",
        "utgörs",
        "drygt",
        "alla",
        "allt",
        "alltså",
        "andra",
        "att",
        "bara",
        "bli",
        "blir",
        "borde",
        "bra",
        "mitt",
        "ser",
        "dem",
        "den",
        "denna",
        "det",
        "detta",
        "dig",
        "din",
        "dock",
        "dom",
        "där",
        "edit",
        "efter",
        "eftersom",
        "eller",
        "ett",
        "fast",
        "fel",
        "fick",
        "finns",
        "fram",
        "från",
        "får",
        "fått",
        "för",
        "första",
        "genom",
        "ger",
        "går",
        "gör",
        "göra",
        "hade",
        "han",
        "har",
        "hela",
        "helt",
        "honom",
        "hur",
        "här",
        "iaf",
        "igen",
        "ingen",
        "inget",
        "inte",
        "jag",
        "kan",
        "kanske",
        "kommer",
        "lika",
        "lite",
        "man",
        "med",
        "men",
        "mer",
        "mig",
        "min",
        "mot",
        "mycket",
        "många",
        "måste",
        "nog",
        "när",
        "någon",
        "något",
        "några",
        "nån",
        "nåt",
        "och",
        "också",
        "rätt",
        "samma",
        "sedan",
        "sen",
        "sig",
        "sin",
        "själv",
        "ska",
        "skulle",
        "som",
        "sätt",
        "tar",
        "till",
        "tror",
        "tycker",
        "typ",
        "upp",
        "utan",
        "vad",
        "var",
        "vara",
        "vet",
        "vid",
        "vilket",
        "vill",
        "väl",
        "även",
        "över",
        "förekommer",
        "varierar",
        "representera",
        "representerar",
        "itu",
        "påbörjades",
        "le",
        "åtgärder",
        "åtgärd",
        "sådant",
        "särskilt",
        "eftersom",
        "som",
        "efter",
        "syftet",
        "syfte",
        "ersatts",
        "ersätts",
        "ersatt",
        "ersätt",
        "tagits",
        "byter",
        "benämningar",
        "ler",
        "ärvs",
        "ärv",
        "ärvd",
        "januari",
        "februari",
        "mars",
        "april",
        "maj",
        "juni",
        "juli",
        "augusti",
        "september",
        "oktober",
        "november",
        "december",
        "on",
        "övriga",
        "använts",
        "använd",
        "används",
        "använt",
        "syftar",
        "ex",
        "svårt",
        "svår",
        "lätt",
        "lätta",
        "lättast",
        "lättare",
        "svårare",
        "svårast",
        "list",
        "användningsområde",
        "användningsområden",
        "vissa",
        "ii",
        "hembyggda",
        "krav",
        "lugnt",
        "ändå",
        "stycken",
        "styck",
        "långa",
        "korta",
        "små",
        "stora",
        "smala",
        "tjocka",
        "början",
        "tungt",
        "lätt",
        "tim",
        "st",
        "kg",
        "km",
        "tid",
        "ny",
        "gammal",
        "nyare",
        "antal",
        "snabbare",
        "började",
        "ansvar",
        "ansvarar",
        "både",
        "ca",
        "låg",
        "hög",
        "ro",
        "ton",
        "kap",
        "of",
        "and",
        "vars",
        "kr/km",
        "rör",
        "gällande",
        "placeras",
        "placerades",
        "täckt",
        "samt",
        "hos",
        "sådana",
        "endast",
        "tillstånd",
        "beror",
        "på",
        "marken",
        "minska",
        "orsaker",
        "lösningar",
        "problem",
        "namn",
        "förväntas",
        "förväntan",
        "förväntats",
        "varning",
        "utfärdas",
        "utfärda",
        "km/h",
        "nådde",
        "stod",
        "området",
        "områden",
        "källa",
        "behövs",
        "drabbade",
        "drabbat",
        "which",
        "top",
        "that",
        "lägre",
        "allmänt",
        "drog",
        "drar",
        "enorma",
        "ända",
        "enda",
        "officiella",
        "bekräftats",
        "bekräftas",
        "fall",
        "sjunker",
        "nedåt",
        "värms",
        "samtidigt",
        "efterföljd",
        "problematik",
        "uppåt",
        "utom",
        "förutom",
        "hörnet",
        "söt",
        "salt",
        "svag",
        "stark",
        "ren",
        "smutsig",
        "förr",
        "tiden",
        "mångdag",
        "tisdag",
        "onsdag",
        "torsdag",
        "fredag",
        "lördag",
        "söndag",
        "måndagar",
        "tisdagar",
        "onsdagar",
        "torsdagar",
        "fredagar",
        "lördagar",
        "söndagar",
        "efterlikna",
        "som",
        "lik",
        "bergis",
        "bekymmer",
        "så",
        "lista",
        "dig",
        "dej",
        "mig",
        "mej",
        "fri",
        "vanlig",
        "ovanlig",
        "sällan",
        "ofta",
        "avskiljs",
        "use",
        "släkte",
        "släktet",
        "släkt",
        "kategori",
        "kategoriseras",
        "rensas",
        "renas",
        "timmar",
        "minuter",
        "sekunder"
    ]
};

},{}],16:[function(require,module,exports){
module.exports = {
	danish: require("./da").stopwords,
	dutch: require("./nl").stopwords,
	english: require("./en").stopwords,
	french: require("./fr").stopwords,
	galician: require("./gl").stopwords,
	german: require("./de").stopwords,
	italian: require("./it").stopwords,
	polish: require("./pl").stopwords,
	portuguese: require("./pt").stopwords,
	romanian: require("./ro").stopwords,
	russian: require("./ru").stopwords,
	spanish: require("./es").stopwords,
	swedish: require("./se").stopwords
};

},{"./da":3,"./de":4,"./en":5,"./es":6,"./fr":7,"./gl":8,"./it":9,"./nl":10,"./pl":11,"./pt":12,"./ro":13,"./ru":14,"./se":15}],17:[function(require,module,exports){
//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;
  _s.toBool   = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);

},{}],18:[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1]);
