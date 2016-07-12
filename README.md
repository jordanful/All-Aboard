# All Aboard
## A simple bus tracker for the Chicago CTA

### Installation
1. Clone
2. `npm install`

### Contributing
We very much welcome contributions. If you've been interested in React Native, this app is a great way to into the framework. There are only a few components, no authentication, and a simple API.

Please see the list of ToDos below. We'll monitor pull requests.

### TODO
* Fix search & keyboard input interactions
* Add loading UI when fetching data
* Resubmit
* Add tests
* Integrate recently viewed routes feature with local storage API
* Integrate redux
* Integrate flow
* 'TODO' audit
* Android

![All Aboard on the iPhone 6S](https://cl.ly/1c2z150G1g3Y/1242x2208.png)

### CTA API docs:
http://cl.ly/0w0340392L1B

### Component list:

* ContentView: contains everything on our main view (predictions, directions etc)
* Menu: contains our route list
* Directions: Receives user input and displays directions of the bus
* Predictions: Displays upcoming arrival times
* Stop: Displays nearest stop to user depending on active Direction
* Destination: Displays end destination of bus based on active Direction
* Menu: Displays all active routes in a list view
* Route: an object that contain route name and number (and color which we do not use)
* SearchBar: Receives user input and searches the RouteList
* RecentRoutes: Displays recently selected routes at the top of RouteList

### Hierarchy:

* Menu
  - SearchBar
  - RecentRoutes
  - RouteList
    - Route
* ContentView
  - Directions
    - Direction
  - Prediction
  - Stop
  - Destination
