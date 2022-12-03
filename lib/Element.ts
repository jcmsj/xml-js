import { DeclarationAttributes } from "./DeclarationAttributes";
import { Attributes } from "./Attributes";


export interface Element {
    declaration?: {
        attributes?: DeclarationAttributes;
    };
    instruction?: string;
    attributes?: Attributes;
    cdata?: string;
    doctype?: string;
    comment?: string;
    text?: string | number | boolean;
    type?: string;
    name?: string;
    elements?: Array<Element>;
}
