import React, { Component } from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import UserActions from '../actions/user';
import Styles from '../styles/styles.ios';

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
          <TouchableOpacity
            key={i}
            style={direction.dir == this.props.selectedDirection.dir ? Styles.directionActive : Styles.direction}
            onPress={() => this.props.onChooseDirection(direction)}
            activeOpacity={0.7}
          >
            <Text allowFontScaling={false} style={direction.dir == this.props.selectedDirection.dir ? Styles.directionTextActive : Styles.directionText}>
              {direction.label || this._prettyName(direction.dir)}
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

class MenuButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={Styles.menuButton} activeOpacity={0.6}>
        <View style={Styles.menuButtonLine} />
        <View style={Styles.menuButtonLine} />
        <View style={Styles.menuButtonLine} />
      </TouchableOpacity>
    );
  }
}

class ContentViewHeader extends Component {
  render() {
    let activeRoute = this.props.activeRoute;
    let hasRoute = activeRoute && activeRoute.rt;

    return (
      <View style={Styles.contentViewHeader}>
        <MenuButton onPress={this.props.onLeftButtonPress} />
        <View style={Styles.contentViewHeaderRouteInfo}>
          {hasRoute ? (
            <>
              <View style={[
                Styles.contentViewHeaderRouteNumberContainer,
                activeRoute.type === 'train' && { backgroundColor: activeRoute.color },
              ]}>
                <Text allowFontScaling={false} style={[
                  Styles.contentViewHeaderRouteNumber,
                  activeRoute.type === 'train' && { color: activeRoute.textColor },
                ]}>
                  {activeRoute.type === 'train' ? activeRoute.rt.charAt(0) : activeRoute.rt}
                </Text>
              </View>
              <Text allowFontScaling={false} style={Styles.contentViewHeaderRouteName} numberOfLines={1}>
                {activeRoute.rtnm}
              </Text>
            </>
          ) : (
            <Text allowFontScaling={false} style={Styles.contentViewHeaderPlaceholder}>
              Choose a route
            </Text>
          )}
        </View>
      </View>
    );
  }
}

class Minutes extends Component {
  render() {
    let prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    let isApproaching = prediction.isApp === '1';
    let isDelayed = prediction.isDly === '1';
    let displayValue = isApproaching ? 'Due' : prediction.prdctdn;
    let label = isDelayed ? 'delayed' : (isApproaching ? 'now' : 'minutes');

    return (
      <View style={Styles.predictionContainer}>
        <Text allowFontScaling={false} style={[
          Styles.minutes,
          isApproaching && { fontSize: 72, lineHeight: 82 },
        ]}>{displayValue}</Text>
        <Text allowFontScaling={false} style={[
          Styles.minutesLabel,
          isDelayed && { color: '#E8534E' },
        ]}>{label}</Text>
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
    let text = prediction.isApp === '1' ? 'Due' : prediction.prdctdn + ' min';
    return(
      <Text allowFontScaling={false} style={Styles.nextPrediction}>{text}</Text>
    );
  }
}

class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    let { alerts } = this.props;
    if (!alerts || alerts.length === 0) return null;

    let count = alerts.length;
    let hasMajor = alerts.some(a => a.MajorAlert === '1');
    let label = count === 1 ? alerts[0].Headline : count + ' service alerts';

    return (
      <View style={Styles.alertsContainer}>
        <TouchableOpacity
          style={[Styles.alertBanner, hasMajor && Styles.alertBannerMajor]}
          activeOpacity={0.7}
          onPress={() => this.setState({ expanded: !this.state.expanded })}
        >
          <View style={Styles.alertBannerLeft}>
            <Text allowFontScaling={false} style={Styles.alertBannerIcon}>!</Text>
          </View>
          <Text allowFontScaling={false} style={Styles.alertBannerText} numberOfLines={1}>
            {label}
          </Text>
          <Text allowFontScaling={false} style={Styles.alertBannerChevron}>
            {this.state.expanded ? '▾' : '▸'}
          </Text>
        </TouchableOpacity>

        {this.state.expanded && alerts.map((alert, i) => (
          <View key={alert.AlertId || i} style={Styles.alertDetail}>
            <Text allowFontScaling={false} style={Styles.alertDetailImpact}>
              {alert.Impact || alert.Headline}
            </Text>
            <Text allowFontScaling={false} style={Styles.alertDetailText}>
              {alert.ShortDescription}
            </Text>
          </View>
        ))}
      </View>
    );
  }
}

class ErrorMessage extends Component {
  render() {
    let { error } = this.props;
    return (
      <Text allowFontScaling={false} style={Styles.errorText}>
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
      };
  }

  render() {
    let { activeRoute, error } = this.props;
    let predictionView;
    let isLoading = this.state.isLoading;
    let hasRoute = activeRoute && activeRoute.rt;

    if (!hasRoute) {
      predictionView = (
        <View style={Styles.emptyState}>
          <Text allowFontScaling={false} style={Styles.emptyStateText}>
            Select a route to begin
          </Text>
        </View>
      );
    } else if (isLoading) {
      predictionView = <ActivityIndicator style={Styles.contentViewActivityIndicator} size="small" color="rgba(255,255,255,0.5)"/>
    } else {
      let nextPredictions = this.props.predictions && this.props.predictions.slice(1);
      predictionView =
        <View>
          <Minutes predictions={this.props.predictions} />
          <Stop stop={this.props.selectedStop} />
          <Destination predictions={this.props.predictions} />
          {nextPredictions && nextPredictions.length > 0 && (
            <View style={Styles.nextPredictionsContainer}>
              <Text allowFontScaling={false} style={Styles.nextPredictionLabel}>Also arriving</Text>
              {nextPredictions.map((p, i) => (
                <NextPrediction key={i} prediction={p} />
              ))}
            </View>
          )}
        </View>
    }
    return (
      <View style={Styles.contentView}>
        <ContentViewHeader activeRoute={activeRoute} onLeftButtonPress={this.props.onLeftButtonPress} />
          <ScrollView
            style={Styles.contentScrollView}
            contentContainerStyle={!hasRoute && { flex: 1 }}
            refreshControl={
              hasRoute ? (
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  tintColor="rgba(255,255,255,0.5)"
                  title=""
                />
              ) : undefined
            }
          >
            {hasRoute && (
              <Directions
                directions={this.props.directions}
                selectedDirection={this.props.selectedDirection}
                onChooseDirection={this.props.onChooseDirection}
              />
            )}
            {hasRoute && <Alerts alerts={this.props.alerts} />}
            {error && <ErrorMessage error={error} />}
            {!error && predictionView}
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
