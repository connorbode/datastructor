var React         = require('react');
var views         = require('../views');
var ViewConstants = require('../../constants/ViewConstants');
var ViewStore     = require('../../stores/ViewStore');

function getState () {
  return {
    view: views[ViewStore.getView()]
  };
}

module.exports = React.createClass({
  updateView: function () {
    this.setState(getState())
  },

  getInitialState: function () {
    return {
      view: views[ViewConstants.views.LANDING]
    };
  },

  componentDidMount: function () {
    ViewStore.addChangeListener(this.updateView)
  },

  componentWillUnmount: function () {

  },

  render: function () {
    return (<this.state.view />);
  }
});