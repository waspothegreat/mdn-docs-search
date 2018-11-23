const request = require("node-superfetch");
const cheerio = require("cheerio");
const Turndown = require('turndown');
const turndown = new Turndown();
turndown.addRule("hyperlink", {
    filter: "a",
    replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
});

class MDNDocs {

    static async search(query = null) {
        if (!query) return "No query specified.";        
        const $ = cheerio.load((await request.get(`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}&topic=js`)).text);
        let resText = $("div[class=\"search-pane search-results-explanation\"]");
        resText = resText.children("p").text().split("\n").map(t => t.trim()).filter(t => t !== "").join("\n");
        if (resText === `0 documents found for "${query}" in English (US).`) return null;
        let resultUrl = $("li[class=\"result-1\"]")
            .children("div[class=\"column-container\"]")
            .children("div[class=\"column-5 result-list-item\"]")
            .children("h4").children("a").attr("href");
        return resultUrl;
    }

    static async load(result) {
        return new MDNDocResult((await request.get(result)).text);
    }

}

class MDNDocResult {

    constructor(text) {
        this.text = text;
        this.$ = cheerio.load(text);
    }

    get name() {
        return this.$("meta[property=\"og:title\"]").attr("content");
    }

    get description() {
        const desc = this.$("p").first().html();
        return md(desc);
    }

    get url() {
        return this.$("meta[property=\"og:url\"]").attr("content");
    }

    get params() {
        const regex = /<h[1-6] id="Parameters">Parameters<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t => t.trim()).filter(t => t !== "");
        let index = indexes.indexOf(regex.test(this.text) ? regex.exec(this.text)[0] : null);
        if (index === -1) return null;
        const params = [];
        const text = indexes.slice(index + 1).join("\n");
        const $ = cheerio.load(text);
        $("dl").first().children().map((_, e) => params.push(md($(e).html())));
        return chunk(params, 2);
    }

    get methods() {
        const regex = /<h[1-6] id="Methods">Methods<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t => t.trim()).filter(t => t !== "");
        let index = indexes.indexOf(regex.test(this.text) ? regex.exec(this.text)[0] : null);
        if (index === -1) return null;
        const methods = [];
        const text = indexes.slice(index + 1).join("\n");
        const $ = cheerio.load(text);
        $("dl").first().children().map((_, e) => methods.push(md($(e).html())));
        return chunk(methods, 2);
    }

    get returnValue() {
        const regex = /<h[1-6] id="Return_value">Return value<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t => t.trim()).filter(t => t !== "");
        const index = indexes.indexOf(regex.test(this.text) ? regex.exec(this.text)[0] : null);
        if (index === -1) return null;
        const text = indexes.slice(index + 1).join("\n");
        const $ = cheerio.load(text);
        return md($("p").first().html());
    }

}

function chunk(arr, len) {
    const chunked = [];
    for (let i = 0; i < arr.length; i += len) chunked.push(arr.slice(i, i + len));
    return chunked;
}

function md(html) {
    return turndown.turndown(html);
}

module.exports = MDNDocs;