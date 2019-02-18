import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';

import ReactTooltip from 'react-tooltip';
import { scaleLinear } from "d3-scale"

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong'

import { increaseZoom, decreaseZoom, clearCurrentCountry, setCurrentCountry, resetZoom, setCenter } from '../actions/map';

import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps';

import './WorldMap.scss';

const popScale = scaleLinear()
	.domain([0, 100000000, 1400000000])
	.range(["#4caf50", "#ffeb3b", "#f44336"])

class WorldMap extends Component {
	componentDidUpdate() {
		ReactTooltip.rebuild();
	}

	handleMove = (geography, evt) => {
		const { iso_n3, name } = geography.properties;
		this.props.setCountry({ iso_n3, name });
	}

	handleLeave = () => {
		this.props.clearCountry();
	}

	handleClick = (geography, evt) => {
		console.log(this.props)
	}

	renderTooltip = (geography) => {
		const { name } = geography.properties
		console.log('tooltips generated')

		return renderToString(
			<div className="tooltip">{name}</div>
		)
	}

	numberWithCommas(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	disableReset() {
		const { props } = this;
		return !(props.zoom !== 1.5 || props.center[0] !== 0 || props.center[1] !== 0);
	}

	render() {
		const { props } = this;
		return (
			<div className="world-map">
				<div className="map-container">
					<div className="zoom-controls">
						<div className="zoom-control">
							<Fab className="zoom-control" disabled={this.disableReset()} size="small" color="primary" onClick={props.resetZoom} >
								<CenterFocusStrongIcon />
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
							<Geographies geography="world-50m-with-population.json" disableOptimization={!props.optimize}>
								{(geographies, projection) =>
									geographies.map((geography, i) => (
										<Geography
											key={`${geography.properties.iso_a3}-${i}`}
											cacheId={`${geography.properties.iso_a3}-${i}`}
											data-tip={this.renderTooltip(geography)}
											data-html={true}
											geography={geography}
											projection={projection}
											onMouseMove={this.handleMove}
											onMouseLeave={this.handleLeave}
											onClick={this.handleClick}
											round
											style={{
												default: {
													fill: props.wave == '6'
													? popScale(geography.properties.pop_est)
													: '#CFD8DC',
													stroke: "#607D8B",
													strokeWidth: 0.75,
													outline: "none"
												},
												hover: {
													fill: "#f50057",
													stroke: "#607D8B",
													strokeWidth: 0.75,
													outline: "none",
													cursor: 'pointer'
												},
												pressed: {
													fill: "#ff5983",
													stroke: "#607D8B",
													strokeWidth: 0.75,
													outline: "none",
													cursor: 'grab'
												},
											}}
										/>
									))
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
	zoom: state.map.zoom,
	center: state.map.center,
	title: state.app.title,
	wave: state.wave.selected
});

const mapDispatchToProps = dispatch => {
	return {
		clearCountry: () => {
			dispatch(clearCurrentCountry());
		},
		setCountry: country => {
			dispatch(setCurrentCountry(country));
		},
		increaseZoom: () => {
			dispatch(increaseZoom());
		},
		decreaseZoom: () => {
			dispatch(decreaseZoom());
		},
		resetZoom: () => {
			dispatch(resetZoom());
		},
		setCenter: (center) => {
			dispatch(setCenter(center));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);
