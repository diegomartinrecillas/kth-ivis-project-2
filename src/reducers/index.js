import { combineReducers } from 'redux'

import { app } from './app';
import { map } from './map';
import { wave } from './wave';

export const reducers = combineReducers({
	app,
	map,
	wave
});