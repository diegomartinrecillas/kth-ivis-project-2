import { combineReducers } from 'redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { general } from './general/reducer';
import { map } from './map/reducer';
import { wave } from './wave/reducer';
import { stats } from './stats/reducer';

const reducers = combineReducers({
	general,
	map,
	stats,
	wave,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export store
export const store = createStore(
	reducers,
	composeEnhancer(applyMiddleware(thunk))
);

// export actions
export * from './map/actions';
export * from './stats/actions';
export * from './wave/actions';
