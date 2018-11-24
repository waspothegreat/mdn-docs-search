declare class MDNDocs {
    public static search(query: null): Promise<string>;
    public static load(result: string): Promise<MDNDocResult>;
}

class MDNDocResult {
    public constructor(public text: string);
    public readonly $: Promise<object>;
    public get name(): Promise<string>;
    public get description(): Promise<string>;
    public get url(): Promise<string>;
    public get syntax(): Promise<string>;
    public get params(): Promise<Array<Array<string>>> | Promise<null>;
    public get methods(): Promise<Array<Array<string>>> | Promise<null>;
    public get returnValue(): Promise<string> | Promise<null>;
}

export = MDNDocs;
