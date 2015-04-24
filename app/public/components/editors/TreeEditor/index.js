var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');
var Domain          = require('../../../domain');
var _sequence;

var TreeOperations = {

  "initialization": {
    label: "Initialization",
    operation: function (viewport, data, duration) {
      var node = new Domain.Node(viewport);
      node.setXY(0, 0);
      node.setValue('9');
      var mouseover = function () {
        console.log('mouseover');
      }
      node.addEventListener('mouseover', mouseover);
      node.addEventListener('mousedown', function () {
        console.log('removing listener');
        node.removeEventListener('mouseover', mouseover);
      });
      var value = function (v) {
        console.log('value is: ' + v)
      }
      node.addEventListener('valuechanged', value);

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