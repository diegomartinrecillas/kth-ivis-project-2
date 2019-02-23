import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';

import ReactTooltip from 'react-tooltip';
import { Motion, spring } from "react-motion"
import { scaleLinear } from 'd3-scale';
import { geoPath } from 'd3-geo';
import { geoTimes } from 'd3-geo-projection';

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
	setStats,
	setZoom
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
	ignoreClick = false

	state = {
		height: null,
		width: null,
		virtualCenter: null
	}

	componentWillMount() {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth,
			virtualCenter: this.props.center
		})
	}

	componentDidUpdate() {
		ReactTooltip.rebuild();
	}

	scale = (domain) => scaleLinear()
		.domain(domain)
		.range(["#f44336", "#ffeb3b", "#4caf50"])

	handleClick = (geography, evt) => {
		// if (this.ignoreClick) return;

		const { iso_n3, name, gapminder } = geography.properties;

		this.props.setStats(getStats(this.props.wave, gapminder));
		this.props.setSelectedCountry({ iso_n3, name, gapminder })
			.then(() => {
				const path = geoPath().projection(this.projection())
				const centroid = this.projection().invert(path.centroid(geography))

				this.props.setCenter(centroid);
				this.props.setZoom(3);
			});
	}

	handleMoveStart = (center) => {
		this.ignoreClick = true;
	}

	handleMoveEnd = (center) => {
		this.ignoreClick = this.compareWitPrecision(center, this.state.virtualCenter, 12);
		this.setState({ virtualCenter: center });
	}

	compareWitPrecision(newCenter, center, precision) {
		newCenter = [Number(newCenter[0].toFixed(precision)), Number(newCenter[1].toFixed(precision))]
		center = [Number(center[0].toFixed(precision)), Number(center[1].toFixed(precision))]
		return JSON.stringify(center) !== JSON.stringify(newCenter);
	}

	numberWithCommas(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	disableReset() {
		const { zoom } = this.props;
		const { virtualCenter } = this.state;
		return !(zoom !== 1.5 || virtualCenter[0] !== 0 || virtualCenter[1] !== 20);
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

	projection = () => {
		return geoTimes()
			.translate([this.state.width / 2, this.state.height / 2])
			.scale(180)
	}

	render() {
		const { height, width } = this.state;
		const { center, zoom, increaseZoom, decreaseZoom, resetZoom, optimize, selectedCountry } = this.props;

		return (
			<div className="world-map">
				<div className="map-container">
					<div className="legend"></div>
					<div className="zoom-controls">
						<div className="zoom-control">
							<Fab className="zoom-control" disabled={this.disableReset()} size="small" color="primary" onClick={resetZoom} >
								<MyLocation />
							</Fab>
						</div>
						<div className="zoom-control">
							<Fab size="small" color="secondary" disabled={zoom >= 48} onClick={increaseZoom}>
								<AddIcon />
							</Fab>
						</div>
						<div className="zoom-control">
							<Fab className="zoom-control" size="small" color="default" disabled={zoom <= 1.5} onClick={decreaseZoom} >
								<RemoveIcon />
							</Fab>
						</div>
					</div>
					<Motion
						defaultStyle={{
							motionZoom: 1,
							x: 0,
							y: 20,
						}}
						style={{
							motionZoom: spring(zoom, { stiffness: 210, damping: 20 }),
							x: spring(center[0], { stiffness: 210, damping: 20 }),
							y: spring(center[1], { stiffness: 210, damping: 20 }),
						}}
					>
						{({ motionZoom, x, y }) => (
							<ComposableMap className="map" height={height} width={width} projection={this.projection} >
								<ZoomableGroup onMoveStart={this.handleMoveStart} onMoveEnd={this.handleMoveEnd} center={[x, y]} zoom={motionZoom} style={{ cursor: 'grab' }} >
									<Geographies geography="world-50m-with-wvs.json" disableOptimization={!optimize}>
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
																fill: ((selectedCountry && selectedCountry.iso_n3 === geography.properties.iso_n3)) ?
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
						)}
					</Motion>
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
		setSelectedCountry: async country => {
			// disable optimization on the map so it it's data can be refreshed
			dispatch(disableOptimization());
			// update the current wave
			await dispatch(setSelectedCountry(country))
				// re-enable optimization on the map after we are sure side effects have taken place
				.then(() => dispatch(enableOptimization()))
		},
		setStats: stats => dispatch(setStats(stats)),
		setZoom: zoom => dispatch(setZoom(zoom))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);
