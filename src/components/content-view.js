import React, { Component } from 'react';

import {
  ActivityIndicator,
  AppState,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import UserActions from '../../src/actions/user';

class Directions extends Component {
  constructor() {
    super();
    this._prettyName = this._prettyName.bind(this);
  }

  render() {
    var directions = this.props.directions || [];
    return (
      <View style={Styles.directions}>
        { directions.map((direction, i) =>
          <TouchableOpacity key={i} style={Styles.direction} onPress={() => this.props.onChooseDirection(direction)}>
            <Text allowFontScaling={false} style={direction.dir == this.props.selectedDirection.dir ? Styles.directionTextActive : Styles.directionText}>
              {this._prettyName(direction.dir)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  _prettyName(fullDirectionName) {
    var DIRECTION_NAME_MAP = {
      "Northbound" : "North",
      "Southbound" : "South",
      "Eastbound"  : "East",
      "Westbound"  : "West",
      "North Bound" : "North",
      "South Bound" : "South",
      "East Bound"  : "East",
      "West Bound"  : "West",
    };

    return DIRECTION_NAME_MAP[fullDirectionName];
  }
}

class ContentViewHeader extends Component {
  render() {
    let activeRoute = this.props.activeRoute || { rtnm: "Choose Route", rt: "" };

    return (
      <View style={Styles.contentViewHeader}>
        <Button onPress={this.props.onLeftButtonPress}  />
        <View style={Styles.contentViewHeaderRouteNumberAndNameContainer}>
          <View style={activeRoute.rt && Styles.contentViewHeaderRouteNumberContainer}>
            <Text allowFontScaling={false} style={Styles.contentViewHeaderRouteNumber}>
              {activeRoute.rt}
            </Text>
          </View>
          <Text allowFontScaling={false} style={Styles.contentViewHeaderRouteName}>
            {activeRoute.rtnm}
          </Text>
        </View>
        <View style={Styles.contentViewHeaderDummyRightSpace}></View>
      </View>
    );
  }
}

class Button extends Component  {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image style={Styles.contentViewHeaderIcon} source={require('../../src/assets/images/contentViewHeaderIcon.png')} />
      </TouchableOpacity>
    );
  }
}

class Minutes extends Component {

  render() {
    let prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    return (
      <View>
        <Text allowFontScaling={false} style={Styles.minutes}>{prediction.prdctdn}</Text>
        <Text allowFontScaling={false} style={Styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
}

class Stop extends Component {
  render() {
    var stop = this.props.stop;
    if (!stop) { return null; }

    return (
      <Text allowFontScaling={false} style={Styles.stop}>{stop.stpnm}</Text>
    );
  }
}

class Destination extends Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null; }

    return(
      <Text allowFontScaling={false} style={Styles.destination}>To {prediction.des}</Text>
    );
  }
}

class NextPrediction extends Component {
  render() {
    let prediction = this.props.prediction;
    if (!prediction) { return null };
    return(
      <Text allowFontScaling={false} style={Styles.nextPrediction}>{prediction.prdctdn} minutes</Text>
    );
  }
}

class Error extends Component {
  render() {
    let { error } = this.props;
    return (
      <Text allowFontScaling={false} style={Styles.nextPrediction}>
        {error.msg}
      </Text>
    )
  }
}

export default class ContentView extends Component {
  constructor(props) {
    super(props);
    this._onRefresh = this._onRefresh.bind(this);
    this.state = {
        predictions: props.predictions,
        isRefreshing: false,
        // isLoading: true,
      };
  }

  render() {
    let { activeRoute, error } = this.props;
    let predictionView;
    let isLoading = this.state.isLoading;
    if (isLoading) {
      predictionView = <ActivityIndicator style={Styles.contentViewActivityIndicator} size="small" color="#6280B8"/>
    } else {
      predictionView =
        <View>
          <Minutes predictions={this.props.predictions} />
          <Stop stop={this.props.selectedStop} />
          <Destination predictions={this.props.predictions} />
          <NextPrediction prediction={this.props.predictions && this.props.predictions[1]} />
          <NextPrediction prediction={this.props.predictions && this.props.predictions[2]} />
        </View>
    }
    return (
      <View style={Styles.contentView}>
        <ContentViewHeader activeRoute={activeRoute} onLeftButtonPress={this.props.onLeftButtonPress} />
          <ScrollView
            style={Styles.container}
            activeRoute={activeRoute}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#FFF"
                title=""
              />
            }
          >
            <Directions directions={this.props.directions} selectedDirection={this.props.selectedDirection} onChooseDirection={this.props.onChooseDirection} />
            {error &&
              <Error error={error} />
            }
            {!error &&
              predictionView
            }
          </ScrollView>
      </View>
      );
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true,
      isLoading: true
    });

    UserActions.refreshPredictions(this.props.activeRoute, this.props.selectedDirection)
      .then(() => {
        this.setState({
          isRefreshing: false,
          isLoading: false
        });
      })
      .catch(() => {
        alert("Oops! Please try again.");

        this.setState({
          isRefreshing: false,
          isLoading: false
        });
      });
  }
}
