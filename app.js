/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';

import {TripsLayer} from '@deck.gl/geo-layers';

var tripss = require('./test2.json');
// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoidWNmbmhheCIsImEiOiJjanN0Z3A2dGkwdm40NDZyd2RmbTdnbmxqIn0.mFwbgUrX7ZMvFTsltD7jAA'; // eslint-disable-line

// Source data CSV

const TRIPS = tripss

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = new PhongMaterial({
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
});

export const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 3,
  pitch: 45,
  bearing: 0
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 24*3600, // unit corresponds to the timestamp in source data
      animationSpeed = 300 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 100;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime)/ loopTime) * loopLength +1517443200
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }
  
  _renderLayers() {
    const {trips = tripss, trailLength = 180} = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: tripss,
        getPath: d => d.trips,
        getColor: [253, 128, 93],
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength:10000,
        currentTime: this.state.time
      }),
      
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
