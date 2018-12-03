# Mdn-docs-search
 [![Downloads](https://img.shields.io/npm/dt/mdn-docs-search.svg?maxAge=3600)](https://www.npmjs.com/package/mdn-docs-search)
 [![Version](https://img.shields.io/npm/v/mdn-docs-search.svg?maxAge=3600)](https://www.npmjs.com/package/mdn-docs-search)
 [![Build Status](https://travis-ci.org/waspothegreat/mdn-docs-search.svg?branch=master)](https://travis-ci.org/waspothegreat/mdn-docs-search)

A small package made to search the mdn docs

# Usage

Example:
```js
const MDNDocs = require('mdn-docs-search');

// Create an async function for resolving the result
async function searchDocs() {
  const result = await MDNDocs.search('Map.prototype.delete'); // Search the docs
  const docs = await MDNDocs.load(result); // Load the url from searching the docs
  return docs.name; // get the name
}

await searchDocs(); // Use the function
```

# Properties

* **name** - Name of the page
* **description** - Description of the page, markdown support included
* **url** - Url of the page
* **examples** - Examples box of the page, if any
* **syntax** - Syntax box of the page, if any
* **params** - Parameters of the page, parameters sorted and markdown support included
* **pageDescription** - `Description` section of the page, if any, markdown support included
* **methods** - Methods for the page, if any
* **returnValue** - Return value for the page, if any

# Contributing

If you want to contribute with anything please open a pull request
