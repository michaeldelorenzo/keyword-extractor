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

    it("should return an array of 'keywords', including 1 URL and 2 hash tags, for an English string", function(){
        var extraction_result = extractor.extract("Just published a @npmjs package to extract keywords from a string http://bit.ly/1edMNx6 #nodejs #npm",{
            language: "english",
            return_changed_case: true
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["published","@npmjs","package","extract","keywords","string","http://bit.ly/1edMNx6","#nodejs","#npm"]);
    });

    it("it should return an array of 'keywords', without things like parentheses and quotes, for a Tweet", function(){
        var extraction_result = extractor.extract('RT @joelgascoigne: \"Effective leaders (and brands) repeat themselves to the point where they can barely stand to hear themselves any mor ...',{
            language: "english",
            return_changed_case: true
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["rt","@joelgascoigne","effective","leaders","brands","repeat","point","barely","stand","hear","mor"]);
    });

    it("it should not include any numbers in the array of 'keywords'", function(){
        var extraction_result = extractor.extract("The Black Sox scandal of 1919 saw the lifetime ban of 8 members of the Chicago White Sox.",{
            language: "english",
            return_changed_case: true
        });
        extraction_result.should.not.be.empty;
        extraction_result.indexOf(1920).should.eql(-1);
        extraction_result.indexOf('1920').should.eql(-1);
        extraction_result.indexOf(8).should.eql(-1);
        extraction_result.indexOf('8').should.eql(-1);
    });

    it("it should remove any HTML and only return plain text in the 'keywords' array",function(){
        var extraction_result = extractor.extract("<p><a href='#' title='President Obama'>President Obama</a> <em>woke up</em> <span data-role='dow'>Monday</span> facing a <strong><u>Congressional</u> defeat</strong> that many in both parties believed could hobble his <a href='http://whitehouse.gov'>presidency</a></b>.</p>",{
            language:"english",
            return_changed_case:true
        });
        extraction_result.should.not.be.empty;
        extraction_result.should.eql(["president","obama","woke","monday","facing","congressional","defeat","parties","believed","hobble","presidency"]);
    });

    it("should return an array of stopwords from the getStopwords method", function(){
        extractor.getStopwords().should.not.be.empty;
        extractor.getStopwords({language:"english"}).should.not.be.empty;
    });
});