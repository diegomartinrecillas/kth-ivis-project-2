import { pfx } from '../../utils/pfx';
import { getStats } from '../../utils/getStats';
import { SET_STATS } from '../stats/actions';

const base = '@@app/wave';

export const SET_WAVE = pfx(base,'SET_WAVE');
export const setWave = nextWave => {
	// changing a wave generates side effects which other actions might need to react too
	// using async / await allows us to use thenables wherever they might be needed
	return async (dispatch, getState) => {
		await dispatch({ type: SET_WAVE, wave: nextWave });
		const { wave, map } = getState();
		if (!map.selectedCountry) return;
		dispatch({ type: SET_STATS, stats: getStats(wave.selected, map.selectedCountry.gapminder) });
	}
}

export const SET_VALUE = pfx(base, 'SET_VALUE');
export const setValue = value => {
	return async (dispatch) =>  {
		await dispatch({ type: SET_VALUE, value });
	}
}
