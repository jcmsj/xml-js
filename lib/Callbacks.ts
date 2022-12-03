
export interface Callbacks {
    doctype: (value: string, currentElementName: string, currentElementObj: object) => void;
    instruction: (
        instructionValue: string,
        instructionName: string,
        currentElementName: string,
        currentElementObj: object
    ) => void;
    cdata: (value: string, currentElementName: string, currentElementObj?: object) => void;
    comment: (value: string, currentElementName: string, currentElementObj?: object) => void;
    text: (value: string, currentElementName: string, currentElementObj?: object) => void;
    instructionName: (
        instructionName: string,
        instructionValue: string,
        currentElementName: string,
        currentElementObj?: object
    ) => string;
    elementName: (value: string, currentElementName: string, currentElementObj: object) => string;
    attributeName?: (
        attributeName: string,
        attributeValue: string,
        currentElementName: string,
        currentElementObj?: object
    ) => string;
    attributeValue?: (
        attributeValue: string,
        attributeName: string,
        currentElementName: string,
        currentElementObj?: object
    ) => any;
    attributes: (value: any, currentElementName: string, currentElementObj?: object) => Record<string, any>;
    fullTagEmptyElement: (currentElementName: string, currentElementObj?: object) => void;
}
