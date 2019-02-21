import {
	SET_STATS
} from './actions'

const statsState = {
	hdi: {
		year: null,
		value: null
	},
	population: {
		year: null,
		value: null
	},
	gdpNominal: {
		year: null,
		value: null
	},
	gdpPPP: {
		year: null,
		value: null
	},
	perCapitaGdpNominal: {
		year: null,
		value: null
	},
	perCapitaGdpPPP: {
		year: null,
		value: null
	},
	corruption: {
		year: null,
		value: null
	}
}

export const stats = (state = statsState, action) => {
	switch (action.type) {
		case SET_STATS:
			{
				return {
					...action.stats,
					perCapitaGdpNominal: {
						year: action.stats.gdpNominal ? action.stats.gdpNominal.year : null,
						value: action.stats.gdpNominal ?
							action.stats.gdpNominal.value / action.stats.population.value : {
								value: null,
								year: null
							}
					},
					perCapitaGdpPPP: {
						year: action.stats.gdpPPP ? action.stats.gdpPPP.year : null,
						value: action.stats.gdpPPP ?
							action.stats.gdpPPP.value / action.stats.population.value : {
								value: null,
								year: null
							}
					}
				}
			}
		default:
			return state;
	}
}
