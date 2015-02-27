var React         = require('react/addons');
var $             = require('jquery');
var ViewActions   = require('../../../actions/ViewActions');
var ViewConstants = require('../../../constants/ViewConstants');
var UserStore     = require('../../../stores/UserStore');

var _state = {
  name: 'idle',
  page: 0,
  height: 0,
  authFailed: false
};

module.exports = React.createClass({

  scroll: function (page) {
    if (_state.name === 'idle' && page >= 0 && page <= 1) {
      _state.name = 'scrolling';
      $('body').animate({
          scrollTop: _state.height * page
        }, {
          complete: function () {
            _state.page = page;
            _state.name = 'idle';
          }.bind(this)
        });
    }
  },

  checkAuth: function () {
    _state.authFailed = UserStore.authFailed();
    this.forceUpdate(function () {
      this.scroll(1);
    });
  },

  scrollToSignIn: function () {
    this.scroll(1);
  },

  handleScroll: function (e) {
    e.preventDefault();
  },

  handleKey: function (e) {
    var UP = 38;
    var DOWN = 40;
    var key = e.which;
    if (key === UP) {
      e.preventDefault();
      this.scroll(_state.page - 1);
    } else {
      e.preventDefault();
      this.scroll(_state.page + 1);
    }

  },

  handleWheel: function (e) {
    e.preventDefault();
    if (e.wheelDelta < 1) {
      this.scroll(_state.page + 1);
    } else {
      this.scroll(_state.page - 1);
    }
  },

  setHeight: function () {
    _state.height = window.innerHeight;
    this.scroll(_state.page);
  },

  componentDidMount: function () {
    this.setHeight();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('mousewheel', this.handleWheel);
    window.addEventListener('resize', this.setHeight);
    window.addEventListener('keydown', this.handleKey);
    $('#sign-in').on('click', this.scrollToSignIn);
    UserStore.addChangeListener(this.checkAuth);
  },

  componentWillUnmount: function () {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousewheel', this.handleWheel);
    window.removeEventListener('resize', this.setHeight);
    window.removeEventListener('keydown', this.handleKey);
    $('#sign-in').off('click', this.scrollToSignIn);
    UserStore.removeChangeListener(this.checkAuth);
  },

  render: function () {
    var cx = React.addons.classSet;
    var providers = cx({
      hide: _state.authFailed
    });
    var error = cx({
      error: true,
      hide: !_state.authFailed
    });
    return (
      <div className="landing">
        <div className="pageOne page">
          <div className="login">
            <button id="sign-in">sign in</button>
          </div>
          <div className="title">
            <h1>datastructor!</h1>
            <div>Learn you some data structures.</div>
          </div>
        </div>
        <div className="pageTwo page">
          <div>
            <h1 className={providers}>
              sign in with one of these great providers
            </h1>
            <h1 className={error}>
              woops. we had some trouble signing you in.
            </h1>
            <div>
              <a href="https://github.com/login/oauth/authorize?scope=user&client_id=486fc6286ec9255f889b">
                <img src="/public/assets/images/github.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
