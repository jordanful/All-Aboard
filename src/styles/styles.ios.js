import React, { StyleSheet } from 'react-native';

const Dimensions = require('Dimensions');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default Styles = StyleSheet.create({
center: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
},
 contentView: {
   flex: 1,
   justifyContent: 'center',
 },
 menuContainer: {
   backgroundColor: '#132C5B',
   flex: 1,
 },
 menuSearch: {
   backgroundColor: '#FFFFFF',
   height: 40,
   padding: 11,
   margin: 10,
   marginTop: 25,
   marginBottom: 15,
   width: deviceWidth * 0.74,
   borderRadius: 22,
   color: '#626262',
   fontSize: 19,
   fontWeight: '500',
   fontFamily: 'System'
 },
 row: {
   flexDirection: 'row',
   flex: 1,
   padding: 10
 },
 menuRouteNumberContainer: {
   backgroundColor: '#FDC053',
   width: 35,
   height: 24,
   borderRadius: 12,
   justifyContent: 'center',
   alignItems: 'center'
 },
 menuRouteNumber: {
   color: '#3E2700',
   fontWeight: '600',
   alignSelf: 'center',
   fontFamily: 'System'
 },
 menuRouteName: {
   color: 'white',
   fontSize: 19,
   fontWeight: '500',
   marginLeft: 10,
   fontFamily: 'System'
 },
 menuActivityIndicator: {
   marginTop: deviceHeight * 0.1,
   marginLeft: deviceWidth * 0.33,
   alignSelf: 'flex-start'
 },
 container: {
   flex: 1,
   backgroundColor: '#28519E'
 },
 contentViewHeader: {
   backgroundColor: 'white',
   borderTopLeftRadius: 8,
   borderTopRightRadius: 8,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   height: 64
 },
 contentViewHeaderIcon: {
   marginLeft: 18,
   marginTop: 10
 },
 contentViewHeaderDummyRightSpace: {
   marginRight: 18,
   marginTop: 10,
   width: 25,
   height: 19
 },
 contentViewActivityIndicator: {
   alignSelf: 'center',
   marginTop: 60,
 },
 contentViewHeaderRouteNumberAndNameContainer: {
   justifyContent: 'center',
   alignItems: 'center',
   flexDirection: 'row',
 },
 contentViewHeaderRouteNumberContainer: {
   backgroundColor: '#FDC053',
   width: 35,
   height: 24,
   borderRadius: 12,
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: 10
 },
 contentViewHeaderRouteNumber: {
   color: '#664100',
   fontWeight: '600',
   alignSelf: 'center',
   fontFamily: 'System'
 },
 contentViewHeaderRouteName: {
   color: '#274A8D',
   fontSize: 22,
   marginLeft: 10,
   marginTop: 10,
   fontWeight: '500',
   fontFamily: 'System'
 },
 minutes: {
   fontSize: 130,
   fontWeight: '500',
   color: 'white',
   marginTop: 30,
   alignSelf: 'center',
   fontFamily: 'System'
 },
 minutesLabel: {
   fontSize: 24,
   color: 'white',
   alignSelf: 'center',
   fontFamily: 'System'
 },
 nextPrediction: {
   color: 'white',
   marginTop: 40,
   opacity: 0.8,
   fontSize: 22,
   fontWeight: '500',
   alignSelf: 'center',
   fontFamily: 'System'
 },
 stop: {
   color: 'white',
   marginTop: 45,
   fontSize: 22,
   alignSelf: 'center',
   fontFamily: 'System'
 },
 destination: {
   color: 'white',
   opacity: 0.75,
   fontSize: 19,
   marginTop: 10,
   alignSelf: 'center',
   fontFamily: 'System'
 },
 directions: {
   flexDirection: 'row',
   marginTop: 20,
 },
 direction: {
   flex: 0.5,
   height: 44,
   alignItems: 'center'
 },
 directionText: {
   alignSelf: 'center',
   fontSize: 30,
   color: '#6884BA',
   fontFamily: 'System'
 },
 directionTextActive: {
   alignSelf: 'center',
   fontSize: 30,
   color: 'white',
   fontFamily: 'System'
 },
menuRoutes: {
  flex: 1,
},
 recentlyViewedRoutes: {
   marginBottom: 13,
   marginTop: 3,
   paddingLeft: 10,
 },
 recentlyViewedRoute: {
   width: 50,
   height: 50,
   borderRadius: 25,
   marginRight: 10,
   backgroundColor: '#FDC053',
   justifyContent: 'center',
   alignItems: 'center',
 },
 recentlyViewedRouteNumber: {
   fontSize: 19,
   fontWeight: '600',
 },
});
