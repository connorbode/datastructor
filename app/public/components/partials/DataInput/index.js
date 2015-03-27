var React       = require('react/addons');

var _val = {};

module.exports = React.createClass({

  /**
   * Calls the change handler supplied
   * to this component.
   */
  emitChange: function () {
    if (this.props.onChange) {
      this.props.onChange(_val);
    }
  },

  /**
   * Updates the value of an integer input.
   * 
   * Params:
   *
   * - __val__ : The value object to update
   * - __event__: The click event that was triggered
   */
  updateIntegerVal: function (val, event) {
    val.value = parseInt(event.target.value);
    this.emitChange();
  },

  /**
   * Adds an item to an array input.
   *
   * Params:
   *
   * - __val__: The value object of the array to append to
   */
  addItemToArray: function (val) {
    val.value.push({})
    this.forceUpdate();
  },

  /**
   * Constructs an array input
   *
   * Params:
   *
   * - __schema__: The schema for the array input
   * - __val__: The value object to be used for the array
   */
  buildArray: function (schema, val) {
    if (!val.value) {
      val.value = [];
    }
    return (
      <ul>
        {schema.label ? <li>{schema.label}</li> : null}
        {val.value.map(function (value, index) {
          return (
            <li>
              <span>{index}: </span>
              {this.buildItem(schema.items, value)}
            </li>
          );
        }.bind(this))}
        <li>
          <button onClick={this.addItemToArray.bind(this, val)}>Add Item</button>
        </li>
      </ul>
    );
  },

  /**
   * Constructs an integer input
   *
   * Params:
   *
   * - __schema__: The schema for the integer input
   * - __val__: The value object to be used for the input
   */
  buildInteger: function (schema, val) {
    var placeholder = schema.label || '';
    return (<input type="number" pattern="\d*" placeholder={placeholder} onChange={this.updateIntegerVal.bind(this, val)} />);
  },

  /**
   * Constructs a generic item
   *
   * Params:
   *
   * - __schema__: The schema for the generic input item
   * - __val__: The value object to be used for the item
   */
  buildItem: function (schema, val) {
    switch (schema.type) {
      case "integer":
        return this.buildInteger(schema, val);

      case "array":
        return this.buildArray(schema, val)

      default:
        return (<fieldset />);
    }
  },

  render: function () {
    return this.buildItem(this.props, _val);
  }
});