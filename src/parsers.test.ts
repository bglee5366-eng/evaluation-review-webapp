import {describe,it,expect} from 'vitest';
import {isSupported,formatBytes} from './review';
import {parseFile} from './parsers';
describe('file helpers',()=>{it('accepts supported formats case-insensitively',()=>{expect(isSupported('rules.HWPX')).toBe(true);expect(isSupported('a.xls')).toBe(true);expect(isSupported('script.exe')).toBe(false);});it('formats byte size',()=>{expect(formatBytes(2048)).toBe('2 KB');expect(formatBytes(1048576)).toBe('1.0 MB');});});
it('parses UTF-8 text documents in the browser',async()=>{const file=new File(['평가기준: 10점'],'rules.txt',{type:'text/plain'});await expect(parseFile(file)).resolves.toContain('평가기준: 10점');});
