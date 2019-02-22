
import {
	INCREASE_ZOOM,
	DECREASE_ZOOM,
	CLEAR_CURRENT_COUNTRY,
	SET_CURRENT_COUNTRY,
	RESET_ZOOM,
	SET_CENTER,
	ENABLE_OPTIMIZATION,
	DISABLE_OPTIMIZATION,
	SET_SELECTED_COUNTRY,
	CLEAR_SELECTED_COUNTRY,
	SET_ZOOM
} from './actions';

const mapState = {
	currentCountry: null, // name: string, iso_n3: string
	selectedCountry: null, // name: string, iso_n3: string
	zoom: 1.5,
	center: [0, 20],
	optimize: true
}

export const map = (state = mapState, action) => {
	switch (action.type) {
		case CLEAR_CURRENT_COUNTRY: {
			return {
				...state,
				currentCountry: null
			}
		}
		case SET_CURRENT_COUNTRY: {
			return {
				...state,
				currentCountry: { ...action.country }
			}
		}
		case CLEAR_SELECTED_COUNTRY: {
			return {
				...state,
				selectedCountry: null
			}
		}
		case SET_SELECTED_COUNTRY: {
			return {
				...state,
				selectedCountry: { ...action.country }
			}
		}
		case SET_ZOOM: {
			return {
				...state,
				zoom: action.zoom
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
				center: [0, 20]
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
