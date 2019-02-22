import { pfx } from '../../utils/pfx';

const base = '@@app/map';

export const SET_CURRENT_COUNTRY = pfx(base,'SET_CURRENT_COUNTRY');
export const setCurrentCountry = country => {
	return { type: SET_CURRENT_COUNTRY, country }
}

export const CLEAR_CURRENT_COUNTRY = pfx(base,'CLEAR_CURRENT_COUNTRY');
export const clearCurrentCountry = () => {
	return { type: CLEAR_CURRENT_COUNTRY }
}

export const SET_SELECTED_COUNTRY = pfx(base,'SET_SELECTED_COUNTRY');
export const setSelectedCountry = country => {
	return async dispatch => dispatch({ type: SET_SELECTED_COUNTRY, country })
}

export const CLEAR_SELECTED_COUNTRY = pfx(base,'CLEAR_SELECTED_COUNTRY');
export const clearSelectedCountry = () => {
	return async dispatch => dispatch({ type: CLEAR_SELECTED_COUNTRY })
}

export const SET_ZOOM = pfx(base, 'SET_ZOOM');
export const setZoom = (zoom) => {
	return { type: SET_ZOOM, zoom }
}

export const INCREASE_ZOOM = pfx(base,'INCREASE_ZOOM');
export const increaseZoom = () => {
	return { type: INCREASE_ZOOM }
}

export const DECREASE_ZOOM = pfx(base,'DECREASE_ZOOM');
export const decreaseZoom = () => {
	return { type: DECREASE_ZOOM }
}

export const RESET_ZOOM = pfx(base,'RESET_ZOOM');
export const resetZoom = () => {
	return { type: RESET_ZOOM }
}

export const SET_CENTER = pfx(base,'SET_CENTER');
export const setCenter = center => {
	return { type: SET_CENTER, center }
}

export const ENABLE_OPTIMIZATION = pfx(base, 'ENABLE_OPTIMIZATION');
export const enableOptimization = () => {
	return { type: ENABLE_OPTIMIZATION }
}

export const DISABLE_OPTIMIZATION = pfx(base, 'DISABLE_OPTIMIZATION');
export const disableOptimization = () => {
	return { type: DISABLE_OPTIMIZATION }
}
