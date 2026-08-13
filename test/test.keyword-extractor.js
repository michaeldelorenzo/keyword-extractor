var extractor = require("../lib/keyword_extractor");
var should = require("should");

describe("extractor", function(){
    it("should respond to the 'extract' method", function(){
        extractor.should.have.property("extract");
    });

    it("should return an empty array for an empty string", function(){
        extractor.extract("   ").should.be.empty;
    });

    it("should return an empty array for an empty string even when options is explicitly null (does not reach stopwords_regex validation)", function(){
        extractor.extract("", null).should.be.empty;
    });

    describe("ISO 639-1 language code format", function(){
        it("should return an emtpy array for a string that only contains stopwords", function(){
            extractor.extract("an associated behind",{language:"en"}).should.be.empty;
        });

        it("should not chain 'keywords' separated by digits that get removed (regression #43)", function() {
          var extraction_result = extractor.extract("Linux 123 Foundation", {
              language:"en",
              remove_digits:true,
              return_chained_words:true
          });
          extraction_result.should.eql(["Linux","Foundation"]);
        });

        it("should not chain 'keywords' separated by a stray symbol that gets removed (regression #43)", function() {
          var extraction_result = extractor.extract("Linux & Foundation", {
              language:"en",
              return_chained_words:true
          });
          extraction_result.should.eql(["Linux","Foundation"]);
        });

        it("should still chain 'keywords' that are truly adjacent in the original text", function() {
          var extraction_result = extractor.extract("Linux Foundation", {
              language:"en",
              return_chained_words:true
          });
          extraction_result.should.eql(["Linux Foundation"]);
        });

        it("should still chain 'keywords' separated by repeated whitespace", function() {
          var extraction_result = extractor.extract("Linux   \t\n  Foundation", {
              language:"en",
              return_chained_words:true
          });
          extraction_result.should.eql(["Linux Foundation"]);
        });

        it("should return an array of 'keywords' for an English string", function(){
            var extraction_result = extractor.extract("President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency.",{
                language:"en",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["president","obama","woke","monday","facing","congressional","defeat","parties","believed","hobble","presidency"]);
        });

        it("should return an array of 'keywords' for an English string without changing the case of the words", function(){
            var extraction_result = extractor.extract("President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency.",{
                return_changed_case:false,
                language:"en"
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["President","Obama","woke","Monday","facing","Congressional","defeat","parties","believed","hobble","presidency"]);
        });

        it("should return an array of consecutive 'keywords' for a Spanish string", function() {
          var extraction_result = extractor.extract("Presidente Obama se despertó el lunes enfrentado a una derrota del Congreso que muchos en ambas partes creyeron que podría entorpecer su presidencia.", {
              language:"es",
              return_chained_words:true
          });
          extraction_result.should.not.be.empty;
          extraction_result.should.eql([
              'Presidente Obama',
              'despertó',
              'lunes enfrentado',
              'derrota',
              'Congreso',
              'ambas partes creyeron',
              'entorpecer',
              'presidencia'
          ]);
        });

        it("should return an array of chained 'keywords' with maximum length of 2 for a Spanish string", function() {
          var extraction_result = extractor.extract("Presidente Obama se despertó el lunes enfrentado a una derrota del Congreso que muchos en ambas partes creyeron que podría entorpecer su presidencia.", {
              language:"es",
              return_max_ngrams: 2
          });
          extraction_result.should.not.be.empty;
          extraction_result.should.eql([
              'Presidente Obama',
              'despertó',
              'lunes enfrentado',
              'derrota',
              'Congreso',
              'ambas partes',
              'creyeron',
              'entorpecer',
              'presidencia'
          ]);
        });

        it("should return an array of 'keywords' for a Spanish string", function(){
            var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
                language:"es",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","obama","despertó","lunes","enfrenta","derrota","congreso","ambas","partes","creyeron","entorpecer","presidencia"]);
        });

        it("should return an array of 'keywords' for a Spanish string", function(){
            var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
                language:"es",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Presidente","Obama","despertó","Lunes","enfrenta","derrota","Congreso","ambas","partes","creyeron","entorpecer","presidencia"]);
        });

        it("should return an array of 'keywords' for a German string", function(){
            var extraction_result = extractor.extract("Präsident Obama wachte Montag vor einer Niederlage im Kongress, dass viele in beiden Parteien angenommen, könnte seine Präsidentschaft humpeln",{
                language:"de",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["präsident", "obama","wachte","montag","niederlage","kongress","parteien","angenommen","präsidentschaft","humpeln"]);
        });

        it("should return an array of 'keywords' for a German string", function(){
            var extraction_result = extractor.extract("Präsident Obama wachte Montag vor einer Niederlage im Kongress, dass viele in beiden Parteien angenommen, könnte seine Präsidentschaft humpeln",{
                language:"de",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Präsident", "Obama","wachte","Montag","Niederlage","Kongress","Parteien","angenommen","Präsidentschaft","humpeln"]);
        });

        it("should return an array of 'keywords' for a French string", function(){
            var extraction_result = extractor.extract("Le président Obama se est réveillé lundi face à une défaite du Congrès que beaucoup dans les deux parties pensent qu'il pourrait entraver sa présidence.",{
                language:"fr",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["président", "obama","réveillé","lundi","face","défaite","congrès","parties","pensent","qu'il","pourrait","entraver","présidence"]);
        });

        it("should return an array of 'keywords' for a French string", function(){
            var extraction_result = extractor.extract("Le président Obama se est réveillé lundi face à une défaite du Congrès que beaucoup dans les deux parties pensent qu'il pourrait entraver sa présidence.",{
                language:"fr",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["président", "Obama","réveillé","lundi","face","défaite","Congrès","parties","pensent","qu'il","pourrait","entraver","présidence"]);
        });

        it("should return an array of 'keywords' for a Italian string", function(){
            var extraction_result = extractor.extract("Il presidente Obama si svegliò Lunedi di fronte a una sconfitta del Congresso che molti in entrambi i partiti credeva potessero ostacolare la sua presidenza.",{
                language:"it",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","obama","svegliò","lunedi","fronte","sconfitta","congresso","entrambi", "partiti","credeva","potessero", "ostacolare","presidenza"]);
        });

        it("should return an array of 'keywords' for a Italian string", function(){
            var extraction_result = extractor.extract("Il presidente Obama si svegliò Lunedi di fronte a una sconfitta del Congresso che molti in entrambi i partiti credeva potessero ostacolare la sua presidenza.",{
                language:"it",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","Obama","svegliò","Lunedi","fronte","sconfitta","Congresso","entrambi", "partiti","credeva","potessero", "ostacolare","presidenza"]);
        });

        it("should return an array of 'keywords' for a Dutch string", function(){
            var extraction_result = extractor.extract("President Obama wakker werd maandag geconfronteerd met een Congressional nederlaag dat velen in beide partijen van mening kon zijn presidentschap hinken.",{
                language:"nl",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["president","obama","wakker","werd","maandag","geconfronteerd","congressional","nederlaag","velen","partijen","mening","presidentschap","hinken"]);
        });

        it("should return an array of 'keywords' for a Dutch string", function(){
            var extraction_result = extractor.extract("President Obama wakker werd maandag geconfronteerd met een Congressional nederlaag dat velen in beide partijen van mening kon zijn presidentschap hinken.",{
                language:"nl",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["President","Obama","wakker","werd","maandag","geconfronteerd","Congressional","nederlaag","velen","partijen","mening","presidentschap","hinken"]);
        });

        it("should return an array of 'keywords' for a Romanian string string", function(){
            var extraction_result = extractor.extract("Google LLC este o corporație americană multinațională care administrează motorul de căutare pe Internet cu același nume.",{
                language:"ro",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["google", "llc", "corporație", "americană", "multinațională", "administrează", "motorul", "căutare", "internet", "același", "nume"]);
        });

        it("should return an array of 'keywords' for a Romanian string string", function(){
            var extraction_result = extractor.extract("Google LLC este o corporație americană multinațională care administrează motorul de căutare pe Internet cu același nume.",{
                language:"ro",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Google", "LLC", "corporație", "americană", "multinațională", "administrează", "motorul", "căutare", "Internet", "același", "nume"]);
        });

        it("should return an array of 'keywords' for a Russian string", function(){
            var extraction_result = extractor.extract("Президент Обама проснулся понедельник перед Конгрессом поражение, что многие в обе стороны мнению, могли бы ковылять его президентства.",{
                language:"ru",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["президент","обама", "проснулся", "понедельник", "конгрессом","поражение", "многие","обе", "стороны", "мнению", "могли","ковылять","президентства"]);
        });

        it("should return an array of 'keywords' for a Russian string", function(){
            var extraction_result = extractor.extract("Президент Обама проснулся понедельник перед Конгрессом поражение, что многие в обе стороны мнению, могли бы ковылять его президентства.",{
                language:"ru",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Президент","Обама", "проснулся", "понедельник", "Конгрессом","поражение", "многие","обе", "стороны", "мнению", "могли","ковылять","президентства"]);
        });

        it("should return an array of 'keywords' for a Portuguese string", function(){
          var extraction_result = extractor.extract("Presidente Obama acordou na segunda-feira diante de uma derrota no Congresso que muitos acreditavam, em ambos os partidos, poderiam prejudicar sua presidência.",{
            language:"pt",
            return_changed_case:true
          });

          extraction_result.should.not.be.empty;
          extraction_result.should.eql(["presidente", "obama", "acordou", "segunda-feira", "derrota", "congresso", "acreditavam", "ambos", "partidos", "poderiam", "prejudicar", "presidência"]);
        });

        it("should return an array of 'keywords' for a Portuguese string", function(){
          var extraction_result = extractor.extract("Presidente Obama acordou na segunda-feira diante de uma derrota no Congresso que muitos acreditavam, em ambos os partidos, poderiam prejudicar sua presidência.",{
            language:"pt",
            return_changed_case:false
          });

          extraction_result.should.not.be.empty;
          extraction_result.should.eql(["Presidente", "Obama", "acordou", "segunda-feira", "derrota", "Congresso", "acreditavam", "ambos", "partidos", "poderiam", "prejudicar", "presidência"]);
        });

        it("should return an array of 'keywords' for a Swedish string", function(){
            var extraction_result = extractor.extract("President Obama vaknade upp under måndagen inför ett nederlag i kongressen som många i båda partier trodde kunde stappla hans ordförandeskap.",{
                language:"sv",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["President", "Obama", "vaknade", "måndagen", "nederlag", "kongressen", "partier", "trodde", "stappla", "ordförandeskap"]);
        });

        it("should return an array of 'keywords' for a Danish string", function(){
            var extraction_result = extractor.extract("Præsident Obama vågnede op om mandagen over for et kongres nederlag, som mange i begge partier mente kunne halte hans præsidentperiode.",{
                language:"da",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Præsident", "Obama", "vågnede", "mandagen", "kongres", "nederlag", "partier", "mente", "halte", "præsidentperiode"]);
        });

        it("should return an array of 'keywords', including 1 URL and 2 hash tags, for an English string", function(){
            var extraction_result = extractor.extract("Just published a @npmjs package to extract keywords from a string http://bit.ly/1edMNx6 #nodejs #npm",{
                language: "en",
                return_changed_case: true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["published","@npmjs","package","extract","keywords","string","http://bit.ly/1edMNx6","#nodejs","#npm"]);
        });

        it("it should return an array of 'keywords', without things like parentheses and quotes, for a Tweet", function(){
            var extraction_result = extractor.extract('RT @joelgascoigne: \"Effective leaders (and brands) repeat themselves to the point where they can barely stand to hear themselves any mor ...',{
                language: "en",
                return_changed_case: true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["rt","@joelgascoigne","effective","leaders","brands","repeat","point","barely","stand","hear","mor"]);
        });

        it("should not include lone bullet symbols or hyphens as 'keywords'", function(){
            var extraction_result = extractor.extract("· Improve documentation - Fix packaging bug",{
                language: "en",
                return_changed_case: true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["improve","documentation","fix","packaging","bug"]);
        });

        it("it should not include any numbers in the array of 'keywords'", function(){
            var extraction_result = extractor.extract("The Black Sox scandal of 1920 saw the lifetime ban of 8 members of the Chicago White Sox.",{
                language: "en",
                remove_digits: true,
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
                language:"en",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["president","obama","woke","monday","facing","congressional","defeat","parties","believed","hobble","presidency"]);
        });

        it("should return an array of stopwords from the getStopwords method", function(){
            extractor.getStopwords().should.not.be.empty;
            extractor.getStopwords({language:"english"}).should.not.be.empty;
        });

        describe("stopwords_regex option (#69)", function(){
            it("should remove words matching a unit-suffixed number pattern (e.g. '10lbs', '10Kg', '6pm')", function(){
                var extraction_result = extractor.extract("He weighed 10lbs at birth and grew to 10Kg, waking at 6pm daily.", {
                    language: "en",
                    remove_digits: false,
                    stopwords_regex: [/^\d+[a-z]+$/i]
                });
                extraction_result.should.eql(["weighed","birth","grew","waking","daily"]);
            });

            it("should remove words matching a numeric-range pattern (e.g. '1-100')", function(){
                var extraction_result = extractor.extract("Choose a number between 1-100 to win.", {
                    language: "en",
                    return_changed_case: true,
                    stopwords_regex: [/^\d+-\d+$/]
                });
                extraction_result.should.eql(["choose","number","win"]);
            });

            it("should support multiple regexes at once", function(){
                var extraction_result = extractor.extract("He weighed 10lbs and picked a number between 1-100.", {
                    language: "en",
                    return_changed_case: true,
                    stopwords_regex: [/^\d+[a-z]+$/i, /^\d+-\d+$/]
                });
                extraction_result.should.eql(["weighed","picked","number"]);
            });

            it("should not remove anything when stopwords_regex is omitted (no regression)", function(){
                var extraction_result = extractor.extract("He weighed 10lbs at birth.", {
                    language: "en",
                    remove_digits: false
                });
                extraction_result.should.eql(["weighed","10lbs","birth"]);
            });

            it("should not remove anything when stopwords_regex matches nothing", function(){
                var extraction_result = extractor.extract("President Obama woke up Monday.", {
                    language: "en",
                    return_changed_case: true,
                    stopwords_regex: [/^\d+[a-z]+$/i]
                });
                extraction_result.should.eql(["president","obama","woke","monday"]);
            });

            it("should still chain adjacent 'keywords' separated by a regex-removed word (regression #43 style)", function(){
                var extraction_result = extractor.extract("Linux 10lbs Foundation", {
                    language: "en",
                    return_chained_words: true,
                    stopwords_regex: [/^\d+[a-z]+$/i]
                });
                extraction_result.should.eql(["Linux","Foundation"]);
            });

            it("should compose correctly with remove_duplicates", function(){
                var extraction_result = extractor.extract("10lbs 10lbs weighed weighed", {
                    language: "en",
                    stopwords_regex: [/^\d+[a-z]+$/i],
                    remove_duplicates: true
                });
                extraction_result.should.eql(["weighed"]);
            });

            it("should not carry lastIndex state between words for a global regex (stateful regex safety)", function(){
                var extraction_result = extractor.extract("10lbs 10kg weighed", {
                    language: "en",
                    stopwords_regex: [/^\d+[a-z]+$/gi]
                });
                extraction_result.should.eql(["weighed"]);
            });

            it("should not mutate a caller-supplied global regex's lastIndex", function(){
                var shared_regex = /^\d+[a-z]+$/gi;
                shared_regex.lastIndex = 3;
                extractor.extract("10lbs 10kg weighed", {
                    language: "en",
                    stopwords_regex: [shared_regex]
                });
                shared_regex.lastIndex.should.eql(3);
            });

            it("should not mutate a caller-supplied sticky regex's lastIndex", function(){
                var shared_regex = /^\d+[a-z]+$/y;
                shared_regex.lastIndex = 3;
                extractor.extract("10lbs 10kg weighed", {
                    language: "en",
                    stopwords_regex: [shared_regex]
                });
                shared_regex.lastIndex.should.eql(3);
            });

            it("should preserve sticky-flag anchoring instead of turning it into an unanchored search", function(){
                var extraction_result = extractor.extract("foobar bar", {
                    language: "en",
                    stopwords_regex: [/bar/y]
                });
                //  sticky /bar/y only matches when "bar" starts at position 0,
                //  so "foobar" must be kept while the standalone "bar" is removed
                extraction_result.should.eql(["foobar"]);
            });

            it("should match a case-sensitive pattern against the original-case word, not just the lowercased form", function(){
                var extraction_result = extractor.extract("The ABC123 unit failed but xyz456 passed.", {
                    language: "en",
                    stopwords_regex: [/^[A-Z]+\d+$/]
                });
                //  "ABC123" is removed (matches the original-case pattern), "xyz456" is kept
                //  ("the"/"but" are removed as ordinary English stopwords, unrelated to the regex)
                extraction_result.should.eql(["unit","failed","xyz456","passed"]);
            });

            it("should throw a clear error when stopwords_regex contains a non-RegExp entry", function(){
                (function(){
                    extractor.extract("10lbs weighed", {
                        language: "en",
                        stopwords_regex: ["not-a-regex"]
                    });
                }).should.throw("stopwords_regex must be an array of RegExp objects");
            });

            it("should throw a clear error when stopwords_regex is a single RegExp instead of an array", function(){
                (function(){
                    extractor.extract("10lbs weighed", {
                        language: "en",
                        stopwords_regex: /^\d+[a-z]+$/i
                    });
                }).should.throw("stopwords_regex must be an array of RegExp objects");
            });

            it("should treat any falsy stopwords_regex value the same as omitting it", function(){
                [null, false, 0, ""].forEach(function(falsy_value){
                    var extraction_result = extractor.extract("10lbs weighed", {
                        language: "en",
                        stopwords_regex: falsy_value
                    });
                    extraction_result.should.eql(["10lbs","weighed"]);
                });
            });

            it("should throw the same error for a non-RegExp entry even when the input trims to empty text", function(){
                (function(){
                    extractor.extract("   ", {
                        language: "en",
                        stopwords_regex: ["not-a-regex"]
                    });
                }).should.throw("stopwords_regex must be an array of RegExp objects");
            });

            it("should throw the same error for a non-RegExp entry even when str is empty", function(){
                (function(){
                    extractor.extract("", {
                        language: "en",
                        stopwords_regex: ["not-a-regex"]
                    });
                }).should.throw("stopwords_regex must be an array of RegExp objects");
            });
        });

        it("should return an array of 'keywords' for a Turkish string", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"tr",
                return_changed_case:true
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'türk',              'dil',
                'dilli',             'dil',
                'dilin',             'dillerin',
                'kurumunun',         'kurumunun',
                '1945ten',           'yayımlanan',
                'türkçe',            'sözlükünün',
                '2011',              'yılında',
                '11',                'baskısının',
                'gözden',            'geçirilip',
                'güncellenmiş',      'genel',
                'ağdan',             'sunulan',
                'sürümüdür',         'türkçe',
                'sözlük',            'dilimizde',
                'yaşanan',           'gelişmelere',
                'bağlı',             'sürekli',
                'güncellenmektedir'
            ]);
        });

        it("should return an array of 'keywords' for a Turkish string without changing the case of the words", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"tr",
                return_changed_case:false,
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'Türk',              'Dil',
                'dilli',             'dil',
                'dilin',             'dillerin',
                'Kurumunun',         'kurumunun',
                '1945ten',           'yayımlanan',
                'Türkçe',            'Sözlükünün',
                '2011',              'yılında',
                '11',                'baskısının',
                'gözden',            'geçirilip',
                'güncellenmiş',      'genel',
                'ağdan',             'sunulan',
                'sürümüdür',         'Türkçe',
                'Sözlük',            'dilimizde',
                'yaşanan',           'gelişmelere',
                'bağlı',             'sürekli',
                'güncellenmektedir'
            ]);
        });

        it("should return an array of 'keywords' for a Turkish string with remove duplicates changing the case of the words", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"tr",
                return_changed_case:true,
                remove_duplicates: true,
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'türk',         'dil',
                'dilli',        'dilin',
                'dillerin',     'kurumunun',
                '1945ten',      'yayımlanan',
                'türkçe',       'sözlükünün',
                '2011',         'yılında',
                '11',           'baskısının',
                'gözden',       'geçirilip',
                'güncellenmiş', 'genel',
                'ağdan',        'sunulan',
                'sürümüdür',    'sözlük',
                'dilimizde',    'yaşanan',
                'gelişmelere',  'bağlı',
                'sürekli',      'güncellenmektedir'
            ]);
        });
    });

    describe("old language format", function(){
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

        it("should return an array of consecutive 'keywords' for a Spanish string", function() {
          var extraction_result = extractor.extract("Presidente Obama se despertó el lunes enfrentado a una derrota del Congreso que muchos en ambas partes creyeron que podría entorpecer su presidencia.", {
              language:"spanish",
              return_chained_words:true
          });
          extraction_result.should.not.be.empty;
          extraction_result.should.eql([
              'Presidente Obama',
              'despertó',
              'lunes enfrentado',
              'derrota',
              'Congreso',
              'ambas partes creyeron',
              'entorpecer',
              'presidencia'
          ]);
        });

        it("should return an array of chained 'keywords' with maximum length of 2 for a Spanish string", function() {
          var extraction_result = extractor.extract("Presidente Obama se despertó el lunes enfrentado a una derrota del Congreso que muchos en ambas partes creyeron que podría entorpecer su presidencia.", {
              language:"spanish",
              return_max_ngrams: 2
          });
          extraction_result.should.not.be.empty;
          extraction_result.should.eql([
              'Presidente Obama',
              'despertó',
              'lunes enfrentado',
              'derrota',
              'Congreso',
              'ambas partes',
              'creyeron',
              'entorpecer',
              'presidencia'
          ]);
        });

        it("should return an array of 'keywords' for a Spanish string", function(){
            var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
                language:"spanish",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","obama","despertó","lunes","enfrenta","derrota","congreso","ambas","partes","creyeron","entorpecer","presidencia"]);
        });

        it("should return an array of 'keywords' for a Spanish string", function(){
            var extraction_result = extractor.extract("Presidente Obama despertó Lunes enfrenta a una derrota del Congreso que muchos en ambas partes creyeron podrían entorpecer su presidencia.",{
                language:"spanish",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Presidente","Obama","despertó","Lunes","enfrenta","derrota","Congreso","ambas","partes","creyeron","entorpecer","presidencia"]);
        });

        it("should return an array of 'keywords' for a German string", function(){
            var extraction_result = extractor.extract("Präsident Obama wachte Montag vor einer Niederlage im Kongress, dass viele in beiden Parteien angenommen, könnte seine Präsidentschaft humpeln",{
                language:"german",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["präsident", "obama","wachte","montag","niederlage","kongress","parteien","angenommen","präsidentschaft","humpeln"]);
        });

        it("should return an array of 'keywords' for a German string", function(){
            var extraction_result = extractor.extract("Präsident Obama wachte Montag vor einer Niederlage im Kongress, dass viele in beiden Parteien angenommen, könnte seine Präsidentschaft humpeln",{
                language:"german",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Präsident", "Obama","wachte","Montag","Niederlage","Kongress","Parteien","angenommen","Präsidentschaft","humpeln"]);
        });

        it("should return an array of 'keywords' for a French string", function(){
            var extraction_result = extractor.extract("Le président Obama se est réveillé lundi face à une défaite du Congrès que beaucoup dans les deux parties pensent qu'il pourrait entraver sa présidence.",{
                language:"french",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["président", "obama","réveillé","lundi","face","défaite","congrès","parties","pensent","qu'il","pourrait","entraver","présidence"]);
        });

        it("should return an array of 'keywords' for a French string", function(){
            var extraction_result = extractor.extract("Le président Obama se est réveillé lundi face à une défaite du Congrès que beaucoup dans les deux parties pensent qu'il pourrait entraver sa présidence.",{
                language:"french",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["président", "Obama","réveillé","lundi","face","défaite","Congrès","parties","pensent","qu'il","pourrait","entraver","présidence"]);
        });

        it("should return an array of 'keywords' for a Italian string", function(){
            var extraction_result = extractor.extract("Il presidente Obama si svegliò Lunedi di fronte a una sconfitta del Congresso che molti in entrambi i partiti credeva potessero ostacolare la sua presidenza.",{
                language:"italian",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","obama","svegliò","lunedi","fronte","sconfitta","congresso","entrambi", "partiti","credeva","potessero", "ostacolare","presidenza"]);
        });

        it("should return an array of 'keywords' for a Italian string", function(){
            var extraction_result = extractor.extract("Il presidente Obama si svegliò Lunedi di fronte a una sconfitta del Congresso che molti in entrambi i partiti credeva potessero ostacolare la sua presidenza.",{
                language:"italian",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["presidente","Obama","svegliò","Lunedi","fronte","sconfitta","Congresso","entrambi", "partiti","credeva","potessero", "ostacolare","presidenza"]);
        });

        it("should return an array of 'keywords' for a Dutch string", function(){
            var extraction_result = extractor.extract("President Obama wakker werd maandag geconfronteerd met een Congressional nederlaag dat velen in beide partijen van mening kon zijn presidentschap hinken.",{
                language:"dutch",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["president","obama","wakker","werd","maandag","geconfronteerd","congressional","nederlaag","velen","partijen","mening","presidentschap","hinken"]);
        });

        it("should return an array of 'keywords' for a Dutch string", function(){
            var extraction_result = extractor.extract("President Obama wakker werd maandag geconfronteerd met een Congressional nederlaag dat velen in beide partijen van mening kon zijn presidentschap hinken.",{
                language:"dutch",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["President","Obama","wakker","werd","maandag","geconfronteerd","Congressional","nederlaag","velen","partijen","mening","presidentschap","hinken"]);
        });

        it("should return an array of 'keywords' for a Romanian string string", function(){
            var extraction_result = extractor.extract("Google LLC este o corporație americană multinațională care administrează motorul de căutare pe Internet cu același nume.",{
                language:"romanian",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["google", "llc", "corporație", "americană", "multinațională", "administrează", "motorul", "căutare", "internet", "același", "nume"]);
        });

        it("should return an array of 'keywords' for a Romanian string string", function(){
            var extraction_result = extractor.extract("Google LLC este o corporație americană multinațională care administrează motorul de căutare pe Internet cu același nume.",{
                language:"romanian",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Google", "LLC", "corporație", "americană", "multinațională", "administrează", "motorul", "căutare", "Internet", "același", "nume"]);
        });

        it("should return an array of 'keywords' for a Russian string", function(){
            var extraction_result = extractor.extract("Президент Обама проснулся понедельник перед Конгрессом поражение, что многие в обе стороны мнению, могли бы ковылять его президентства.",{
                language:"russian",
                return_changed_case:true
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["президент","обама", "проснулся", "понедельник", "конгрессом","поражение", "многие","обе", "стороны", "мнению", "могли","ковылять","президентства"]);
        });

        it("should return an array of 'keywords' for a Russian string", function(){
            var extraction_result = extractor.extract("Президент Обама проснулся понедельник перед Конгрессом поражение, что многие в обе стороны мнению, могли бы ковылять его президентства.",{
                language:"russian",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Президент","Обама", "проснулся", "понедельник", "Конгрессом","поражение", "многие","обе", "стороны", "мнению", "могли","ковылять","президентства"]);
        });

        it("should return an array of 'keywords' for a Portuguese string", function(){
          var extraction_result = extractor.extract("Presidente Obama acordou na segunda-feira diante de uma derrota no Congresso que muitos acreditavam, em ambos os partidos, poderiam prejudicar sua presidência.",{
            language:"portuguese",
            return_changed_case:true
          });

          extraction_result.should.not.be.empty;
          extraction_result.should.eql(["presidente", "obama", "acordou", "segunda-feira", "derrota", "congresso", "acreditavam", "ambos", "partidos", "poderiam", "prejudicar", "presidência"]);
        });

        it("should return an array of 'keywords' for a Portuguese string", function(){
          var extraction_result = extractor.extract("Presidente Obama acordou na segunda-feira diante de uma derrota no Congresso que muitos acreditavam, em ambos os partidos, poderiam prejudicar sua presidência.",{
            language:"portuguese",
            return_changed_case:false
          });

          extraction_result.should.not.be.empty;
          extraction_result.should.eql(["Presidente", "Obama", "acordou", "segunda-feira", "derrota", "Congresso", "acreditavam", "ambos", "partidos", "poderiam", "prejudicar", "presidência"]);
        });

        it("should return an array of 'keywords' for a Swedish string", function(){
            var extraction_result = extractor.extract("President Obama vaknade upp under måndagen inför ett nederlag i kongressen som många i båda partier trodde kunde stappla hans ordförandeskap.",{
                language:"swedish",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["President", "Obama", "vaknade", "måndagen", "nederlag", "kongressen", "partier", "trodde", "stappla", "ordförandeskap"]);
        });

        it("should return an array of 'keywords' for a Danish string", function(){
            var extraction_result = extractor.extract("Præsident Obama vågnede op om mandagen over for et kongres nederlag, som mange i begge partier mente kunne halte hans præsidentperiode.",{
                language:"danish",
                return_changed_case:false
            });
            extraction_result.should.not.be.empty;
            extraction_result.should.eql(["Præsident", "Obama", "vågnede", "mandagen", "kongres", "nederlag", "partier", "mente", "halte", "præsidentperiode"]);
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
            var extraction_result = extractor.extract("The Black Sox scandal of 1920 saw the lifetime ban of 8 members of the Chicago White Sox.",{
                language: "english",
                remove_digits: true,
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

        it("should return an array of 'keywords' for a Turkish string", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"turkish",
                return_changed_case:true
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'türk',              'dil',
                'dilli',             'dil',
                'dilin',             'dillerin',
                'kurumunun',         'kurumunun',
                '1945ten',           'yayımlanan',
                'türkçe',            'sözlükünün',
                '2011',              'yılında',
                '11',                'baskısının',
                'gözden',            'geçirilip',
                'güncellenmiş',      'genel',
                'ağdan',             'sunulan',
                'sürümüdür',         'türkçe',
                'sözlük',            'dilimizde',
                'yaşanan',           'gelişmelere',
                'bağlı',             'sürekli',
                'güncellenmektedir'
            ]);
        });

        it("should return an array of 'keywords' for a Turkish string without changing the case of the words", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"turkish",
                return_changed_case:false,
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'Türk',              'Dil',
                'dilli',             'dil',
                'dilin',             'dillerin',
                'Kurumunun',         'kurumunun',
                '1945ten',           'yayımlanan',
                'Türkçe',            'Sözlükünün',
                '2011',              'yılında',
                '11',                'baskısının',
                'gözden',            'geçirilip',
                'güncellenmiş',      'genel',
                'ağdan',             'sunulan',
                'sürümüdür',         'Türkçe',
                'Sözlük',            'dilimizde',
                'yaşanan',           'gelişmelere',
                'bağlı',             'sürekli',
                'güncellenmektedir'
            ]);
        });

        it("should return an array of 'keywords' for a Turkish string with remove duplicates changing the case of the words", function(){
            var extraction_result = extractor.extract("Türk Dil dilli dil dilin dillerin Kurumunun kurumunun 1945’ten beri yayımlanan Türkçe Sözlük’ünün 2011 yılında yapılan 11. baskısının gözden geçirilip güncellenmiş olarak genel ağdan sunulan sürümüdür. Türkçe Sözlük dilimizde yaşanan gelişmelere bağlı olarak sürekli güncellenmektedir.",{
                language:"turkish",
                return_changed_case:true,
                remove_duplicates: true,
            });

            extraction_result.should.not.be.empty;
            extraction_result.should.eql([
                'türk',         'dil',
                'dilli',        'dilin',
                'dillerin',     'kurumunun',
                '1945ten',      'yayımlanan',
                'türkçe',       'sözlükünün',
                '2011',         'yılında',
                '11',           'baskısının',
                'gözden',       'geçirilip',
                'güncellenmiş', 'genel',
                'ağdan',        'sunulan',
                'sürümüdür',    'sözlük',
                'dilimizde',    'yaşanan',
                'gelişmelere',  'bağlı',
                'sürekli',      'güncellenmektedir'
            ]);
        });
    });
});
