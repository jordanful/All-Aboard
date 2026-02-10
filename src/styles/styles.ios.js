import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

// Color palette
const colors = {
  navyDeep: '#0B1A38',
  navyMid: '#132C5B',
  navyLight: '#1E3A6E',
  blueMid: '#28519E',
  blueLight: '#3D6AC4',
  amber: '#F5B731',
  amberLight: '#FDC053',
  amberDark: '#3E2700',
  white: '#FFFFFF',
  whiteOff: '#F2F4F8',
  textMuted: '#8A9BC2',
  textSubtle: '#5E73A0',
  separator: 'rgba(255,255,255,0.06)',
};

export default StyleSheet.create({
  // ── Root ──
  rootContainer: {
    flex: 1,
    backgroundColor: colors.navyDeep,
  },

  // ── Menu / Drawer ──
  menuContainer: {
    backgroundColor: colors.navyDeep,
    flex: 1,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuSearch: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: colors.white,
    fontSize: 17,
    fontWeight: '400',
  },

  // ── Recently Viewed ──
  recentlyViewedContainer: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  recentlyViewedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  recentlyViewedScroll: {
    paddingHorizontal: 20,
  },
  recentlyViewedRoute: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: colors.amber,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentlyViewedRouteNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.amberDark,
  },

  // ── Route List ──
  routeSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    marginLeft: 62,
  },
  routeListHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  menuRouteNumberContainer: {
    backgroundColor: colors.amberLight,
    minWidth: 34,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  menuRouteNumber: {
    color: colors.amberDark,
    fontSize: 13,
    fontWeight: '700',

  },
  menuRouteName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 12,

    flexShrink: 1,
  },
  menuActivityIndicator: {
    marginTop: 60,
    alignSelf: 'center',
  },

  // ── Content Safe Area ──
  contentSafeTop: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // ── Content View ──
  contentView: {
    flex: 1,
    backgroundColor: colors.blueMid,
  },
  contentViewHeader: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  menuButtonLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.navyMid,
    borderRadius: 1,
    marginVertical: 2.5,
  },
  contentViewHeaderRouteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 36,
  },
  contentViewHeaderRouteNumberContainer: {
    backgroundColor: colors.amberLight,
    minWidth: 34,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 10,
  },
  contentViewHeaderRouteNumber: {
    color: colors.amberDark,
    fontSize: 13,
    fontWeight: '700',

  },
  contentViewHeaderRouteName: {
    color: colors.navyMid,
    fontSize: 18,
    fontWeight: '600',

  },
  contentViewHeaderPlaceholder: {
    color: colors.textSubtle,
    fontSize: 18,
    fontWeight: '500',

  },

  // ── Scrollable Content ──
  contentScrollView: {
    flex: 1,
    backgroundColor: colors.blueMid,
  },

  // ── Directions Tabs ──
  directions: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    padding: 3,
  },
  direction: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  directionActive: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  directionText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',

  },
  directionTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,

  },

  // ── Alerts ──
  alertsContainer: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,183,49,0.15)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  alertBannerMajor: {
    backgroundColor: 'rgba(232,83,78,0.15)',
  },
  alertBannerLeft: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  alertBannerIcon: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.amberDark,
    marginTop: -1,
  },
  alertBannerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.amber,
  },
  alertBannerChevron: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 8,
  },
  alertDetail: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  alertDetailImpact: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  alertDetailText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },

  // ── Prediction Display ──
  predictionContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  minutes: {
    fontSize: 120,
    fontWeight: '200',
    color: colors.white,
    alignSelf: 'center',
    lineHeight: 130,
  },
  minutesLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: -4,
  },
  stop: {
    color: colors.white,
    marginTop: 36,
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  destination: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 6,
    alignSelf: 'center',
  },
  nextPredictionsContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  nextPrediction: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 8,
  },
  nextPredictionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  errorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 40,
    textAlign: 'center',
    paddingHorizontal: 32,

  },

  // ── Empty State ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyStateText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',

  },

  // ── Loading ──
  contentViewActivityIndicator: {
    alignSelf: 'center',
    marginTop: 60,
  },
});
