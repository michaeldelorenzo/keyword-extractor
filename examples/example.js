var extractor = require("../lib/keyword_extractor");

var extraction_result = extractor.extract("President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."
,{
    language:"english",
    remove_digits: true,
    remove_duplicates: true,
    return_changed_case:true
});

console.log("Extract result (one language):")
console.log(extraction_result)

var extraction_multi_result = extractor.extract_multi_language("ذهب إلى المدرسة مع صديقي Ahmed",{
    languages:["arabic", "english"],
    return_common: true,
    remove_digits: true,
    remove_duplicates: true,
    return_changed_case:true
});
console.log("Extract result (multi language):")
console.log(extraction_multi_result)


