/**
 * Created by rodrigo on 18/11/15.
 */

var articles = [
  "a",
  "o",
  "as",
  "os",
  "um",
  "uma",
  "umas",
  "uns"
];

var trashTwitter = [
  "rt",
  "?"
];

var prepositions = [
  "a",
  "ante",
  "após",
  "até",
  "com",
  "conforme",
  "contra",
  "consoante",
  "de",
  "desde",
  "durante",
  "em",
  "excepto",
  "entre",
  "mediante",
  "para",
  "perante",
  "por",
  "segundo",
  "sob",
  "sobre",
  "trás"
];

var contractions = [
  "ao",
  "do",
  "no",
  "pelo",
  "à",
  "da",
  "na",
  "pela",
  "aos",
  "dos",
  "nos",
  "pelos",
  "às",
  "das",
  "nas",
  "pelas",
  "dum",
  "num",
  "duma",
  "numa",
  "duns",
  "nuns",
  "dumas",
  "numas"
];

var conjuntions = [
  "e",
  "mas também",
  "como também",
  "bem como",
  "mas",
  "porém",
  "todavia",
  "contudo",
  "entretanto",
  "no entanto",
  "ou",
  "ora",
  "quer",
  "já",
  "logo",
  "portanto",
  "por isso",
  "assim",
  "por conseguinte",
  "que",
  "porque",
  "porquanto",
  "pois",
  "uma vez que",
  "sendo que",
  "visto que",
  "como",
  "tal",
  "tão",
  "tanto",
  "sem que",
  "de modo que",
  "de forma que",
  "tal qual",
  "do que",
  "assim como",
  "conforme",
  "a fim de que",
  "para que",
  "quando",
  "enquanto",
  "sempre que",
  "logo que",
  "depois que"
];

var stopwords = conjuntions + articles + prepositions + trashTwitter + contractions;

module.exports = {
  stopwords: stopwords
};