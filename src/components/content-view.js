import React, {
  AppStateIOS,
  Component,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import UserActions from '/../src/actions/user';

class Directions extends React.Component {
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
            <Text style={direction.dir == this.props.selectedDirection.dir ? Styles.directionTextActive : Styles.directionText}>
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

class ContentViewHeader extends React.Component {
  render() {
    let activeRoute = this.props.activeRoute || { rtnm: "Choose Route", rt: "" };

    return (
      <View style={Styles.contentViewHeader}>
        <Button onPress={this.props.onLeftButtonPress}  />
        <View style={Styles.contentViewHeaderRouteNumberAndNameContainer}>
          <View style={activeRoute.rt && Styles.contentViewHeaderRouteNumberContainer}>
            <Text style={Styles.contentViewHeaderRouteNumber}>
              {activeRoute.rt}
            </Text>
          </View>
          <Text style={Styles.contentViewHeaderRouteName}>
            {activeRoute.rtnm}
          </Text>
        </View>
        <View style={Styles.contentViewHeaderDummyRightSpace}></View>
      </View>
    );
  }
}

class Button extends React.Component  {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image style={Styles.contentViewHeaderIcon} source={require('/../assets/images/contentViewHeaderIcon.png')} />
      </TouchableOpacity>
    );
  }
}

class Minutes extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    return (
      <View>
        <Text style={Styles.minutes}>{prediction.prdctdn}</Text>
        <Text style={Styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
}

class Stop extends React.Component {
  render() {
    var stop = this.props.stop;
    if (!stop) { return null; }

    return (
      <Text style={Styles.stop}>{stop.stpnm}</Text>
    );
  }
}

class Destination extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null; }

    return(
      <Text style={Styles.destination}>To {prediction.des}</Text>
    );
  }
}

class NextPrediction extends React.Component {
  render() {
    let prediction = this.props.prediction;
    if (!prediction) { return null };
    return(
      <Text style={Styles.nextPrediction}>{prediction.prdctdn} minutes</Text>
    );
  }
}

class Error extends React.Component {
  render() {
    let { error } = this.props;
    return (
      <Text style={Styles.nextPrediction}>
        {error.msg}
      </Text>
    )
  }
}

export default class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this._onRefresh = this._onRefresh.bind(this);
    this.state = {
        predictions: props.predictions,
        isRefreshing: false,
      };
  }

  render() {
    let { activeRoute, error } = this.props;
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
              <View>
                <Minutes predictions={this.props.predictions} />
                <Stop stop={this.props.selectedStop} />
                <Destination predictions={this.props.predictions} />
                <NextPrediction prediction={this.props.predictions && this.props.predictions[1]} />
                <NextPrediction prediction={this.props.predictions && this.props.predictions[2]} />
              </View>
            }
          </ScrollView>
      </View>
      );
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    UserActions.refreshPredictions(this.props.activeRoute, this.props.selectedDirection)
      .then(() => {
        this.setState({
          isRefreshing: false,
        });
      })
      .catch(() => {
        alert("Oops! Please try again.");

        this.setState({
          isRefreshing: false,
        });
      });
  }
}
