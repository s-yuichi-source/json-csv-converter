import { flatObjectToNested } from '../src/converter';

describe('flatObjectToNested', () => {
    it('should convert flat object to nested object', () => {
        const flatData = {
            "dependencies.@types/node": "^20.8.6",
            "dependencies.tslint": "^6.1.3",
            "dependencies.hobbies": "['読書', '映画鑑賞']",
            "testArray.0": "babel-eslint",
            "testArray.1": "csv-parser"
        };

        const expectedNestedData = {
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

        const result = flatObjectToNested(flatData);
        expect(result).toEqual(expectedNestedData);
    });

    it('should handle empty object', () => {
        const flatData = {};
        const expectedNestedData = {};

        const result = flatObjectToNested(flatData);
        expect(result).toEqual(expectedNestedData);
    });

    it('should handle single level flat object', () => {
        const flatData = {
            "name": "json-csv-converter",
            "version": "1.0.0"
        };

        const expectedNestedData = {
            "name": "json-csv-converter",
            "version": "1.0.0"
        };

        const result = flatObjectToNested(flatData);
        expect(result).toEqual(expectedNestedData);
    });
});