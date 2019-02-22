import React, { Component } from 'react';
import { connect } from 'react-redux';

import Draggable from 'react-draggable';

import { Paper, Fab } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { clearSelectedCountry, disableOptimization, enableOptimization } from '../../store';

import { gapminder } from '../../utils/constants';

import './CountryStats.scss';

class CountryStats extends Component {
	numberWithCommas(number) {
		if (!number) return '';
		return number.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	renderAsCurrency(number) {
		const currency = this.numberWithCommas(number);
		return currency ? `USD ${currency}` : '-';
	}

	renderCorruption(index) {
		return  index ? `${index} out of 100` : '-';
	}

	render() {
		const { props } = this;
		return (
			<>
				{props.country &&
					<Draggable>
						<Paper style={{ backgroundColor: '#333' }} className="country-stats">
							<Fab style={{ backgroundColor: '#37474f', color: '#fafafa', position: 'absolute', right: -10, top: -10, zIndex: 9999 }} size="small" disabled={props.zoom <= 1.5} onClick={props.clearSelectedCountry} >
								<Close />
							</Fab>
							<h2>{props.country.name}</h2>
							<div className="stat">
								<div className="stat-item">{gapminder.population_total}</div>
								<div className="stat-item stat-item_data">
									{this.numberWithCommas(props.stats.population.value) || '-'}
									<br />
									<span className="year-legend">{props.stats.population.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.hdi_human_development_index}</div>
								<div className="stat-item stat-item_data">
									{props.stats.hdi.value || '-'}
									<br />
									<span className="year-legend">{props.stats.hdi.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.total_gdp_us_inflation_adjusted}</div>
								<div className="stat-item stat-item_data">
									{this.renderAsCurrency(props.stats.gdpNominal.value)}
									<br />
									<span className="year-legend">{props.stats.gdpNominal.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.total_gdp_us_inflation_adjusted} per capita</div>
								<div className="stat-item stat-item_data">
									{this.renderAsCurrency(props.stats.perCapitaGdpNominal.value)}
									<br />
									<span className="year-legend">{props.stats.perCapitaGdpNominal.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.total_gdp_ppp_inflation_adjusted}</div>
								<div className="stat-item stat-item_data">
									{this.renderAsCurrency(props.stats.gdpPPP.value)}
									<br />
									<span className="year-legend">{props.stats.gdpPPP.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.total_gdp_ppp_inflation_adjusted} per capita</div>
								<div className="stat-item stat-item_data">
									{this.renderAsCurrency(props.stats.perCapitaGdpPPP.value)}
									<br />
									<span className="year-legend">{props.stats.perCapitaGdpPPP.year}</span>
								</div>
							</div>
							<div className="stat">
								<div className="stat-item">{gapminder.corruption_perception_index_cpi}</div>
								<div className="stat-item stat-item_data">
									{this.renderCorruption(props.stats.corruption.value)}<br />
									<span className="year-legend">{props.stats.corruption.year}</span>
								</div>
							</div>
						</Paper>
					</Draggable>
				}
			</>
		)
	}
}

const mapStateToProps = state => ({
	country: state.map.selectedCountry,
	stats: state.stats
});

const mapDispatchToProps = dispatch => {
	return {
		clearSelectedCountry: wave => {
			// disable optimization on the map so it it's data can be refreshed
			dispatch(disableOptimization());
			// update the current wave
			dispatch(clearSelectedCountry())
				// re-enable optimization on the map after we are sure side effects have taken place
				.then(() => dispatch(enableOptimization()))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryStats);
