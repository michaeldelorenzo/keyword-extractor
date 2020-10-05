import {ExtractionOptions, GetStopwordsOptions} from "./lib/keyword_extractor";

declare const keyword_extractor: {
  extract: (str: string, options?: ExtractionOptions) => string[];
  getStopwords: (options?: GetStopwordsOptions) => string[];
};

export default keyword_extractor;
