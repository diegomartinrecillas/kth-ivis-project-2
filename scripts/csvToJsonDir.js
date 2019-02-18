const fs = require('fs');
const csv2json = require('csvjson-csv2json');
const path = require('path')

const inputFolder = '../data/Wave 3/CSV';
const outputFolder = '../data/Wave 3/JSON';

fs.readdirSync(inputFolder).forEach(fileName => {
	if (path.extname(fileName) === '.csv') {
		fileName = fileName.replace(/\.[^/.]+$/, '');

		const file = fs.readFileSync(`${inputFolder}/${fileName}.csv`, 'utf8');
		const json = csv2json(file, {parseNumbers: true});
		const serializedData = JSON.stringify(json);

		fs.writeFileSync(`${outputFolder}/${fileName}.json`, serializedData);
	}
});