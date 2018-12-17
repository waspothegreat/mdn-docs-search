declare class MDNDocs {
    public static search(query?: any): Promise<string | null>;
    public static load(result: any): Promise<MDNDocResult>;
}

declare class MDNDocResult {
    public constructor(text: any);
    public readonly $: Promise<object>;
    public name: Promise<string>;
    public description: Promise<string>;
    public url: Promise<string>;
    public examples: Promise<string | null>;
    public polyfill: Promise<string | null>;
    public syntax: Promise<string | null>;
    public params: Promise<Array<Array<any>> | null>;
    public pageDescription: Promise<string | null>;
    public seeAlso: Promise<string | null>;
    public methods: Promise<Array<Array<any>> | null>;
    public returnValue: Promise<string | null>;
}

export = MDNDocs;
