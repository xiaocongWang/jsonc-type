import parse from './core/parse';
import generateTypes from './core/generateTypes';
import { ParseOptions } from 'jsonc-parser';

/**
 * @param interfaceName
 * @param path 
 */
export default function jsonc2Type (interfaceName: string, jsonc: string, options?: ParseOptions): string {
    const parseTree = parse(jsonc, options);
    const result = generateTypes(interfaceName, parseTree);
    
    return result;
}