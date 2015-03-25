var React = require('react');
var SequenceViewer = require('../../partials/SequenceViewer');
var SequenceEditor = require('../../partials/SequenceEditor');

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <SequenceViewer />
        <SequenceEditor />
      </div>
    );
  }
});