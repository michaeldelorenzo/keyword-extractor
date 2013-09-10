var supported_languages = ["english","spanish"];
var stopwords = require("./stopwords/stopwords");

function _extract(str, options){
    if(!options){
        options = {return_changed_case: true};
    }
    var return_changed_case = options.return_changed_case;
    var _language = options.language || "english";
    if(supported_languages.indexOf(_language) < 0){
        throw new Error("Language must be one of ["+supported_languages.join(",")+"]");
    }

    //  trim whitespace
    var text = str.replace(/^\s+|\s+$/g, '');
    if(!text){
        return [];
    }else{
        var words = text.split(/\s/);
        var unchanged_words = [];
        var low_words = [];
        //  change the case of all the words
        for(var x = 0;x < words.length; x++){
            var w = words[x].match(/https?:\/\/.*[\r\n]*/g) ? words[x] : words[x].replace(/\.|,|;|!|\?/g,'');    //  remove periods, question marks, exclamation points, commas, and semi-colons
            low_words.push(w.toLowerCase());
            unchanged_words.push(w);
        }
        var results = [];
        var _stopwords = stopwords[_language];
        for(var y = 0; y < low_words.length; y++){
            if(_stopwords.indexOf(low_words[y]) < 0){
                var result_word = return_changed_case && !unchanged_words[y].match(/https?:\/\/.*[\r\n]*/g) ? low_words[y] : unchanged_words[y];
                results.push(result_word);
            }
        }
        return results;
    }
}

module.exports = {
    extract:_extract
};