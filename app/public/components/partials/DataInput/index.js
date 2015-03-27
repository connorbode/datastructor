var React       = require('react/addons');

var _val = {};

module.exports = React.createClass({

  /**
   * The all data in this component is stored 
   * in the value key of an object.  This is
   * to ensure that parameters are always
   * passed by reference instead of by value
   * (hence preserving all relationships).
   *
   * This function iterates through an object,
   * removing all the "value" keys.
   */
  getRealVal: function (val) {
    var realVal;
    if (Array.isArray(val.value)) {
      realVal = val.value.map(function (v) {
        return this.getRealVal(v);
      }.bind(this));
    } else {
      realVal = val.value;
    }
    return realVal;
  },

  /**
   * Calls the change handler supplied
   * to this component.
   */
  emitChange: function () {
    var val;
    if (this.props.onChange) {
      val = this.getRealVal(_val);
      this.props.onChange(val);
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
   * - __schema__:        The schema for the array input
   * - __currentValue__:  The current value of the object
   * - __valueObject__:   The value object to be used for the array
   */
  buildArray: function (schema, currentValue, valueObject) {
    if (currentValue) {
      valueObject.value = currentValue;
    }
    if (!valueObject.value) {
      valueObject.value = [];
    }
    return (
      <ul>
        {schema.label ? <li>{schema.label}</li> : null}
        {valueObject.value.map(function (value, index) {
          return (
            <li>
              <span>{index}: </span>
              {this.buildItem(schema.items, currentValue[index], value)}
            </li>
          );
        }.bind(this))}
        <li>
          <button onClick={this.addItemToArray.bind(this, valueObject)}>Add Item</button>
        </li>
      </ul>
    );
  },

  /**
   * Constructs an integer input
   *
   * Params:
   *
   * - __schema__:        The schema for the integer input
   * - __currentValue__:  The current value of the input
   * - __valueObject__:   The value object to be used for the input
   */
  buildInteger: function (schema, currentValue, valueObject) {
    var placeholder = schema.label || '';
    if (currentValue) {
      valueObject.value = currentValue;
    }
    return (
      <input 
        type="number" 
        pattern="\d*" 
        placeholder={placeholder}  
        value={currentValue}
        onChange={this.updateIntegerVal.bind(this, valueObject)} />
    );
  },

  /**
   * Constructs a generic item
   *
   * Params:
   *
   * - __schema__:        The schema for the generic input item
   * - __currentValue__:  The current value of the item
   * - __valueObject__:   The value object to be used for the item
   */
  buildItem: function (schema, currentValue, valueObject) {
    switch (schema.type) {
      case "integer":
        return this.buildInteger(schema, currentValue, valueObject);

      case "array":
        return this.buildArray(schema, currentValue, valueObject);

      default:
        return (<fieldset />);
    }
  },

  render: function () {
    return this.buildItem(this.props.validation, this.props.data, _val);
  }
});