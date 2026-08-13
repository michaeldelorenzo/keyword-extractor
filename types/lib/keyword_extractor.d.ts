
type LanguageName = "danish"|"dutch"|"english"|"french"|"galician"|"german"|"italian"|"polish"|"portuguese"|"romanian"|"russian"|"spanish"|"swedish"|"ar"|"cs"|"da"|"de"|"en"|"es"|"fa"|"fr"|"gl"|"it"|"ko"|"nl"|"pl"|"pt"|"ro"|"ru"|"sv"|"tr"|"vi";
type GetStopwordsOptions = {language?: LanguageName};
type ExtractionOptions = {
  remove_digits?: boolean;
  return_changed_case?: boolean;
  return_chained_words?: boolean;
  remove_duplicates?: boolean;
  return_max_ngrams?: number | false;
  stopwords?: string[];
  stopwords_regex?: RegExp[];
} & GetStopwordsOptions;

/** Provides the list of supported ISO 639-1 language codes */
export declare const supported_language_codes: string[];
