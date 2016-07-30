import React, { Component } from 'react';

import {
  Text,
  View,
} from 'react-native';

class Minutes extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    return (
      <View>
        <Text allowFontScaling={false} style={Styles.minutes}>{prediction.prdctdn}</Text>
        <Text allowFontScaling={false} style={Styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
}

class Stop extends React.Component {
  render() {
    var stop = this.props.stop;
    if (!stop) { return null; }
    return (
      <Text allowFontScaling={false} style={Styles.stop}>{stop.stpnm}</Text>
    );
  }
}

class Destination extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null; }
    return(
      <Text allowFontScaling={false} style={Styles.destination}>To {prediction.des}</Text>
    );
  }
}

class NextPrediction extends React.Component {
  render() {
    let prediction = this.props.prediction;
    if (!prediction) { return null };
    return(
      <Text allowFontScaling={false} style={Styles.nextPrediction}>{prediction.prdctdn} minutes</Text>
    );
  }
}

class Error extends React.Component {
  render() {
    let { error } = this.props;
    return (
      <Text allowFontScaling={false} style={Styles.nextPrediction}>
        {error.msg}
      </Text>
    )
  }
}

export default class PredictionsSummary extends React.Component {
  render() {
    return (
      {error &&
        <Error error={error} />
      }
      {!error &&
        <View>
          <Minutes predictions={this.props.predictions} />
          <Stop stop={this.props.selectedStop} />
          <Destination predictions={this.props.predictions} />
          <NextPrediction prediction={this.props.predictions && this.props.predictions[1]} />
          <NextPrediction prediction={this.props.predictions && this.props.predictions[2]} />
        </View>
      }
    );
  }
}
