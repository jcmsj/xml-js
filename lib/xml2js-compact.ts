import { SAXParser } from "@jcsj/sax"
import { Attributes } from "./Attributes"
import { Callbacks } from "./Callbacks"
import { DeclarationAttributes } from "./DeclarationAttributes"
import { ElementKeys } from "./ElementKeys"
import { Ignore } from "./Ignore"
import { Indents } from "./Indents"
import nativeType from "./nativeType"
import { onError } from "./onError"

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

export interface Flags {
    alwaysChildren: boolean
    addParent: boolean
    trim: boolean
    nativeType: boolean
    nativeTypeAttributes: boolean
    alwaysArray: boolean | string[]
    ignore: Partial<Ignore>
    indents: Partial<Indents>
    fullTagEmptyElement: boolean
    noQuotesForNativeAttributes: boolean
    capstureSpaceBetweenElements: boolean
    instructionHasAttributes: boolean
    sanitize: boolean
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
        declaration: "_declaration",
        instruction: "_instruction",
        attributes: "_attributes",
        text: "_text",
        cdata: "_cdata",
        doctype: "_doctype",
        comment: "_comment",
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
        //WARNING: Skips sanitize flag
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
    if (ignorable.Declaration)
        return;

    if (instruction.name.toLowerCase() === 'xml') {
        currentElement[gElementKeys.declaration] = {};
        if (Object.keys(attributes).length) {
            currentElement[gElementKeys.declaration][gElementKeys.parent] = attributes;
        }
        if (options.addParent) {
            currentElement[gElementKeys.declaration][gElementKeys.parent] = currentElement;
        }
    } else {
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
export function xml2jsCompact(xml: string, _options: Partial<Options>) {
    const innerCallbacks = new SAXParser(true, {});
    const result = {} as any;
    currentElement = result;

    const config = createOptions(_options)
    options = config;
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
        innerCallbacks.write(xml);
    } else if (!innerCallbacks.parse(xml)) {
        throw Error('XML parsing error: ' + innerCallbacks.getError());
    }

    if (result[gElementKeys.elements]) {
        const temp = result[gElementKeys.elements];
        delete result[gElementKeys.elements];
        result[gElementKeys.elements] = temp;
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
                value[key] = callbacks.instruction!(value[key], key, currentElement)
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

}

function cloneAttributesUnlessIgnored(attributes: any) {
    const elem = {} as any;
    if (!ignorable.Attributes && attributes) {
        elem[gElementKeys.attributes] = attributes || {};
    }

    return elem;

}

function onStartElement(_name: string | { attributes: any, name: string }, attributes: any) {
    let elem = {} as any;
    let name: string = _name as string;
    if (typeof _name === 'object') {
        attributes = _name.attributes;
        name = _name.name;
    }
    attributes = manipulateAttributes(attributes);
    if (options.callbacks.elementName) {
        name = options.callbacks.elementName(name, name, currentElement)
    }

    elem = cloneAttributesUnlessIgnored(attributes)
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

    elem[gElementKeys.parent] = currentElement; // will be deleted in onEndElement() if !options.addParent

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

function onDoctype(doctype: string) {
    if (ignorable.Doctype) {
        return;
    }
    addField('doctype', couldTrim(doctype.replace(/^ /, '')));
}