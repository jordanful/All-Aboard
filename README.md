# All Aboard
## A simple bus tracker for the Chicago CTA
<img src="https://cl.ly/0a1x1v3W2z2E/iphone.png" alt="All Aboard on the iPhone 6S" align="right"/>
### Installation
1. Clone
2. `npm install`

### Contributing
We very much welcome contributions. If you've been interested in React Native, this app is a great way into the framework. There are only a few components, no authentication, and a simple API.

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

### License
The MIT License (MIT)
Copyright 2016

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
