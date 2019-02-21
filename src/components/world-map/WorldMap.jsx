import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';

import ReactTooltip from 'react-tooltip';
import { scaleLinear } from "d3-scale"

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { MyLocation } from '@material-ui/icons'

import {
	clearCurrentCountry,
	decreaseZoom,
	disableOptimization,
	enableOptimization,
	increaseZoom,
	resetZoom,
	setCenter,
	setCurrentCountry,
	setSelectedCountry,
	setStats
} from '../../store';

import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps';

import { getStats } from '../../utils/getStats';

import './WorldMap.scss';


class WorldMap extends Component {
	componentDidUpdate() {
		ReactTooltip.rebuild();
	}

	scale = (domain) => scaleLinear()
		.domain(domain)
		.range(["#f44336", "#ffeb3b", "#4caf50"])

	handleClick = (geography, evt) => {
		const { iso_n3, name, gapminder } = geography.properties;

		this.props.setStats(getStats(this.props.wave, gapminder));
		this.props.setSelectedCountry({ iso_n3, name, gapminder });
	}

	numberWithCommas(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	disableReset() {
		const { props } = this;
		return !(props.zoom !== 1.5 || props.center[0] !== 0 || props.center[1] !== 20);
	}

	reduceValue = geography => {
		const answers = this.getAnswers(geography);
		if (!answers) return;

		const firstValue = answers[0] && Object.values(answers[0])[0];
		const secondValue = answers[0] && Object.values(answers[1])[0] * .5;

		if (secondValue > firstValue) {
			return secondValue > 50 ? 50 : secondValue;
		}

		return firstValue > 50 ? 50 : firstValue;
	}

	getAnswers(geography) {
		const wave = geography.properties.wvs[`w_${this.props.wave}`];
		return wave[this.props.value];
	}

	renderTooltip = (geography) => {
		const { name } = geography.properties
		const answers = this.getAnswers(geography);

		return renderToString(
			<div className="tooltip">
				<h3>{name}</h3>
				{answers && (answers).map((answer, index) => {
					const option = Object.keys(answer)[0];
					const response = Object.values(answer)[0];
					return (
						<div className="tooltip-answers" key={index}>
							<div className="tooltip-item">{option}</div>
							<div className="tooltip-item">{response}%</div>
						</div>
					)
				})}
			</div>
		)
	}

	render() {
		const { props } = this;
		return (
			<div className="world-map">
				<div className="map-container">
					<div className="legend"></div>
					<div className="zoom-controls">
						<div className="zoom-control">
							<Fab className="zoom-control" disabled={this.disableReset()} size="small" color="primary" onClick={props.resetZoom} >
								<MyLocation />
							</Fab>
						</div>
						<div className="zoom-control">
							<Fab size="small" color="secondary" disabled={props.zoom >= 48} onClick={props.increaseZoom}>
								<AddIcon />
							</Fab>
						</div>
						<div className="zoom-control">
							<Fab className="zoom-control" size="small" color="default" disabled={props.zoom <= 1.5} onClick={props.decreaseZoom} >
								<RemoveIcon />
							</Fab>
						</div>
					</div>
					<ComposableMap className="map" height={window.innerHeight} width={window.innerWidth}>
						<ZoomableGroup onMoveEnd={props.setCenter} center={props.center} zoom={props.zoom} style={{ cursor: 'grab' }} >
							<Geographies geography="world-50m-with-wvs.json" disableOptimization={!props.optimize}>
								{(geographies, projection) =>
									geographies.map((geography, i) => {
										const value = this.reduceValue(geography);

										return (
											geography.properties.iso_a3 !== 'ATA' &&
											<Geography
												key={`${geography.properties.iso_n3}-${i}`}
												cacheId={`${geography.properties.iso_n3}-${i}`}
												data-tip={value ? this.renderTooltip(geography) : null}
												data-html={true}
												geography={geography}
												projection={projection}
												// onMouseMove={this.handleMove}
												// onMouseLeave={this.handleLeave}
												onClick={this.handleClick}
												round
												style={{
													default: {
														fill: ((props.selectedCountry && props.selectedCountry.iso_n3 === geography.properties.iso_n3)) ?
															'#f50057' : this.scale([0, 25, 50])(value) || '#cfd8dc',
														stroke: "#607D8B",
														strokeWidth: 0.75,
														outline: "none"
													},
													hover: {
														fill: value ? '#f50057' : '#ff5983',
														stroke: "#607D8B",
														strokeWidth: 0.75,
														outline: "none",
														cursor: 'pointer'
													},
													pressed: {
														fill: value ? '#ff5983' : '#cfd8dc',
														stroke: "#607D8B",
														strokeWidth: 0.75,
														outline: "none",
														cursor: 'grab'
													},
												}}
											/>
										)
									})
								}
							</Geographies>
						</ZoomableGroup>
					</ComposableMap>
					<ReactTooltip />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	optimize: state.map.optimize,
	country: state.map.currentCountry,
	selectedCountry: state.map.selectedCountry,
	zoom: state.map.zoom,
	center: state.map.center,
	wave: state.wave.selected,
	value: state.wave.value,
	stats: state.stats
});

const mapDispatchToProps = dispatch => {
	return {
		clearCountry: () => dispatch(clearCurrentCountry()),
		setCountry: country => dispatch(setCurrentCountry(country)),
		increaseZoom: () => dispatch(increaseZoom()),
		decreaseZoom: () => dispatch(decreaseZoom()),
		resetZoom: () => dispatch(resetZoom()),
		setCenter: center => dispatch(setCenter(center)),
		setSelectedCountry: country => {
			// disable optimization on the map so it it's data can be refreshed
			dispatch(disableOptimization());
			// update the current wave
			dispatch(setSelectedCountry(country))
				// re-enable optimization on the map after we are sure side effects have taken place
				.then(() => dispatch(enableOptimization()))
		},
		setStats: stats => dispatch(setStats(stats))
}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);
