import React, { Component, PropTypes } from 'react';
import Dropdown from './dropdown'

export default class InlineEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Whenever loading status changed, reinitialize everything.
    if (nextProps.value!== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const {
      onChange,
      renderer,
      editType,
      editOptions,
    } = this.props;
    const {
      value,
      isEditing,
    } = this.state;

    const setValue = (key) => {
      const newValue = key;
      if (onChange) onChange(newValue);
      this.setState({
        isEditing: false,
      });
    };

    const onChangeInput = (event) => {
      this.setState({ value: event.target.value });
    };

    const renderInlineEdit = () => {
      const textEdit = !isEditing ?
        (<div className="inline-edit-text" onClick={() => this.setState({ isEditing: true })}>
          { renderer ? renderer(value) : value }
        </div>) :
        (<input
          className="inline-edit-input"
          type="text"
          autoFocus
          onBlur={e => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 27 || e.keyCode === 13) {
              setValue(e.target.value);
            }
          }}
          value={value}
          onChange={onChangeInput}
        />);
      switch (editType) {
        case 'input':
          return textEdit;
        case 'select':
          return (
            <Dropdown
              options={editOptions}
              onChange={col => setValue(col.key)}
              filterable
              inline
              shownContent={value}
              placeholder="Click to Edit"
            />
          );
        default:
          return textEdit;
      }
    };

    return renderInlineEdit();
  }
}

InlineEdit.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  renderer: PropTypes.func,
};

InlineEdit.defaultProps = {
  value: "",
  onChange: undefined,
  renderer: undefined,
};
