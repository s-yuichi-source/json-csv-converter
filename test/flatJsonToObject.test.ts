import { flatJsonToObject } from '../src/converter';

describe('flatJsonToObject', () => {
    it('should flatten a nested object', () => {
        const nestedData = {
            "dependencies": {
                "@types/node": "^20.8.6",
                "tslint": "^6.1.3",
                "hobbies": "['読書', '映画鑑賞']"
            },
            "testArray": [
                "babel-eslint",
                "csv-parser"
            ]
        };

        const expectedFlatData = {
            "dependencies.@types/node": "^20.8.6",
            "dependencies.tslint": "^6.1.3",
            "dependencies.hobbies": "['読書', '映画鑑賞']",
            "testArray.0": "babel-eslint",
            "testArray.1": "csv-parser"
        };

        const result = flatJsonToObject(nestedData);
        expect(result).toEqual(expectedFlatData);
    });

    it('should handle empty object', () => {
        const nestedData = {};
        const expectedFlatData = {};

        const result = flatJsonToObject(nestedData);
        expect(result).toEqual(expectedFlatData);
    });

    it('should handle single level object', () => {
        const nestedData = {
            "name": "json-csv-converter",
            "version": "1.0.0"
        };

        const expectedFlatData = {
            "name": "json-csv-converter",
            "version": "1.0.0"
        };

        const result = flatJsonToObject(nestedData);
        expect(result).toEqual(expectedFlatData);
    });

    it('should handle nested arrays', () => {
        const nestedData = {
            "level1": {
                "level2": [
                    "item1",
                    "item2"
                ]
            }
        };

        const expectedFlatData = {
            "level1.level2.0": "item1",
            "level1.level2.1": "item2"
        };

        const result = flatJsonToObject(nestedData);
        expect(result).toEqual(expectedFlatData);
    });

    it('should handle complex nested objects', () => {
        const nestedData = {
            "level1": {
                "level2": {
                    "level3": {
                        "key": "value"
                    }
                },
                "array": [
                    "item1",
                    {
                        "key": "value"
                    }
                ]
            }
        };

        const expectedFlatData = {
            "level1.level2.level3.key": "value",
            "level1.array.0": "item1",
            "level1.array.1.key": "value"
        };

        const result = flatJsonToObject(nestedData);
        expect(result).toEqual(expectedFlatData);
    });
});