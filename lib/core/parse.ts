import { ParseOptions, visit } from 'jsonc-parser';
import { ObjectNode, ArrayNode, AllNode, object2Node, array2Node, normal2Node } from '../utils';
import { PrimitiveType } from 'dts-dom';

let nodeStack: AllNode[] = []; // 记录到当前为止的节点，用于生成嵌套的节点树
let curProperty = ''; // 当前属性名
let commentStack: string[] = []; // 记录注释

function pushNode2Children(node): void {
    const curNode = nodeStack.slice(-1)[0] as ArrayNode | ObjectNode;
    if (curNode && curNode.children) {
        curNode.children.push(node);
    }
}

/**
 * 以每个字段作为节点，将 json 字符串解析成一颗节点树。
 * @param jsonc
 * @param options
 */
export default function parser(jsonc: string, options: ParseOptions = { disallowComments: false }): ObjectNode {
    let result!: ObjectNode;

    visit(jsonc, {
        onObjectProperty: (property: string): void => {
            curProperty = property;
        },
        onObjectBegin: (): void => {
            const node = object2Node(curProperty);

            if (result == undefined) {
                result = node;
            }

            pushNode2Children(node);

            nodeStack.push(node);

            node.comment = [...commentStack];
            commentStack = [];
        },
        onObjectEnd: (): void => {
            nodeStack.pop();
        },
        onArrayBegin: (): void => {
            const node = array2Node(curProperty);

            pushNode2Children(node);
            
            nodeStack.push(node);

            node.comment = [...commentStack];
            commentStack = [];
        },
        onArrayEnd: (): void => {
            nodeStack.pop();
        },
        onLiteralValue: (value): void => {
            const node = normal2Node(curProperty, typeof value as PrimitiveType);

            pushNode2Children(node);

            node.comment = [...commentStack];
            commentStack = [];
        },
        onComment: (offset, length): void => {
            // 记录注释
            const comment = jsonc.substr(offset, length);
            commentStack.push(comment);
        }
    }, options);

    return result;
}