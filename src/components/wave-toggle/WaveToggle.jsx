import React, { Component } from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { enableOptimization, disableOptimization, setValue, setWave } from '../../store';

import { values } from '../../utils/constants';

import './WaveToggle.scss';


class WaveToggle extends Component {
	state = {
    labelWidth: 0
	}

	setWave = (_, wave) => {
		this.props.setWave(wave)
	};

	handleValueChange = event => {
		this.props.setValue(event.target.value);
	}

	render() {
		const { props } = this;
		return (
			<div className="wave-picker">
				<div className="toggle-container">
					<ToggleButtonGroup value={props.wave} exclusive onChange={this.setWave}>
						<ToggleButton value="1">
							1981-1984
            </ToggleButton>
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

				<div className="value-select">
					<FormControl variant="outlined" style={{ borderRadius: 4, backgroundColor: '#fafafa', minWidth: 200 }}>
						<Select
							native
							style={{ color: '#777', fontSize: 14 }}
							value={props.value}
							onChange={this.handleValueChange}
							input={<OutlinedInput labelWidth={0} name="value" />}>
							<option value={'Happiness'}>{values['Happiness']}</option>
							<option value={'Democracy'}>{values['Democracy']}</option>
							<option value={'Democratic_system'}>{values['Democratic_system']}</option>
							<option value={'Technocratic_system'}>{values['Technocratic_system']}</option>
							<option value={'Authoritarian_system'}>{values['Authoritarian_system']}</option>
							<option value={'Military_system'}>{values['Military_system']}</option>
							<option value={'Religious_vote'}>{values['Religious_vote']}</option>
							<option value={'Human_rights'}>{values['Human_rights']}</option>
						</Select>
					</FormControl>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	wave: state.wave.selected,
	value: state.wave.value
});

const mapDispatchToProps = dispatch => {
	return {
		setValue: value => {
			// disable optimization on the map so it it's data can be refreshed
			dispatch(disableOptimization());
			// update the current wave
			dispatch(setValue(value))
				// re-enable optimization on the map after we are sure side effects have taken place
				.then(() => dispatch(enableOptimization()))

		},
		setWave: wave => {
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
