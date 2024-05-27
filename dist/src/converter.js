import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
const inputDir = 'input/';
const outputDir = 'output/';
// CSVをJSONに変換
function csvToJson(filePath) {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
        const outputFilePath = path.join(outputDir, path.basename(filePath, '.csv') + '.json');
        const nestedResults = results.map(flatObjectToNested);
        fs.writeFileSync(outputFilePath, JSON.stringify(nestedResults.length === 1 ? nestedResults[0] : nestedResults, null, 2));
    });
}
// JSONをCSVに変換
const jsonToCsv = (filePath) => {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let records = [];
    if (Array.isArray(jsonData)) {
        jsonData.forEach((data) => records.push(flatJsonToObject(data)));
    }
    else {
        records = [flatJsonToObject(jsonData)];
    }
    const headers = Object.keys(records[0]).map(key => ({ id: key, title: key }));
    const csvWriter = createCsvWriter({
        path: path.join(outputDir, path.basename(filePath, '.json') + '.csv'),
        header: headers,
    });
    csvWriter.writeRecords(records);
};
// フラットなJSONオブジェクトをネストされたオブジェクトに変換
const flatObjectToNested = (flatObj) => {
    const nestedObj = {};
    for (const flatKey in flatObj) {
        const keyParts = flatKey.split('.');
        keyParts.reduce((currentLevel, keyPart, partIndex) => {
            if (partIndex === keyParts.length - 1) {
                currentLevel[keyPart] = flatObj[flatKey];
            }
            else {
                currentLevel[keyPart] = currentLevel[keyPart] || {};
            }
            return currentLevel[keyPart];
        }, nestedObj);
    }
    return nestedObj;
};
// JSONオブジェクトをフラット化
const flatJsonToObject = (data, prefix = "") => {
    if (typeof data !== 'object' || data === null) {
        return { [prefix]: data };
    }
    let flatedData = {};
    for (let key in data) {
        let propertyPrefix = prefix ? `${prefix}.${key}` : key;
        let flatData = flatJsonToObject(data[key], propertyPrefix);
        Object.assign(flatedData, flatData);
    }
    return flatedData;
};
// inputディレクトリのファイルを読み込み、変換を実施
fs.readdirSync(inputDir).forEach(file => {
    const filePath = path.join(inputDir, file);
    if (file.endsWith('.csv')) {
        csvToJson(filePath);
    }
    else if (file.endsWith('.json')) {
        jsonToCsv(filePath);
    }
});
