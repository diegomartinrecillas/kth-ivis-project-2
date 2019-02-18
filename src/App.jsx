import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';

import WorldMap from './components/WorldMap';
import WaveToggle from './components/WaveToggle';


class App extends Component {
  render() {
    return (
      <>
        <WaveToggle className="wave-picker"/>
        <WorldMap />
      </>
    );
  }
}

const mapStateToProps = state => ({
	title: state.app.title
});


export default connect(mapStateToProps)(App);

