var React         = require('react/addons');
var views         = require('../views');
var ViewConstants = require('../../constants/ViewConstants');
var ViewStore     = require('../../stores/ViewStore');
var Spinner       = require('spin');

function getState () {
  return {
    view:     views[ViewStore.getView()],
    loading:  ViewStore.getLoading(),
    error:    ViewStore.getError()
  };
}

module.exports = React.createClass({
  update: function () {
    this.setState(getState())
  },

  getInitialState: function () {
    return {
      view: views[ViewConstants.views.LANDING]
    };
  },

  initSpinner: function () {
    var target = document.getElementById('spinner');
    new Spinner({ 
      color: '#fff',
      lines: 12,
      length: 0,
      width: 5,
      radius: 16,
      corners: 1.0,
      trail: 50,
      speed: 1.0,
      shadow: true
    }).spin(target);
  },

  componentDidMount: function () {
    ViewStore.addChangeListener(this.update);
    this.initSpinner();
  },

  componentWillUnmount: function () {

  },

  render: function () {
    var cx = React.addons.classSet;
    var loading = cx({
      'active': this.state.loading,
      'loading-overlay': true
    });
    var loadingSpinner = cx({
      'active': this.state.loading,
      'loading-spinner': true
    });
    return (
      <div>
        <div className={loadingSpinner}>
          <div id="spinner"></div>
          <div className="text">Loading</div>
        </div>
        <div className={loading}></div>
        <this.state.view />
      </div>
    );
  }
});