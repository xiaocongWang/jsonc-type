import * as dom from 'dts-dom';
import { ObjectNode, formatComment } from '../utils';

export default function generateTypes(interfaceName: string, parseTree: ObjectNode): string {
    const rootInterface = dom.create.interface(interfaceName);
    rootInterface.jsDocComment = formatComment(parseTree.comment);
    // TODO ...
    return dom.emit(rootInterface);
}