var React           = require('react/addons');
var StructureStore  = require('../../../stores/StructureStore');
var CodeMirror      = require('codemirror');
require('codemirror/mode/javascript/javascript');

var _editorElem;
var _containerElem;
var _codeMirrorObj;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      structure: {}
    };
  },

  setCodeMirrorSize: function () {
    var offsetTop;
    var containerHeight;
    var containerWidth;

    offsetTop       = parseInt(window.getComputedStyle(_editorElem).getPropertyValue('top').replace(/px/, ''));
    containerHeight = _containerElem.scrollHeight;
    containerWidth  = _containerElem.scrollWidth;

    _codeMirrorObj.setSize(containerWidth, containerHeight - 2 * offsetTop);
  },

  handleStructureChange: function () {
    this.setState({
      structure: StructureStore.getStructure()
    });
  },

  componentDidMount: function () {

    _editorElem = document.getElementById('editor');
    _containerElem = document.getElementById('editor-container');
    _codeMirrorObj = CodeMirror(_editorElem, {
      lineNumbers:  true,
      theme:        'monokai'
    });

    StructureStore.addChangeListener(this.handleStructureChange);

    this.setCodeMirrorSize();
  },

  componentWillUnmount: function () {
    StructureStore.removeChangeListener(this.handleStructureChange);
  },

  render: function () {
    return (
      <div id="editor-container" className="structure-edit">
        <h1>{this.state.structure.name}</h1>
        <div id="editor" className="editor"></div>
      </div>
    );
  }
});