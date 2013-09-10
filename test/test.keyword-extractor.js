var extractor = require("../lib/keyword_extractor");
var should = require("should");

describe("extractor", function(){
    it("should respond to the 'extract' method", function(){
        extractor.should.have.property("extract");
    });
//    it("should throw an error if the language isn't supported", function(){
//        extractor.extract("  ", {language:"german"}).should.throw();
//    });

    it("should return an empty array for an empty string", function(){
       extractor.extract("   ").should.be.empty;
    });

    it("should return an emtpy array for a string that only contains stopwords", function(){
        extractor.extract("an associated behind",{language:"english"}).should.be.empty;
    });

    it("should return an array of 'keywords' for an English string", function(){
        var extraction_result = extractor.extract("President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency.",{
            language:"english",
            return_changed_case:true
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["president","obama","woke","monday","facing","congressional","defeat","parties","believed","hobble","presidency"]);
    });

    it("should return an array of 'keywords' for an English string without changing the case of the words", function(){
        var extraction_result = extractor.extract("President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency.",{
            return_changed_case:false,
            language:"english"
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["President","Obama","woke","Monday","facing","Congressional","defeat","parties","believed","hobble","presidency"]);
    });

    it("should return an array of 'keywords' for a Spanish string", function(){
        var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
            language:"spanish",
            return_changed_case:true
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["presidente","obama","despertó","lunes","enfrenta","a","derrota","del","congreso","que","ambas","partes","creyeron","podrían","entorpecer","presidencia"]);
    });

    it("should return an array of 'keywords' for a Spanish string", function(){
        var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
            language:"spanish",
            return_changed_case:false
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["Presidente","Obama","despertó","Lunes","enfrenta","a","derrota","del","Congreso","que","ambas","partes","creyeron","podrían","entorpecer","presidencia"]);
    });

});