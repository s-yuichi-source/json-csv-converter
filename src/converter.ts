import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const inputDir = 'input/';
const outputDir = 'output/';

// CSVをJSONに変換
const csvToJson = (filePath: string): void => {
    const results: object[] = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => {
            const outputFilePath = path.join(outputDir, path.basename(filePath, '.csv') + '.json');
            const nestedResults = results.map(flatObjectToNested);
            fs.writeFileSync(outputFilePath, JSON.stringify(nestedResults.length === 1 ? nestedResults[0] : nestedResults, null, 2));
        });
}

// JSONをCSVに変換
const jsonToCsv = (filePath: string): void => {
    const jsonData: any = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let records: any[] = [];

    if (Array.isArray(jsonData)) {
        jsonData.forEach((data: any) => records.push(flatJsonToObject(data)));
    } else {
        records = [flatJsonToObject(jsonData)];
    }

    const headers = Object.keys(records[0]).map(key => ({ id: key, title: key }));
    const csvWriter = createCsvWriter({
        path: path.join(outputDir, path.basename(filePath, '.json') + '.csv'),
        header: headers,
    });

    csvWriter.writeRecords(records);
}

// フラットなJSONオブジェクトをネストされたオブジェクトに変換
const flatObjectToNested = (flatObj: any): any => {
    const nestedObj: any = {};

    for (const flatKey in flatObj) {
        const keyParts = flatKey.split('.');
        keyParts.reduce((currentLevel: any, keyPart: string, partIndex: number) => {
            const isLastPart = partIndex === keyParts.length - 1;
            const arrayIndex = Number(keyPart);

            if (!isNaN(arrayIndex)) {
                if (!Array.isArray(currentLevel)) {
                    currentLevel[keyParts[partIndex - 1]] = [];
                }
                if (isLastPart) {
                    currentLevel[arrayIndex] = flatObj[flatKey];
                } else {
                    currentLevel[arrayIndex] = currentLevel[arrayIndex] || [];
                }
                return currentLevel[arrayIndex];
            } else {
                if (isLastPart) {
                    currentLevel[keyPart] = flatObj[flatKey];
                } else {
                    currentLevel[keyPart] = currentLevel[keyPart] || {};
                }
                return currentLevel[keyPart];
            }
        }, nestedObj);
    }

    return nestedObj;
};

// JSONオブジェクトをフラット化
const flatJsonToObject = (data: any, prefix = ""): any => {
    if (typeof data !== 'object' || data === null) {
        return { [prefix]: data };
    }

    let flatedData: any = {};
    for (let key in data) {
        let propertyPrefix = prefix ? `${prefix}.${key}` : key;
        let flatData = flatJsonToObject(data[key], propertyPrefix);
        Object.assign(flatedData, flatData);
    }

    return flatedData;
}

// inputディレクトリのファイルを読み込み、変換を実施
fs.readdirSync(inputDir).forEach(file => {
    const filePath = path.join(inputDir, file);
    if (file.endsWith('.csv')) {
        csvToJson(filePath);
    } else if (file.endsWith('.json')) {
        jsonToCsv(filePath);
    }
});

export { csvToJson, jsonToCsv, flatObjectToNested, flatJsonToObject };