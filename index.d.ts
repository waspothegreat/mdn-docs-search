declare class MDNDocs {
    public static search(query?: string): Promise<string>;
    public static load(result: string): Promise<MDNDocResult>;
}

declare class MDNDocResult {
    public constructor(text: any);
    public readonly $: Promise<object>;
    public name: Promise<string>;
    public description: Promise<string>;
    public url: Promise<string>;
    public examples: Promise<string>;
    public polyfill: Promise<string>;
    public syntax: Promise<string>;
    public params: Promise<Array<Array<string>>>;
    public pageDescription: Promise<string>;
    public seeAlso: Promise<string>;
    public methods: Promise<Array<Array<string>>>;
    public returnValue: Promise<string>;
}

export = MDNDocs;
