var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');
var Domain          = require('../../../domain');
var TwoDee          = require('two-dee');

var _sequence;
var _NodeCollection;
var _Trees;


var TreeOperations = {

  "initialization": {
    label: "Initialization",
    operation: function (viewport, data, duration) {
      var collection = new Domain.Collection(viewport);
      var first = new Domain.Node(viewport);
      var second = new Domain.Node(viewport);
      var third = new Domain.Node(viewport);
      var fourth = new Domain.Node(viewport);
      collection.show();
      collection.setHorizontal();
      [first, second, third, fourth].forEach(function (n, i) {
        n.setValue(i);
        n.show();
      });
      collection.add(first);
      collection.add(second);
      collection.add(third);
      collection.add(fourth);
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