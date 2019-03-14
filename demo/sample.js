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
