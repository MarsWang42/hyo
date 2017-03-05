import React, { Component, PropTypes } from 'react';

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
    } = this.props;
    const {
      value,
      isEditing,
    } = this.state;

    const setValue = (event) => {
      const newValue = event.target.value;
      if (onChange) onChange(newValue);
      this.setState({
        isEditing: false,
        value: this.props.value,
      });
    };

    const onChangeInput = (event) => {
      this.setState({ value: event.target.value });
    };

    return (
      <div>
        {
          !isEditing ?
          (<div className="inline-edit-text" onClick={() => this.setState({ isEditing: true })}>
            { renderer ? renderer(value) : value }
          </div>) :
          <input
            className="inline-edit-input"
            type="text"
            autoFocus
            onBlur={setValue}
            onKeyDown={(e) => {
              if (e.keyCode === 27 || e.keyCode === 13) {
                setValue(e);
              }
            }}
            value={value}
            onChange={onChangeInput}
          />
        }
      </div>
    );
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
