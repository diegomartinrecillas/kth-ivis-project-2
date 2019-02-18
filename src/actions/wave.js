import { pfx } from '../utils/pfx';

const base = 'app/wave';

export const SET_WAVE = pfx(base,'SET_WAVE');
export const setWave = (wave) => {
	// changing a wave generates side effects which other actions might need to react too
	// using async / await allows us to use thenables wherever they might be needed
	return async (dispatch) => {
		await dispatch({ type: SET_WAVE, wave });
	}
}
