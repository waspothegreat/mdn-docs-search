const request = require("node-superfetch");
const cheerio = require("cheerio");
const st = require('striptags');
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
    
    get examples() {
        const rgx = /<h[1-6] id="Examples">Examples<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t=>t.trim().replace(/[\n]+/g, "\n"))
        let index = indexes.indexOf(rgx.test(this.text) ? rgx.exec(this.text)[0] : null);
        if (index === -1) return null;
        const $ = cheerio.load(indexes.slice(index+1).join('\n'));
        return st($('pre').first().html())
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, `'`)
        .replace(/&quot;/g, `"`)
    }
    
    get syntax() {
        const regex = /<h[1-6] id="Syntax">Syntax<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t => t.trim()).filter(t => t !== "");
        let index = indexes.indexOf(regex.test(this.text) ? regex.exec(this.text)[0] : null);
        if (index === -1) return null;
        const $ = cheerio.load(indexes.slice(index + 1).join("\n"));
        return st($("pre").first().html())
            .replace(/&gt;/g, '>')
            .replace(/&#x2026;/g, '...')
            .replace(/&apos;/g, `'`)
            .replace(/&quot;/g, `"`)
            .replace(/&#x4E2D;&#x6587;/, '中文')
            .replace(/&#xF1;/g, 'ñ')
            .replace(/&#xA0;&#x926;&#x947;&#x935;&#x928;&#x93E;&#x917;&#x930;&#x940;/g, ' देवनागरी')
            .replace(/&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;/g, 'العربية ')
            .replace(/&#xEA;/g, 'ê')
            .replace(/&#x9AC;&#x9BE;&#x982;&#x9B2;&#x9BE;/g, 'বাংলা ')
            .replace(/&#x440;&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;/g, 'русский ')
            .replace(/&#x65E5;&#x672C;&#x8A9E;/g, '日本語')
            .replace(/&#xA2A;&#xA70;&#xA1C;&#xA3E;&#xA2C;&#xA40;/g, 'ਪੰਜਾਬੀ')
            .replace(/&#xD55C;&#xAD6D;&#xC5B4;/g, '한국어')
            .replace(/&#xBA4;&#xBAE;&#xBBF;&#xBB4;&#xBCD;/g, 'தமிழ்')
            .replace(/&#x5E2;&#x5D1;&#x5E8;&#x5D9;&#x5EA;/g, 'עברית');
    }

    get params() {
        const regex = /<h[1-6] id="Parameters">Parameters<\/h[1-6]>/;
        const indexes = this.text.split("\n").map(t => t.trim()).filter(t => t !== "");
        let index = indexes.indexOf(regex.test(this.text) ? regex.exec(this.text)[0] : null);
        if (index === -1) return null;
        const params = [];
        const text = indexes.slice(index + 1).join("\n");
        const $ = cheerio.load(text);
        $("dl").first().children().map((_, e) => params.push(st($(e).html()).replace(/(&.*;|&#xA;)/g, " ").replace(/Optional/g, ' (Optional)').replace(/Value/g, ' Value').replace(/[\r\n]+/g, '\n')));
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