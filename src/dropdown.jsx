import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        label: props.placeholder || "Select",
        key: '',
      },
      isOpen: false,
    };
    this.mounted = true;
    this.triggerChangeEvent = this.triggerChangeEvent.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.setValue = this.setValue.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
  }

  /*
   * bind the onBlur event
   */
  componentDidMount() {
    document.addEventListener('click', this.hideDropdown, false)
    document.addEventListener('touchend', this.hideDropdown, false)
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.hideDropdown, false)
    document.removeEventListener('touchend', this.hideDropdown, false)
  }

  /*
   * setValue reset the current chosen value in state and close the dropdown.
   */
  setValue(key, label) {
    const newState = {
      selected: {
        key,
        label,
      },
      isOpen: false,
    };
    console.log(newState)
    this.triggerChangeEvent(newState);
    this.setState(newState);
  }

  /*
   * handle onBlur situation
   */
  hideDropdown(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  /*
   * handleMouseDown toggles the dropdown.
   */
  handleMouseDown(event) {
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  /*
   * trigger the onchange method from props if given
   */
  triggerChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  /*
   * build Menu generate the dropdown menu
   */
  buildMenu() {
    const { options } = this.props;
    const ops = options.map(option => this.renderOption(option));

    return ops.length ? ops : <div className="Dropdown-noresults">No options found</div>;
  }

  /*
   * rederOption read the options from props and feed it to buildMenu
   */
  renderOption(option) {
    const optionClass = cn({
      'Dropdown-option': true,
      'is-selected': option === this.state.selected,
    });

    const key = option.key !== undefined ? option.key : option.label || option;
    const label = option.label !== undefined? option.label : option.key || option;

    return (
      <div
        key={key}
        className={optionClass}
        onMouseDown={() => this.setValue(key, label)}
        onClick={() => this.setValue(key, label)}
      >
        {label}
      </div>
    );
  }

  render() {
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;
    const key = (<div className={`Dropdown-placeholder`}>{placeHolderValue}</div>);
    const menu = this.state.isOpen ? <div className={`Dropdown-menu`}>{this.buildMenu()}</div> : null;

    const dropdownClass = cn({
      'Dropdown-root': true,
      'is-open': this.state.isOpen,
    });

    return (
      <div className={dropdownClass}>
        <div
          className={`Dropdown-control ${disabledClass}`}
          onMouseDown={this.handleMouseDown}
          onTouchEnd={this.handleMouseDown}
        >
          {key}
          <span className={`Dropdown-arrow`} />
        </div>
        {menu}
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string,
        key: PropTypes.string,
      }),
    ])).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

Dropdown.defaultProps = {
  placeholder: "",
  disabled: false,
  onChange: undefined,
};
