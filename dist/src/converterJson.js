// モジュール
import * as fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
const inputDir = './input/';
const outputDir = 'output/';
// input/配下のファイルを読み込んで中身を展開
const readInputFile = () => {
    // inputディレクトリ配下の全てのファイルを読み込む
    const files = fs.readdirSync(inputDir);
    // inputディレクトリ配下から読み込んだファイルを格納する変数の宣言と初期化
    const inputFilesData = [];
    // forEachを使ってInputディレクトリ配下から読み込んだファイルに処理をする(forEachの返り値はvoid)
    files.forEach((file) => {
        // fs.readFileSyncでInputディレクトリ配下から読み込んだファイルの中身をUTF8にエンコードして読み込み
        const readingFiles = fs.readFileSync(inputDir + file, 'utf-8');
        // JSON.parseで読み込んだファイルの中身をJSON形式に変換
        const jsonDatas = JSON.parse(readingFiles);
        // pushでinputFilesData配列にInputディレクトリ配下から読み込んだファイルの中身をJSON形式で追加
        inputFilesData.push(jsonDatas);
    });
    return inputFilesData;
};
// JSONオブジェクトのデータをCSVに変換する
const convertjsonToCsv = (filePath) => {
    // CSVレコードを格納するための空の配列を作成
    let records = [];
    // readInputFile()を呼び出してJSONオブジェクトを配列に格納する
    const jsonData = readInputFile();
    // jsonDataが配列である場合、各要素を処理する
    if (Array.isArray(jsonData)) {
        // jsonDataの各要素に対して処理を行う
        jsonData.forEach((property) => {
            // 各要素をフラット化し、records配列に追加する
            records.push(flatDataObject(property));
        });
    }
    else {
        // jsonDataが配列でない場合、単一のオブジェクトとしてフラット化しrecords配列に追加する
        records = [flatDataObject(jsonData)];
    }
    // CSVファイルのヘッダー情報の準備
    // ヘッダーはフラット化されたオブジェクトのキーとする
    const headers = Object.keys(records[0]).map(key => ({ id: key, title: key }));
    // CSVファイルを書き込むためのCSVライターを作成する
    const csvWriter = createObjectCsvWriter({
        // CSVファイルのパスは、元のJSONファイルの名前で生成する
        path: path.join(outputDir, path.basename(filePath, '.json') + '.csv'),
        // ヘッダー情報を指定する
        header: headers,
    });
    // レコードをCSVファイルに書き込む
    csvWriter.writeRecords(records);
};
// 読み込んだ配列データをObject形式にフラット化する
const flatDataObject = (data, prefix = "") => {
    // データがObject形式もしくはnullの時
    if (typeof data !== 'object' || data === null) {
        // JSONオブジェクトのプロパティ生成
        return { [prefix]: data };
    }
    // フラット化されたデータを格納するための新しいオブジェクトを初期化
    let flatedData = {};
    for (let key in data) {
        // データに存在するkeyをprefixとし、prefixが存在する時はprefix.keyを新たなJSONオブジェクトのプロパティのkeyにする
        let propertyPrefix = prefix ? `${prefix}.${key}` : key;
        // 現在のkeyに対応するvalueをflattenObjectを再帰的に呼び出してObject形式にフラット化する
        let flatData = flatDataObject(data[key], propertyPrefix);
        // フラット化されたデータを新しいキーと値を持つオブジェクトとして結合する
        Object.assign(flatedData, flatData);
    }
    // フラット化したオブジェクトを返却する
    return flatedData;
};
// inputディレクトリのファイルを読み込み、変換を実施
fs.readdirSync(inputDir).forEach(file => {
    const filePath = path.join(inputDir, file);
    convertjsonToCsv(filePath);
});
