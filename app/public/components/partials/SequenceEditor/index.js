var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="sequence-editor">
        <ul>
          <li>
            <div className="step-name">Initialization</div>
          </li>
          <li>
            <div className="step-name">Swap</div>
          </li>
        </ul>
      </div>
    );
  }
});