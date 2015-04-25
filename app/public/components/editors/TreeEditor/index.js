var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');
var Domain          = require('../../../domain');
var TwoDee          = require('two-dee');

var _sequence;
var _NodeCollection;
var _Trees;

var updateSequence = function () {
  SequenceActions.update(_sequence);
};

var addOperation = function (op) {
  _sequence.operations.push(op);
  updateSequence();
};

var TreeOperations = {

  "initialization": {
    label: "Initialization",
    operation: function (viewport, data, duration) {
      _NodeCollection = new Domain.NodeCollection(viewport);
    }
  },

  "addNode": {
    label: "Create Node",
    operation: function (viewport, data, duration) {
      _NodeCollection.add(new Domain.LinkableNode(viewport));
    }
  }

};

module.exports = React.createClass({
  onChangeStep: function () {

  },

  reset: function () {

  },

  addNode: function () {
    addOperation({
      type: 'addNode'
    });
  },

  render: function () {
    var viewerProps = {
      sequence:   this.props,
      structure:  TreeOperations,
      options: [
        { label: '+', action: this.addNode }
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