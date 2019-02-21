import { pfx } from '../../utils/pfx';

const base = '@@app/stats';

export const SET_STATS = pfx(base,'SET_STATS');
export const setStats = stats => {
	return { type: SET_STATS, stats }
}
