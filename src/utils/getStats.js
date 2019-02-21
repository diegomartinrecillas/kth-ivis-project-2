import {
	getYears
} from './getYears';

export const getStats = (wave, gapminder) => {
	const years = getYears(wave);

	return {
		hdi: getFirstYearWithData(years, gapminder['hdi_human_development_index']),
		population: getFirstYearWithData(years, gapminder['population_total']),
		gdpNominal: getFirstYearWithData(years, gapminder['total_gdp_us_inflation_adjusted']),
		gdpPPP: getFirstYearWithData(years, gapminder['total_gdp_ppp_inflation_adjusted']),
		corruption: getFirstYearWithData(years, gapminder['corruption_perception_index_cpi'])
	}
}

const getFirstYearWithData = (years, gapminder) => {
	for (let year of years) {
		if (gapminder[year]) {
			return {
				year,
				value: gapminder[year]
			}
		}
	}
	return {
		year: null,
		value: null
	}
}
