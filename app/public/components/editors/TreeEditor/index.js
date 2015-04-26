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

var createNode = function () {
  var id = Domain.genId();
  addOperation({
    type: 'createNode',
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

var createLink = function (firstId, secondId) {
  addOperation({
    type: 'createLink',
    data: {
      firstId: firstId,
      secondId: secondId
    }
  });
};

var TreeOperations = {

  "initialization": {
    label: "Initialization",
    operation: function (viewport, data, duration) {
      _NodeCollection = new Domain.Collection(viewport);
    }
  },

  "createNode": {
    label: "Create Node",
    operation: function (viewport, data, duration) {
      var node = new Domain.Tree(viewport);
      node.setId(data.id);
      node.addEventListener('valuechanged', changeNodeValue);
      node.addEventListener('linkcreated', createLink);
      _NodeCollection.add(node);
    }
  },

  "changeNodeValue": {
    label: "Change Value",
    operation: function (viewport, data, duration) {
      var node = Domain.getObject(data.id);
      node.setValue(data.value);
    }
  },

  "createLink": {
    label: "Create Link",
    operation: function (viewport, data, duration) {
      var first = Domain.getObject(data.firstId);
      var second = Domain.getObject(data.secondId);

      first.addChild(second);

      _NodeCollection.remove(first);
      _NodeCollection.remove(second);
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
        { label: '+', action: createNode }
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