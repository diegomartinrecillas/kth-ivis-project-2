import { SET_VALUE, SET_WAVE } from './actions'

const waveState = {
	selected: '6',
	value: 'Democracy'
}

export const wave = (state = waveState, action) => {
	switch (action.type) {
		case SET_WAVE: {
			return {
				...state,
				selected: action.wave || state.selected
			}
		}
		case SET_VALUE: {
			return {
				...state,
				value: action.value
			}
		}
		default: return state;
	}
}
