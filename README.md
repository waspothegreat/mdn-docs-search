# mdn-docs-search
A small package made to search the mdn docs

# Usage

Example:
```js
const MDNDocs = require('mdn-docs-search');

// Create an async function for resolving the result
async function searchDocs() {
  const result = await MDNDocs.search('Map.prototype.delete');
  await MDNDocs.load(result).then(r => r.name); // get the name
}

searchDocs();
```

# Properties

* **name** - Name of the page
* **description** - Description of the page, hyperlink support included
* **url** - Url of the page
* **params** - Parameters of the page, parameters sorted and hyperlink support included
* **methods** - Methods for the page, if any
* **returnValue** - Return value for the page, if any

# Contributing

If you want to contribute with anything please open a pull request
