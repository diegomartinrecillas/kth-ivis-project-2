import { SET_WAVE } from '../actions/'

const waveState = {
	selected: '6'
}

export const wave = (state = waveState, action) => {
	switch (action.type) {
		case SET_WAVE: {
			return {
				...state,
				selected: action.wave || state.selected
			}
		}
		default: return state;
	}
}
