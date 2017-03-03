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
    this.onRemove = this.onRemove.bind(this);
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
    event.cancelBubble = true;
    event.stopPropagation();
    event.preventDefault();
    console.log('a')

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  onRemove(event) {
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.cancelBubble = true;
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemove();
    return false
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
        key={`${key}-add-filter`}
        className={optionClass}
        onMouseDown={() => this.setValue(key, label)}
        onClick={() => this.setValue(key, label)}
      >
        {label}
      </div>
    );
  }

  render() {
    const { disabled, remove, shownText } = this.props;
    const { selected, isOpen } = this.state;
    const removeClass = remove? 'Dropdown-remove' : '';
    const disabledClass = disabled ? 'Dropdown-disabled' : '';
    const placeHolderValue = typeof selected === 'string' ? selected : selected.label;
    const key = (<div className="Dropdown-placeholder">{shownText || placeHolderValue}</div>);
    const menu = isOpen ? <div className="Dropdown-menu">{this.buildMenu()}</div> : null;

    const dropdownClass = cn({
      'Dropdown-root': true,
      'is-open': isOpen,
    });

    return (
      <div className={dropdownClass}>
        <div
          className={`Dropdown-control ${disabledClass} ${removeClass}`}
          onMouseDown={this.handleMouseDown}
          onTouchEnd={this.handleMouseDown}
        >
          {key}
          <span className="Dropdown-arrow" />
          {remove && <span className="remove-btn" onMouseDown={this.onRemove} onTouchEnd={this.onRemove}/>}
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
  remove: PropTypes.bool,
  shownText: PropTypes.string,
};

Dropdown.defaultProps = {
  placeholder: "",
  disabled: false,
  onChange: undefined,
  remove: false,
  shownText: "",
};
