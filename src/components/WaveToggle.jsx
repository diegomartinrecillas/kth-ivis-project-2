import React, { Component } from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { enableOptimization, disableOptimization, setWave } from '../actions/';


const toggleContainer = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	margin: `20px`
};

class WaveToggle extends Component {
	setWave = (_, wave) => this.props.setWave(wave);

	render() {
		const { props } = this;
		return (
			<div className={props.className}>
				<div style={toggleContainer}>
					<ToggleButtonGroup value={props.wave} exclusive onChange={this.setWave}>
						<ToggleButton value="2">
							1990-1994
            </ToggleButton>
						<ToggleButton value="3">
							1995-1998
            </ToggleButton>
						<ToggleButton value="4">
							1999-2004
            </ToggleButton>
						<ToggleButton value="5">
							2005-2009
              </ToggleButton>
						<ToggleButton value="6">
							2010-2014
            </ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	wave: state.wave.selected
});

const mapDispatchToProps = dispatch => {
	return {
		setWave: (wave) => {
			// disable optimization on the map so it it's data can be refreshed
			dispatch(disableOptimization());
			// update the current wave
			dispatch(setWave(wave))
				// re-enable optimization on the map after we are sure side effects have taken place
				.then(() => dispatch(enableOptimization()))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveToggle);
