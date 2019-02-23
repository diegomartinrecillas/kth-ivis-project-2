import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';

import WorldMap from './components/world-map/WorldMap';
import WaveToggle from './components/wave-toggle/WaveToggle';
import CountryStats from './components/country-stats/CountryStats';
import { Button } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';

class App extends Component {
	render() {
		return (
			<>
				<WaveToggle />
				<WorldMap />
				<CountryStats />
				<div className="download-buttons">
					<a target="_blank" rel="noopener noreferrer" href="https://firebasestorage.googleapis.com/v0/b/kth-ivis19-project2.appspot.com/o/Discovery%201.pdf?alt=media&token=ef46a73c-16a3-4842-8cf7-cb3d3385c243">
						<Button style={{ marginRight: 5 }} size="small" color="primary" variant="contained">
							<CloudDownload /><span style={{ paddingLeft: 5 }}>Discovery 1</span>
						</Button>
					</a>
					<a target="_blank" rel="noopener noreferrer"  href="https://firebasestorage.googleapis.com/v0/b/kth-ivis19-project2.appspot.com/o/Discovery%202.pdf?alt=media&token=5ac1c65f-b022-45dc-8bbd-04bfd0a3bdbf">
						<Button size="small" color="secondary" variant="contained">
							<CloudDownload /><span style={{ paddingLeft: 5 }}>Discovery 2</span>
						</Button>
					</a>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	title: state.general.title
});


export default connect(mapStateToProps)(App);

