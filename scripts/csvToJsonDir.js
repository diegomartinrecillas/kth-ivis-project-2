const fs = require('fs');
const csv2json = require('csvjson-csv2json');
const path = require('path')

const wave = '1';

const inputWaveFolder = `../data/Wave ${wave}/CSV`;
const inputGapminderFolder = `../data/Gapminder`;

const loadWVSData = () => {
	const data = {};
	for (let fileName of fs.readdirSync(inputWaveFolder)) {
		if (path.extname(fileName) === '.csv') {
			fileName = fileName.replace(/\.[^/.]+$/, '');
			const file = fs.readFileSync(`${inputWaveFolder}/${fileName}.csv`, 'utf8');
			const json = csv2json(file, {
				parseNumbers: true
			});
			data[fileName] = json;
		}
	}
	return data;
}

const loadGapminderData = () => {
	const data = {};
	for (let fileName of fs.readdirSync(inputGapminderFolder)) {
		if (path.extname(fileName) === '.csv') {
			fileName = fileName.replace(/\.[^/.]+$/, '');
			const file = fs.readFileSync(`${inputGapminderFolder}/${fileName}.csv`, 'utf8');
			const json = csv2json(file, {
				parseNumbers: true
			});
			data[fileName] = json;
		}
	}
	return data;
}

const rawStr = (string) => {
	if (!string) return '';
	return string.toLowerCase().replace(/\s/g, '');
}

const getCountryWaveData = (wvsData, properties) => {
	const values = Object.keys(wvsData);
	const data = {};

	for (let value of values) {
		if (data[value] == null) data[value] = [];
		for (let row of wvsData[value]) {
			let cells = Object.keys(row);
			let option = row['OPTION'];
			let match = cells.find(cell => rawStr(cell) == rawStr(properties.name))
			if (match) {
				data[value].push({ [option]: row[match] });
			}
		}
	}
	return data;
}

const getCountryGapminderData = (gmData, properties) => {
	const values = Object.keys(gmData);
	const data = {};

	for (let value of values) {
		if (data[value] == null) data[value] = {};
		for (let row of gmData[value]) {
			let countryName = row['country']
			if (rawStr(countryName) == rawStr(properties.name)) {
				delete row['country'];
				data[value] = row;
			}
		}
	}
	return data;
}

console.log('...STARTING...');

const gapminderData = loadGapminderData();
const wvsData = loadWVSData();
const topo = fs.readFileSync(`../public/world-50m-with-wvs.json`, 'utf8');
const topoJSON = JSON.parse(topo);
const geometries = topoJSON['objects']['units']['geometries'];

for (let geometry of geometries) {
	const properties = geometry['properties'];
	if (!properties.name) return;
	if (properties['wvs'] == null) properties['wvs'] = {};
	properties['wvs'][`w_${wave}`] = getCountryWaveData(wvsData, properties);
	properties['gapminder'] = getCountryGapminderData(gapminderData, properties);
}

fs.writeFileSync(`../public/world-50m-with-wvs.json`, JSON.stringify(topoJSON).replace(/\uFFFD/g, ''));

console.log('DONE!!!')
