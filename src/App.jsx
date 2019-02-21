import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';

import WorldMap from './components/world-map/WorldMap';
import WaveToggle from './components/wave-toggle/WaveToggle';
import CountryStats from './components/country-stats/CountryStats';


class App extends Component {
  render() {
    return (
      <>
        <WaveToggle />
        <WorldMap />
				<CountryStats />
      </>
    );
  }
}

const mapStateToProps = state => ({
	title: state.general.title
});


export default connect(mapStateToProps)(App);

