import { csvToJson } from '../src/converter';
import fs from 'fs';
import path from 'path';

describe('csvToJson', () => {
    const inputCsvPath = path.join(__dirname, 'mock', 'input.csv');
    const outputJsonPath = path.join(__dirname, '..', 'output', 'input.json');

    beforeEach(() => {
        // テストの前に既存の出力ファイルを削除
        if (fs.existsSync(outputJsonPath)) {
            fs.unlinkSync(outputJsonPath);
        }
    });

    it('should convert CSV to JSON', (done) => {
        csvToJson(inputCsvPath);

        setTimeout(() => {
            const jsonData = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));
            expect(jsonData).toEqual({
                "name": "json-csv-converter",
                "version": "1.0.0",
                "dependencies": {
                    "@types/node": "^20.8.6",
                    "tslint": "^6.1.3",
                    "hobbies": "['読書', '映画鑑賞']"
                },
                "testArray": [
                    "babel-eslint",
                    "csv-parser"
                ]
            });
            done();
        }, 1000);
    }, 10000);
});