var React             = require('react/addons');
var StructureStore    = require('../../../stores/StructureStore');
var CodeMirror        = require('codemirror');
var cx                = React.addons.classSet;
var StructureActions  = require('../../../actions/StructureActions');
require('codemirror/mode/javascript/javascript');

var _operationEditorElem;
var _validationEditorElem;
var _containerElem;
var _newOperationElem;
var _operationEditorObj;
var _validationEditorObj;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      structure:      {},    // the loaded data structure
      nameOperation:  false  // whether the user has initiated naming a new operation
    };
  },

  saveStructure: function () {
    StructureActions.update(this.state.structure);
  },

  setCodeMirrorSize: function () {
    var offsetTop;
    var computedStyle;
    var containerHeight;
    var containerWidth;

    computedStyle   = window.getComputedStyle(_operationEditorElem);
    offsetTop       = parseInt(computedStyle.getPropertyValue('top').replace(/px/, ''));
    containerHeight = _containerElem.scrollHeight;
    containerWidth  = _containerElem.scrollWidth;

    _operationEditorObj.setSize(containerWidth / 2, containerHeight - 2 * offsetTop);
    _validationEditorObj.setSize(containerWidth / 2, containerHeight - 2 * offsetTop);
  },

  getCodeMirrorValue: function () {
    var validationStr = _validationEditorObj.getDoc().getValue();
    var validation    = validationStr ? JSON.parse(validationStr) : {};
    var operation     = _operationEditorObj.getDoc().getValue();
    var state         = this.state;

    if (state.edit === 'initialization') {
      state.structure.initialization = operation;
      state.structure.validation     = validation;
    } else if (state.edit !== undefined) {
      state.structure.operations[state.edit].operation = operation;
      state.structure.operations[state.edit].validation = validation;
    }
    
    this.setState(state);
  },

  setCodeMirrorValue: function (validation, operation) {
    var validationStr;
    validation    = validation || '';
    operation     = operation || '';
    validationStr = JSON.stringify(validation, null, 2);
    
    _validationEditorObj.getDoc().setValue(validationStr);
    _operationEditorObj.getDoc().setValue(operation);
  },

  handleSelectOperation: function (index) {
    var op = this.state.structure.operations[index];
    var state = this.state;
    this.getCodeMirrorValue();
    state.edit = index;
    this.setState(state);
    this.setCodeMirrorValue(op.validation, op.operation);
  },

  handleSelectInitialization: function () {
    var state = this.state;
    this.getCodeMirrorValue();
    state.edit = "initialization";
    this.setState(state);
    this.setCodeMirrorValue(this.state.structure.validation, this.state.structure.initialization);
  },

  handleAddOperationClick: function () {
    var state = this.state;
    state.nameOperation = true;
    this.setState(state);
    _newOperationElem.focus();
  },

  handleNewOperationBlur: function () {
    var opName = _newOperationElem.value;
    var state = this.state;
    if (opName) {
      state.structure.operations.push({
        name: opName,
        validation: {},
        operation: ""
      });
      _newOperationElem.value = '';
    }
    state.nameOperation = false;
    this.setState(state);
  },

  handleStructureChange: function () {
    var state = this.state;
    state.structure = StructureStore.getStructure();
    this.setState(state);
    this.handleSelectInitialization();
  },

  buildOperations: function () {
    if (!this.state.structure.operations) return null;
    return this.state.structure.operations.map(function (operation, index) {
      var listClass = cx({
        "clickable": true,
        "bold":      this.state.edit === index
      });
      return (
        <li className={listClass} onClick={this.handleSelectOperation.bind(this, index)}>
          {operation.name}
        </li>
      );
    }.bind(this));
  },

  componentDidMount: function () {

    var codeMirrorOptions = {
      lineNumbers:  true,
      theme:        'monokai',
      extraKeys: {
        Tab: function (cm) {
          cm.replaceSelection("  ", "end");
        }
      }
    };

    // build editor
    _operationEditorElem  = document.getElementById('operation-editor');
    _validationEditorElem = document.getElementById('validation-editor');
    _containerElem        = document.getElementById('editor-container');
    _newOperationElem     = document.getElementById('new-operation');

    _operationEditorObj = CodeMirror(_operationEditorElem, codeMirrorOptions);
    _validationEditorObj = CodeMirror(_validationEditorElem, codeMirrorOptions);
    this.setCodeMirrorSize(); 

    // watch for window resize
    window.addEventListener('resize', this.setCodeMirrorSize);

    // watch for structure to be loaded
    StructureStore.addChangeListener(this.handleStructureChange);
  },

  componentWillUnmount: function () {
    StructureStore.removeChangeListener(this.handleStructureChange);
  },

  render: function () {

    var newOperationClass = cx({
      clickable:  true,
      hide:       !this.state.nameOperation
    });

    var initializationClass = cx({
      "clickable":  true,
      "bold":       this.state.edit === "initialization"
    });

    return (
      <div id="editor-container" className="structure-edit">
        <h1>{this.state.structure.name}</h1>
        <div id="operation-editor" className="editor"></div>
        <div id="validation-editor" className="editor right-editor"></div>
        <div className="operations">
          <h2>
            <span>operations</span>
            <i className="fa fa-plus-circle" onClick={this.handleAddOperationClick}></i>
          </h2>
          <ul>
            <li className={initializationClass} onClick={this.handleSelectInitialization}>
              initialization
            </li>
            {this.buildOperations()}
            <li className={newOperationClass}>
              <input id="new-operation" type="text" placeholder="operation name" tabIndex="-1" onBlur={this.handleNewOperationBlur}/>
            </li>
          </ul>
        </div>
        <button className="save-btn" onClick={this.saveStructure}>Save!</button>
      </div>
    );
  }
});