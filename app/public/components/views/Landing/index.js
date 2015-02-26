var React         = require('react');
var $             = require('jquery');
var ViewActions   = require('../../../actions/ViewActions');
var ViewConstants = require('../../../constants/ViewConstants');

module.exports = React.createClass({

  getInitialState: function () {
    return {
      name: 'idle',
      page: 0,
      height: 0
    };
  },

  scroll: function (page) {
    $('body').animate({
        scrollTop: this.state.height * page
      }, {
        complete: function () {
          this.state.page = page;
          this.state.name = 'idle';
        }.bind(this)
      });
  },

  handleScroll: function (e) {
    e.preventDefault();
    if (this.state.name === 'idle') {
      this.state.name = 'scrolling';
      if (window.scrollY > this.state.page * this.state.height) {
        this.scroll(this.state.page + 1);
      } else {
        this.scroll(this.state.page - 1);
      }
    }
  },

  setHeight: function () {
    this.state.height = window.innerHeight;
  },

  componentDidMount: function () {
    this.setHeight();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.setHeight);
  },

  componentWillUnmount: function () {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.setHeight);
  },

  render: function () {
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
            <h1>sign in with one of these great providers</h1>
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
