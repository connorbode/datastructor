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

var addNode = function () {
  var id = Domain.genId();
  addOperation({
    type: 'addNode',
    data: {
      id: id
    }
  });
};

var changeNodeValue = function (id, value) {
  addOperation({
    type: 'changeNodeValue',
    data: {
      id: id,
      value: value
    }
  })
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
      var node = new Domain.LinkableNode(viewport);
      node.setId(data.id);
      node.addEventListener('valuechanged', function (value) {
        changeNodeValue(node.id, value);
      });
      _NodeCollection.add(node);
    }
  },

  "changeNodeValue": {
    label: "Change Value",
    operation: function (viewport, data, duration) {
      var node = Domain.getObject(data.id);
      node.setValue(data.value);
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
        { label: '+', action: addNode }
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