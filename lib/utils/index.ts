import { PrimitiveType } from 'dts-dom';

export enum NODE_TYPE {
    /**
     * 对象
     */
    OBJECT = 'Object',
    /**
     * 数组
     */
    ARRAY = 'Array',
    /**
     * 基本类型
     */
    NORMAL = 'Normal'
}

export type AllNode = ObjectNode | ArrayNode | NormalNode;

interface NodeBase {
    property: string;
    comment: string[];
}

export interface ObjectNode extends NodeBase {
    type: NODE_TYPE.OBJECT;
    children: AllNode[];
}

export interface ArrayNode extends NodeBase {
    type: NODE_TYPE.ARRAY;
    children: AllNode[];
}

export interface NormalNode extends NodeBase {
    type: NODE_TYPE.NORMAL;
    valueType: PrimitiveType;
}



export function object2Node(property: string): ObjectNode{
    return {
        property: property || 'root',
        comment: [],
        type: NODE_TYPE.OBJECT,
        children: []
    }
}

export function array2Node(property: string): ArrayNode{
    return {
        property,
        comment: [],
        type: NODE_TYPE.ARRAY,
        children: []
    }
}

export function normal2Node(property: string, valueType: PrimitiveType): NormalNode{
    return {
        property,
        comment: [],
        type: NODE_TYPE.NORMAL,
        valueType
    }
}

const jsDocReg = /\/\*(\s|.)*?\*\//;
const leadingReg = /\/\/(.*)/;

function getComment(comment: string): string {
    const matched = comment.match(leadingReg);
    if (matched && matched[1]) {
        return matched[1].trim();
    }
    return '';
}

function getJsDocComment(comment: string): string[] {
    return comment
        .trim()
        .slice(1, -1)
        .split(/\n/)
        .map((str): string => str.trim().replace(/^\*+/, ''))
        .filter((str): boolean => !!str);
}

/**
 * 处理注释
 */
export function formatComment(comments: string[]): string {
    let formatedComment = [];
    const length = comments.length;

    if (length > 0) {
        comments.forEach((comment): void => {
            const isJsDoc = !!jsDocReg.test(comment)

            if (isJsDoc) {
                formatedComment.push(...getJsDocComment(comment));
            } else {
                formatedComment.push(getComment(comment));
            }
        });
    }
    
    return formatedComment.join('\n');
}