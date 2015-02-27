var React = require('react/addons');
var $     = require('jquery');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      menu: false
    };
  },

  clickMenu: function () {
    this.setState({
      menu: !this.state.menu
    });
  },

  logout: function () {
    console.log('logout');
  },

  componentDidMount: function () {
    $('#menu-btn').on('click', this.clickMenu);
    $('#logout-btn').on('click', this.logout);
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
    return (
      <div className="header">
        <h1>datastructor!</h1>
        <div id="menu-btn" className={menuBtn}> 
          <i id="menu-icon" className="fa fa-align-justify"></i>
        </div>
        <div id="menu" className={menu}>
          <ul>
            <li><a href='/sequences'>sequences</a></li>
            <li><a id="logout-btn" href='#'>logout</a></li>
          </ul>
        </div> 
      </div>
    );
  }
});