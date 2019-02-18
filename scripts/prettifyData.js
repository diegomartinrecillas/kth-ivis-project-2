const fs = require("fs");
console.log("\n *START* \n");

let content = fs.readFileSync("../public/gdp-ppp.json");
content = JSON.parse(content);

const countries = {};

content.map(item => {
	countries[item.country] = {
		GDP_PPP: item
	};

})

console.log(countries)

console.log("\n *EXIT* \n");