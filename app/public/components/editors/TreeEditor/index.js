var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var _sequence;

var TreeOperations = {

  "initialization": {
    label: "Initialization",
    operation: function (viewport, data, duration) {

    }
  }

};

module.exports = React.createClass({
  onChangeStep: function () {

  },

  reset: function () {

  },

  render: function () {
    var viewerProps = {
      sequence:   this.props,
      structure:  TreeOperations,
      options: [
        { label: '[ ]', action: this.addArray }
      ],
      onChangeStep: this.onChangeStep,
      reset: this.reset
    };

    _sequence = this.props;
    return (
      <div className="tree-editor">
        <SequenceViewer {...viewerProps} />
      </div>
    );
  }
});