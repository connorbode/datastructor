var React       = require('react');
var ViewPort    = require('./components/ViewPort');
var queryString = require('querystring');
var ViewActions = require('./actions/ViewActions');
var stores      = require('./stores');

var path   = window.location.pathname;
var qs     = window.location.search.replace(/^\?/, '');
var params = queryString.parse(qs);

React.render(
  <ViewPort />,
  document.getElementById('content')
);

ViewActions.loadPath(path, params);