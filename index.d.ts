declare class MDNDocs {
    public static search(query: null): Promise<string | null>;
    public static load(result: string): Promise<MDNDocResult>;
}

class MDNDocResult {
    public constructor(public text: string);
    public readonly $: Promise<object>;
    public get name(): Promise<string>;
    public get description(): Promise<string>;
    public get url(): Promise<string>;
    public get examples(): Promise<string | null>;
    public get polyfill(): Promise<string | null>;
    public get syntax(): Promise<string | null>;
    public get params(): Promise<Array<Array<string>> | null>;
    public get pageDescription(): Promise<string | null>;
    public get seeAlso(): Promise<string | null>;
    public get methods(): Promise<Array<Array<string>>| null>;
    public get returnValue(): Promise<string | null>;
}

export = MDNDocs;
