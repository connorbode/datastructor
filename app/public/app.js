var React       = require('react');
var ViewPort    = require('./components/ViewPort');
var queryString = require('querystring');
var PathActions = require('./actions/PathActions');
var stores      = require('./stores');

var path   = window.location.pathname;
var qs     = window.location.search.replace(/^\?/, '');
var params = queryString.parse(qs);

React.render(
  <ViewPort />,
  document.getElementById('content')
);

PathActions.loadPath(path, params);