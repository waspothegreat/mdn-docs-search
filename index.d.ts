declare class MDNDocs {
    public static search(query: null): Promise<string | null>;
    public static load(result: string): Promise<MDNDocResult>;
}

declare class MDNDocResult {
    public constructor(text: string);
    public readonly $: Promise<object>;
    public name: Promise<string>;
    public description: Promise<string>;
    public url: Promise<string>;
    public examples: Promise<string | null>;
    public polyfill: Promise<string | null>;
    public syntax: Promise<string | null>;
    public params: Promise<string[][] | null>;
    public pageDescription: Promise<string | null>;
    public seeAlso: Promise<string | null>;
    public methods: Promise<string[][] | null>;
    public returnValue: Promise<string | null>;
}

export = MDNDocs;
