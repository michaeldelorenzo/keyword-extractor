# Keyword Extractor

[![Tests Status](https://github.com/michaeldelorenzo/keyword-extractor/workflows/test/badge.svg)](https://github.com/michaeldelorenzo/keyword-extractor/actions)

A simple [NPM package](https://npmjs.org/package/keyword-extractor) for extracting _keywords_ from a string by
removing stopwords.

## Installation

```sh
$ npm install keyword-extractor
```

## Running tests

To run the test suite, first install the development dependencies by running the following command within the package's
directory.

```sh
$ npm install
```

To execute the package's tests, run:

``` sh
$ make test
```

## Usage of the Module

```javascript
//  include the Keyword Extractor
const keyword_extractor = require("keyword-extractor");

//  Opening sentence to NY Times Article at
/*
http://www.nytimes.com/2013/09/10/world/middleeast/
surprise-russian-proposal-catches-obama-between-putin-and-house-republicans.html
*/
const sentence =
"President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."

//  Extract the keywords
const extraction_result =
keyword_extractor.extract(sentence,{
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false

});

/*
  extraction result is:

  [
        "president",
        "obama",
        "woke",
        "monday",
        "facing",
        "congressional",
        "defeat",
        "parties",
        "believed",
        "hobble",
        "presidency"
    ]
*/
```

The module can also be imported with ES module syntax, e.g. in Next.js apps or other ESM-based projects:

```javascript
import keyword_extractor from "keyword-extractor";
// or, using named imports:
// import { extract, getStopwords, supported_language_codes } from "keyword-extractor";

const extraction_result = keyword_extractor.extract(sentence, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false
});
```

### TypeScript

This package ships its own type declarations, so no `@types` package is needed. Usage is the same, but with
`import`/typed options:

```typescript
import keyword_extractor from "keyword-extractor";

const sentence = "President Obama woke up Monday facing a Congressional defeat.";

const extraction_result: string[] = keyword_extractor.extract(sentence, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false
});
```

### Options Parameters

The second argument of the _extract_ method is an Object of configuration/processing settings for the extraction.

Parameter Name | Description | Permitted Values
---------------|-------------|-----------------
language       | The stopwords list to use. ISO 639-1 codes and verbose names | _ar_, _cs_, _da_, _de_, _en_, _es_, _fa_, _fr_, _gl_, _it_, _ko_, _nl_, _pl_, _pt_, _ro_, _ru_, _sv_, _tr_, _vi_, _arabic_, _czech_, _danish_, _dutch_, _english_, _french_, _galician_,_german_, _italian_, _korean_, _persian_, _polish_, _portuguese_, _romanian_, _russian_,_spanish_, _swedish_, _turkish_, _vietnam_
remove_digits | Removes all digits from the results if set to true (can handle Arabic and Perisan digits too) | _true_ or _false_
return_changed_case | The case of the extracted keywords. Setting the value to _true_ will return the results all lower-cased, if _false_ the results will be in the original case. | _true_ or _false_
return_chained_words | Instead of returning each word separately, join the words that were originally together. Setting the value to _true_ will join the words, if _false_ the results will be splitted on each array element. | _true_ or _false_
remove_duplicates | Removes the duplicate keywords | _true_ , _false_ (defaults to _false_ )
return_max_ngrams | Returns keywords that are ngrams with size 0-_integer_ | _integer_ , _false_ (defaults to _false_ )
stopwords_regex | Removes any word matching one of the given regular expressions, in addition to the language's stopwords list. Useful for filtering out patterns that aren't in a fixed word list, such as units (`10lbs`, `10Kg`), times (`6pm`), or ranges (`1-100`) | Array of `RegExp` (defaults to _[]_ )

Each pattern is tested against both the lowercased and original-case forms of a word, so patterns work
whether or not they include the `i` flag.

#### Removing words with `stopwords_regex`

```javascript
const extraction_result = keyword_extractor.extract("He weighed 10lbs at birth and grew to 10Kg, waking at 6pm daily.", {
    language: "english",
    stopwords_regex: [/^\d+[a-z]+$/i]
});

//  extraction_result is ["weighed", "birth", "grew", "waking", "daily"]
```


## Releases

This package is released to npm automatically using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).
Every merge to `main` is analyzed and, if it contains a releasable change, published under the appropriate version bump.

Versioning is driven entirely by commit messages (and, by extension, pull request titles — PRs are typically squash-merged,
so the PR title becomes the commit message on `main`). Pull request titles must follow the
[Conventional Commits](https://www.conventionalcommits.org/) specification and are checked automatically by CI:

```
<type>[optional scope]: <description>
```

Common types and the version bump they trigger:

Type       | Description                                | Release
-----------|---------------------------------------------|--------
`fix`, `perf`, `revert` | A bug fix, performance fix, or revert of a previous commit | Patch
`feat`     | A new feature                                | Minor
`refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore` | No user-facing change | None
Any type with a `BREAKING CHANGE:` footer or a `!` after the type/scope (e.g. `feat!:`) | Breaking API change | Major

Release notes for each version are published on the [GitHub Releases page](https://github.com/michaeldelorenzo/keyword-extractor/releases) —
there's no `CHANGELOG.md` committed to the repo, since `main` is a protected branch and the release automation can't push commits to it.

## Credits

The initial stopwords lists are taken from the following sources:

- English [http://www.ai.mit.edu/projects/jmlr/papers/volume5/lewis04a/a11-smart-stop-list/english.stop]
- Spanish [https://stop-words.googlecode.com/svn/trunk/stop-words/stop-words/stop-words-spanish.txt]
- Turkish [https://github.com/ahmetax/trstop]
