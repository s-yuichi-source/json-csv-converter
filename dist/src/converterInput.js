import fs from 'fs';
import path from 'path';
const inputDir = 'input/';
const outputDir = 'output/';
fs.readdirSync(inputDir).forEach(file => {
    console.log(`Processing file: ${file}`); // ファイル名をログ出力
    const filePath = path.join(inputDir, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    if (ext === '.json') {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const csvData = jsonToCsv(jsonData);
        fs.writeFileSync(path.join(outputDir, `${baseName}.csv`), csvData);
    }
    else if (ext === '.csv') {
        const csvData = fs.readFileSync(filePath, 'utf8');
        const jsonData = csvToJson(csvData);
        fs.writeFileSync(path.join(outputDir, `${baseName}.json`), JSON.stringify(jsonData, null, 2));
    }
});
function jsonToCsv(jsonData) {
    // JSONデータがオブジェクトの場合、配列に変換
    if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
    }
    const headers = Object.keys(jsonData[0]);
    const csvRows = jsonData.map((row) => headers.map(fieldName => JSON.stringify(row[fieldName], (_, val) => val === null ? '' : val)).join(','));
    return headers.join(',') + '\n' + csvRows.join('\n');
}
function csvToJson(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}
