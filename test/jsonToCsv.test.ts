import { jsonToCsv } from '../src/converter';
import fs from 'fs';
import path from 'path';

describe('jsonToCsv', () => {
    const inputJsonPath = path.join(__dirname, 'mock', 'input.json');
    const outputCsvPath = path.join(__dirname, '..', 'output', 'input.csv');

    beforeEach(() => {
        // テストの前に既存の出力ファイルを削除
        if (fs.existsSync(outputCsvPath)) {
            fs.unlinkSync(outputCsvPath);
        }
    });

    it('should convert JSON to CSV', (done) => {
        jsonToCsv(inputJsonPath);

        setTimeout(() => {
            const csvData = fs.readFileSync(outputCsvPath, 'utf8');
            const expectedCsvData = [
                'name,version,dependencies.@types/node,dependencies.tslint,dependencies.hobbies,testArray.0,testArray.1',
                'json-csv-converter,1.0.0,^20.8.6,^6.1.3,"[\'読書\', \'映画鑑賞\']",babel-eslint,csv-parser'
            ].join('\n');

            expect(csvData.trim()).toBe(expectedCsvData);
            done();
        }, 1000);
    }, 10000);
});