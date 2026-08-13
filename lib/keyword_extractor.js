// ISO 639-1 codes of supported languages
const supported_language_codes = [
  "ar",
  "cs",
  "da",
  "de",
  "en",
  "es",
  "fa",
  "fr",
  "gl",
  "it",
  "ko",
  "nl",
  "pl",
  "pt",
  "ro",
  "ru",
  "sv",
  "tr",
  "vi"
];

const stopwords = require("./stopwords/stopwords");

function extract(
  str,
  options = {
    remove_digits: true,
    return_changed_case: true,
  }
) {
  //  clone into fresh RegExp instances (keeping the caller's original
  //  flags, including global/sticky) so testing many words can't mutate
  //  the caller's own regex objects. Validated before the `if (!str)`
  //  early return below, so a malformed entry fails loudly even for an
  //  empty/falsy str. The `options &&` guard only protects this early
  //  access — it doesn't make a null/non-object `options` valid for a
  //  non-empty str, which still fails the same way it always has,
  //  further down where the other options fields are read.
  const _stopwords_regex = ((options && options.stopwords_regex) || []).map((regex) => {
    if (!(regex instanceof RegExp)) {
      throw new Error("stopwords_regex must be an array of RegExp objects");
    }
    return new RegExp(regex.source, regex.flags);
  });

  if (!str) {
    return [];
  }

  const return_changed_case = options.return_changed_case;
  const return_chained_words = options.return_chained_words;
  const remove_digits = options.remove_digits;
  let _language = options.language || "en";
  const _remove_duplicates = options.remove_duplicates || false;
  const return_max_ngrams = options.return_max_ngrams;

  _language = sanitize_language(_language);

  //  strip any HTML and trim whitespace
  const text = str.replace(/(<([^>]+)>)/gi, "").trim();
  if (!text) {
    return [];
  } else {
    //  split on runs of whitespace, not each whitespace character, so that
    //  repeated spaces/tabs/newlines between words don't produce empty
    //  placeholders that would be mistaken for a real gap below
    const words = text.split(/\s+/);
    const unchanged_words = [];
    const low_words = [];
    const word_positions = [];
    //  change the case of all the words
    for (let x = 0; x < words.length; x++) {
      let w = words[x].match(/https?:\/\/.*[\r\n]*/g)
        ? words[x]
        : words[x].replace(/\.|,|;|!|\?|\(|\)|:|"|^'|'$|“|”|‘|’/g, "");
      //  remove periods, question marks, exclamation points, commas, and semi-colons
      //  if this is a short result, make sure it's not a single character or something 'odd'
      if (w.length === 1) {
        w = w.replace(/[_@&#·-]/g, "");
      }
      //  if it's a number, remove it
      const digits_match = w.match(/\d/g);
      if (remove_digits && digits_match && digits_match.length === w.length) {
        w = "";
      }
      if (w.length > 0) {
        low_words.push(w.toLowerCase());
        unchanged_words.push(w);
        //  track the word's position in the original text, since words
        //  dropped above (digits, stray punctuation) leave a gap that
        //  should still break a chain of "originally together" words
        word_positions.push(x);
      }
    }
    let results = [];
    const _stopwords =
      options.stopwords || getStopwords({ language: _language });
    //  reset lastIndex before every test so a global/sticky pattern's
    //  match position never leaks between words, or between the
    //  lowercased/original-case tests of the same word
    const matches_stopword_regex = (word) =>
      _stopwords_regex.some((regex) => {
        regex.lastIndex = 0;
        return regex.test(word);
      });
    let _last_result_word_index = -1;
    let _start_result_word_index = 0;
    let _unbroken_word_chain = false;
    for (let y = 0; y < low_words.length; y++) {
      const _is_stopword =
        _stopwords.indexOf(low_words[y]) >= 0 ||
        //  test both the lowercased and original-case forms so a
        //  case-sensitive pattern isn't limited to matching lowercase text
        matches_stopword_regex(low_words[y]) ||
        (low_words[y] !== unchanged_words[y] &&
          matches_stopword_regex(unchanged_words[y]));
      if (!_is_stopword) {
        const _is_adjacent =
          _last_result_word_index >= 0 &&
          word_positions[y] === word_positions[_last_result_word_index] + 1;

        if (!_is_adjacent) {
          _start_result_word_index = y;
          _unbroken_word_chain = false;
        } else {
          _unbroken_word_chain = true;
        }
        const result_word =
          return_changed_case &&
            !unchanged_words[y].match(/https?:\/\/.*[\r\n]*/g)
            ? low_words[y]
            : unchanged_words[y];

        if (
          return_max_ngrams &&
          _unbroken_word_chain &&
          !return_chained_words &&
          return_max_ngrams > y - _start_result_word_index &&
          _is_adjacent
        ) {
          const change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
          results[change_pos] = results[change_pos]
            ? results[change_pos] + " " + result_word
            : result_word;
        } else if (return_chained_words && _is_adjacent) {
          const change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
          results[change_pos] = results[change_pos]
            ? results[change_pos] + " " + result_word
            : result_word;
        } else {
          results.push(result_word);
        }

        _last_result_word_index = y;
      } else {
        _unbroken_word_chain = false;
      }
    }

    if (_remove_duplicates) {
      results = results.filter((v, i, a) => a.indexOf(v) === i);;
    }

    return results;
  }
}

function getStopwords(options) {
  options = options || {};

  let _language = options.language || "en";
  _language = sanitize_language(_language);

  return stopwords[_language];
}

// Sanitize requested language
function sanitize_language(requested_language) {
  const error_message = "Language must be one of [" +
    supported_language_codes.join(", ") + "]";

  if (typeof requested_language !== "string") {
    throw new Error(error_message);
  }

  // Fallback for old language option format
  const _requested_language = (requested_language.length === 2) ?
    requested_language :
    get_language_mapping(requested_language);

  if (supported_language_codes.indexOf(_requested_language) < 0) {
    throw new Error(error_message);
  }

  return _requested_language;
}

// Support old language option format by mapping to ISO 639-1 codes
function get_language_mapping(requested_language) {
  if (typeof requested_language !== "string") {
    return "";
  }

  const mapping = {
    arabic: "ar",
    czech: "cs",
    danish: "da",
    dutch: "nl",
    english: "en",
    french: "fr",
    galician: "gl",
    german: "de",
    italian: "it",
    korean: "ko",
    persian: "fa",
    polish: "pl",
    portuguese: "pt",
    romanian: "ro",
    russian: "ru",
    spanish: "es",
    swedish: "sv",
    turkish: "tr",
    vietnam: "vt"
  };

  return mapping[requested_language] || "";
}

module.exports = {
  getStopwords,
  extract,
  supported_language_codes
}
