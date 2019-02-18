
import {
	INCREASE_ZOOM,
	DECREASE_ZOOM,
	CLEAR_CURRENT_COUNTRY,
	SET_CURRENT_COUNTRY,
	RESET_ZOOM,
	SET_CENTER,
	ENABLE_OPTIMIZATION,
	DISABLE_OPTIMIZATION
} from '../actions/';

const mapState = {
	currentCountry: {
		iso_n3: null,
		name: null
	},
	zoom: 1.5,
	center: [0, 0],
	optimize: true
}

export const map = (state = mapState, action) => {
	switch (action.type) {
		case CLEAR_CURRENT_COUNTRY: {
			return {
				...state,
				currentCountry: {
					iso_n3: null,
					name: null
				}
			}
		}
		case SET_CURRENT_COUNTRY: {
			return {
				...state,
				currentCountry: { ...action.country }
			}
		}
		case INCREASE_ZOOM: {
			let zoom = state.zoom * 2;
			zoom = zoom > 48 ? 48 : zoom;
			return {
				...state,
				zoom
			}
		}
		case DECREASE_ZOOM: {
			let zoom = state.zoom / 2;
			zoom = zoom < 1.5 ? 1.5 : zoom;
			return {
				...state,
				zoom
			}
		}
		case RESET_ZOOM: {
			return {
				...state,
				zoom: 1.5,
				center: [0, 0]
			}
		}
		case SET_CENTER: {
			return {
				...state,
				center: action.center
			}
		}
		case ENABLE_OPTIMIZATION: {
			return {
				...state,
				optimize: true
			}
		}
		case DISABLE_OPTIMIZATION: {
			return {
				...state,
				optimize: false
			}
		}
		default: return state;
	}
}
