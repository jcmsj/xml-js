
import sax from "@jcsj/sax"
import nativeType from "./nativeType"

export interface ElementCompact {
    [key: string]: any
    _declaration?: {
        _attributes?: DeclarationAttributes
    }
    _instruction?: {
        [key: string]: string
    }
    _attributes?: Attributes
    _cdata?: string
    _doctype?: string
    _comment?: string
    _text?: string | number
}

export interface Attributes {
    [key: string]: string | number | undefined
}

export interface DeclarationAttributes {
    version?: string | number
    encoding?: 'utf-8' | string
    standalone?: 'yes' | 'no'
}

export interface Element {
    declaration?: {
        attributes?: DeclarationAttributes
    }
    instruction?: string
    attributes?: Attributes
    cdata?: string
    doctype?: string
    comment?: string
    text?: string | number | boolean
    type?: string
    name?: string
    elements?: Array<Element>
}

export interface Ignore {
    Declaration: boolean
    Instruction: boolean
    Attributes: boolean
    Comment: boolean
    Cdata: boolean
    Doctype: boolean
    Text: boolean
}

export interface Indents {
    Text: boolean
    Cdata: boolean
    Attributes: boolean
    Instruction: boolean
}

export interface Flags {
    alwaysChildren: boolean
    addParent: boolean
    trim: boolean
    nativeType: boolean
    nativeTypeAttributes: boolean
    alwaysArray: boolean|string[]
    compact: boolean
    ignore: Partial<Ignore>
    indents: Partial<Indents>
    fullTagEmptyElement: boolean
    noQuotesForNativeAttributes: boolean
    capstureSpaceBetweenElements: boolean
    instructionHasAttributes: boolean
    sanitize: boolean
}

export interface ElementKeys {
    declaration: string
    instruction: string
    attributes: string
    text: string
    cdata: string
    doctype: string
    comment: string
    parent: string
    type: string
    name: string
    elements: string
}

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
export interface Options extends Flags {
    spaces: number

    callbacks: Partial<Callbacks>
    elementKeys: ElementKeys
}

export function createIgnoreOptions(options?: Partial<Ignore>): Ignore {
    return {
        Declaration: false,
        Instruction: false,
        Attributes: false,
        Comment: false,
        Cdata: false,
        Doctype: false,
        Text: false,
        ...options
    }
}

function defaultFlags(options?: Partial<Flags>): Flags {
    return {
        trim: false,
        alwaysChildren: false,
        addParent: false,
        nativeType: false,
        nativeTypeAttributes: false,
        alwaysArray: false,
        compact: false,
        noQuotesForNativeAttributes: false,
        fullTagEmptyElement: false,
        capstureSpaceBetweenElements: false,
        instructionHasAttributes: false,
        sanitize: false,
        ignore: {},
        indents: {},
        ...options
    }
}

function mergeElementKeys(o: Partial<ElementKeys> = {}): ElementKeys {
    return {
        declaration: "declaration",
        instruction: "instruction",
        attributes: "_attributes",
        text: "text",
        cdata: "cdata",
        doctype: "doctype",
        comment: "comment",
        parent: "parent",
        type: "type",
        name: "name",
        elements: "elements",
        ...o
    }
}
export function createOptions(options: Partial<Options>): Options {
    return {
        ...defaultFlags(options),
        callbacks: { ...options.callbacks },
        elementKeys: mergeElementKeys(options.elementKeys),
        spaces: options.spaces ?? 0,
    }
}


function onText(text: string) {
    if (ignorable.Text) {
        return;
    }
    if (!text.trim() && !options.capstureSpaceBetweenElements) {
        return;
        //Note: Skips sanize
    }
    text = couldTrim(text);
    if (options.nativeType) {
        text = nativeType(text);
    }

    if (options.sanitize) {
        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    addField('text', text);
}

function onEndCdata() {
    //TODO!
}

function onError(error: any) {
    //TODO: Identify type
    error.note = error; //console.error(error);
}

function onEndElement() {
    const parentElement = currentElement[gElementKeys.parent];
    if (!options.addParent) {
        delete currentElement[gElementKeys.parent];
    }

    currentElement = parentElement;
}
``
const attrsRegExp = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g;
function onInstruction(instruction: any) {
    let attributes = {};
    if (instruction.body && (instruction.name.toLowerCase() === 'xml' || options.instructionHasAttributes)) {
        let match;
        while ((match = attrsRegExp.exec(instruction.body)) !== null) {
            attributes[match[1]] = match[2] || match[3] || match[4];
        }

        attributes = manipulateAttributes(attributes);
    }
    if (instruction.name.toLowerCase() === 'xml') {
        if (ignorable.Declaration) {
            return;
        }
        currentElement[gElementKeys.declaration] = {};
        if (Object.keys(attributes).length) {
            currentElement[gElementKeys.declaration][gElementKeys.parent] = attributes;
        }
        if (options.addParent) {
            currentElement[gElementKeys.declaration][gElementKeys.parent] = currentElement;
        }
    } else {
        if (ignorable.Declaration) {
            return;
        }

        instruction.body = couldTrim(instruction.body)
        const value = {};
        if (options.instructionHasAttributes && Object.keys(attributes).length) {
            value[instruction.name] = {};
            value[instruction.name][gElementKeys.attributes] = attributes;
        } else {
            value[instruction.name] = instruction.body;
        }
        addField('instruction', value);
    }
}
export default xml2js;
export function xml2js(xml: string, _options: Partial<Options>) {
    const innerCallbacks = sax(true, {});
    const result = {} as any;
    currentElement = result;
    
    const config = createOptions(_options)
    options = config;
    console.log({_options, config});
    callbacks = config.callbacks as Callbacks;
    gElementKeys = config.elementKeys;
    ignorable = config.ignore as Ignore;

    if (pureJscallbacks) {
        innerCallbacks.opt = { strictEntities: true };
        innerCallbacks.onopentag = onStartElement;
        innerCallbacks.ontext = onText;
        innerCallbacks.oncomment = onComment;
        innerCallbacks.onclosetag = onEndElement;
        innerCallbacks.onerror = onError;
        innerCallbacks.oncdata = onCdata;
        innerCallbacks.ondoctype = onDoctype;
        innerCallbacks.onprocessinginstruction = onInstruction;
    } else {
        innerCallbacks.on('startElement', onStartElement);
        innerCallbacks.on('text', onText);
        innerCallbacks.on('comment', onComment);
        innerCallbacks.on('endElement', onEndElement);
        innerCallbacks.on('error', onError);
        //callbacks.on('startCdata', onStartCdata);
        //callbacks.on('endCdata', onEndCdata);
        //callbacks.on('entityDecl', onEntityDecl);
    }

    if (pureJscallbacks) {
        innerCallbacks.write(xml).close();
    } else {
        if (!innerCallbacks.parse(xml)) {
            throw Error('XML parsing error: ' + innerCallbacks.getError());
        }
    }
    
    if (result[config.elementKeys.elements]) {
        var temp = result[config.elementKeys.elements];
        
        delete result[config.elementKeys.elements];
        result[config.elementKeys.elements] = temp;
        delete result.text;
    }

    return result;
}

var options: Options;
var pureJscallbacks = true;
var currentElement: any;
var gElementKeys: ElementKeys;
var callbacks: Callbacks;
var ignorable: Ignore;
export function addField(type: keyof ElementKeys, value: any) {
    const attrib = gElementKeys[type]
    if (options.compact) {
        if (currentElement[attrib]) {
            if (
                (Array.isArray(options.alwaysArray) ? options.alwaysArray.includes(attrib) : options.alwaysArray)
            ) {
                currentElement[attrib] = [currentElement[attrib]];
            }

            if (callbacks[type] && typeof value === 'string') {
                value = callbacks[type](value, currentElement);
            }
        }

        if (type === 'instruction' && (
            options.callbacks.instruction || options.callbacks.instructionName
        )) {
            for (const key in value) {
                if (options.callbacks.instruction) {
                    //TODO: Check why there's a 4th arg
                    value[key] = callbacks.instruction!(value[key], key, currentElement, undefined as any)
                } else {
                    const temp = value[key];
                    delete value[key];
                    value[callbacks.instructionName!(key, temp, currentElement)] = temp;
                }
            }
        }
        if (Array.isArray(currentElement[attrib])) {
            currentElement[attrib].push(value);
        } else {
            currentElement[attrib] = value;
        }
    } else {
        if (!currentElement[gElementKeys.elements]) {
            currentElement[gElementKeys.elements] = [];
        }
        const element = {};
        element[gElementKeys.type] = type;
        if (type === 'instruction') {
            const key = Object.keys(value).find(v => Object.hasOwn(value, v))
            if (!key) {
                throw TypeError("No instruction key")
            }
            element[gElementKeys.name] = callbacks.instructionName ? callbacks.instructionName(key, value, currentElement) : key;
            if (options.instructionHasAttributes) {
                element[gElementKeys.attributes] = value[key][gElementKeys.attributes];
                if (callbacks.instruction) {
                    element[gElementKeys.attributes] = callbacks.instruction(element[gElementKeys.attributes], key, currentElement, undefined as any);
                }
            } else {
                if (callbacks.instruction) {
                    value[key] = callbacks.instruction(value[key], key, currentElement, undefined as any);
                }
                element[gElementKeys.instruction] = value[key];
            }
        } else {
            if (callbacks[type]) {
                value = callbacks[type](value, currentElement);
            }
            element[gElementKeys[type]] = value;
        }
        if (options.addParent) {
            element[gElementKeys.parent] = currentElement;
        }
        currentElement[gElementKeys.elements].push(element);
    }
}

function onStartElementCompact(name: string | any, attributes: any) {
    const elem = {} as any;
    if (!ignorable.Attributes && attributes && Object.keys(attributes).length) {
        elem[gElementKeys.attributes] = {...attributes};
    }

    return elem;

}
function onStartElement(_name: string | { attributes: any, name: string }, attributes: any) {
    let elem = {} as any;
    let name:string = _name as string;
    if (typeof _name === 'object') {
        attributes = _name.attributes;
        name = _name.name;
    }
    attributes = manipulateAttributes(attributes);
    if (options.callbacks.elementName) {
        name = options.callbacks.elementName(name, name, currentElement)
    }

    if (options.compact) {
        elem = onStartElementCompact(name, attributes)
        if (
            !(currentElement.name) &&
            (Array.isArray(options.alwaysArray) ? options.alwaysArray.includes(name) : options.alwaysArray)
        ) {
            currentElement[name] = [];
        }
        if (currentElement[name] && !Array.isArray(currentElement[name])) {
            currentElement[name] = [currentElement[name]];
        }
        if (Array.isArray(currentElement[name])) {
            currentElement[name].push(elem);
        } else {
            currentElement[name] = elem;
        }
    
    } else {
        if (!currentElement[gElementKeys.elements]) {
            currentElement[options.elementKeys.elements] = [];
        }
        elem[gElementKeys.type] = 'element';
        elem[gElementKeys.name] = name;
        if (!ignorable.Attributes && attributes && Object.keys(attributes).length) {
            elem[gElementKeys.elements] = attributes;
        }
        if (options.alwaysChildren) {
            elem[gElementKeys.elements] = [];
        }
        currentElement[gElementKeys.elements].push(elem);
    }
    elem[gElementKeys.parent] = currentElement; // will be deleted in onEndElement() if !options.addParent
    console.log({currentElement, elem});
    
    currentElement = elem;
}

function manipulateAttributes(attributes: Record<string, any>) {
    if (callbacks.attributes && attributes) {
        attributes = callbacks.attributes(attributes, currentElement);
    }

    if (attributes && (options.trim ||
        callbacks.attributeValue || callbacks.attributeName || options.nativeTypeAttributes)
    ) {
        for (const name of Object.keys(attributes)) {
            let value = couldTrim(attributes[name]);

            if (options.nativeTypeAttributes) {
                value = nativeType(value);
            }

            if (callbacks.attributeValue) {
                value = callbacks.attributeValue(value, name, currentElement)
            }

            if (callbacks.attributeName) {
                const temp = attributes[name];
                delete attributes[name]; //Clear it first
                attributes[callbacks.attributeName(name, value, currentElement)] = temp;
            } else {
                //update
                attributes[name] = value;
            }
        }
    }
    return attributes;
}

function onComment(comment: string) {
    if (ignorable.Comment) {
        return;
    }

    addField('comment', couldTrim(comment));
}


function couldTrim(s: string) {
    return options.trim ? s.trim() : s
}
function onCdata(cdata: string) {
    if (ignorable.Cdata) {
        return;
    }

    addField('cdata', couldTrim(cdata));
}

function onDoctype(doctype:string) {
    if (ignorable.Doctype) {
        return;
    }
    addField('doctype', couldTrim(doctype.replace(/^ /, '')));
}