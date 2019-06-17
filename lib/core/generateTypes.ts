import * as dom from 'dts-dom';
import { pascalCase } from 'change-case';
import { ObjectNode, formatComment, AllNode, NODE_TYPE, NormalNode, ArrayNode } from '../utils';

function _generateTypes(interfaceName, parseTree): dom.InterfaceDeclaration[] {
    const interfaceDom = dom.create.interface(interfaceName);
    const children = parseTree.children;
    const result = [interfaceDom];

    interfaceDom.jsDocComment = formatComment(parseTree.comment);

    function renderObjectJson(name, itemChildren, callback): dom.Type {
        const pascalCaseName = pascalCase(name);
        // 如果有子元素，则以大写首字母为接口名，创建一个新接口
        const interfaceDom = dom.create.interface(pascalCaseName);
        callback(interfaceDom, itemChildren);
        result.push(interfaceDom);

        return pascalCaseName as dom.Type;
    }

    function renderArrayJson(node, callback): dom.ArrayTypeReference {
        let types = node.children.map((cNode): dom.Type => {
            const type = cNode.type;

            if (type === NODE_TYPE.NORMAL) {
                return cNode.valueType;
            }
    
            if (type === NODE_TYPE.OBJECT) {
                return renderObjectJson(node.property, cNode.children, callback);
            }
    
            if (type === NODE_TYPE.ARRAY) {
                cNode.property = `union-${node.property}`;
                return renderArrayJson(cNode, callback)
            }
        });

        // 去除重复的类型
        types = Array.from(new Set(types));

        if (types.length === 0) {
            return dom.create.array(dom.type.any);
        }
        if (types.length === 1) {
            return dom.create.array(types[0]);
        }
        return dom.create.array(dom.create.union(types));
    }

    function recursive(dts, children): void {
        children.forEach((item: AllNode): void => {
            const { type, property: name, comment } = item;
            let propertyDom;

            if (type === NODE_TYPE.NORMAL) {
                propertyDom = dom.create.property(name, (item as NormalNode).valueType);
            } else if (type === NODE_TYPE.OBJECT) {
                const itemChildren = (item as ObjectNode).children;

                if (itemChildren.length > 0) {
                    propertyDom = dom.create.property(name, renderObjectJson(name, itemChildren, recursive) as dom.Type);
                } else {
                    propertyDom = dom.create.property(name, dom.type.object);
                }
            } else if (type === NODE_TYPE.ARRAY) {
                const types = renderArrayJson(item, recursive);
                propertyDom = dom.create.property(name, types);
            }

            dts.members.push(propertyDom);
            propertyDom.jsDocComment = formatComment(comment);;
        })
    }

    recursive(interfaceDom, children);

    return result;
}

export default function generateTypes(interfaceName: string, parseTree: ObjectNode): string {
    const result = _generateTypes(interfaceName, parseTree);
    return result.map((dts): string => {
        return dom.emit(dts)
    }).join('');
}