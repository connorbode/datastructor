var React          = require('react/addons');
var SessionActions = require('../../../actions/SessionActions');
var ViewActions    = require('../../../actions/ViewActions');
var ViewConstants  = require('../../../constants/ViewConstants');

var menuTimeout;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      menu: false
    };
  },

  handleMenuClick: function () {
    this.setState({
      menu: !this.state.menu
    });
  },

  handleMenuMouseOut: function () {
    menuTimeout = setTimeout(function () {
      this.setState({
        menu: false
      });
    }.bind(this), 1000);
  },

  handleMenuMouseOver: function () {
    clearTimeout(menuTimeout);
  },

  handleLogoutClick: function () {
    SessionActions.destroy();
  },

  handleSequenceClick: function () {
    ViewActions.go(ViewConstants.views.SEQUENCE_LIST);
  },

  handleDataStructureClick: function () {
    alert('not implemented');
  },

  componentDidMount: function () {
    var menu = document.getElementById('menu');
    menu.addEventListener('mouseout', this.handleMenuMouseOut);
    menu.addEventListener('mouseover', this.handleMenuMouseOver);
    document.getElementById('menu-btn').addEventListener('click', this.handleMenuClick);
    document.getElementById('logout-btn').addEventListener('click', this.handleLogoutClick);
    document.getElementById('sequence-btn').addEventListener('click', this.handleSequenceClick);
    document.getElementById('data-structure-btn').addEventListener('click', this.handleDataStructureClick);
  },

  render: function () {
    var cx = React.addons.classSet;
    var menu = cx({
      'menu': true,
      'active': this.state.menu
    });
    var menuBtn = cx({
      'menu-btn': true,
      'active': this.state.menu
    });
    var header = cx({
      'header': true,
      'hide':   this.props.hide
    })
    return (
      <div className={header}>
        <h1>datastructor!</h1>
        <div id="menu-btn" className={menuBtn}> 
          <i id="menu-icon" className="fa fa-align-justify"></i>
        </div>
        <div id="menu" className={menu}>
          <ul>
            <li><a id="sequence-btn">sequences</a></li>
            <li><a id="data-structure-btn">data structures</a></li>
            <li><a id="logout-btn">logout</a></li>
          </ul>
        </div> 
      </div>
    );
  }
});