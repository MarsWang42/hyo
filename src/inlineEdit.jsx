import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';

export default class InlineEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        label: props.placeholder || "Select",
        key: '',
      },
      isOpen: false,
      filter: "",
    };
    this.mounted = true;
    this.triggerChangeEvent = this.triggerChangeEvent.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.setValue = this.setValue.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
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
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  onRemove(event) {
    if (event.type === 'mousedown' && event.button !== 0) return;
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

  changeFilter(event) {
    this.setState({ filter: event.target.value });
  }

  /*
   * build Menu generate the dropdown menu
   */
  buildMenu() {
    const { options, filterable } = this.props;
    const { filter } = this.state;
    const ops = [];
    const renderFilter = () => (
      <div className="Dropdown-filter" key="dropdown-filter">
        <input type="text" onChange={this.changeFilter} />
        <span className="search-btn" />
      </div>
    );
    // if the menu is filterable, only show the options being filtered.
    if (filterable) ops.push(renderFilter());
    const shownOptions = options.filter(option =>
        option.key.toString().toLowerCase().includes(filter.toLowerCase()))
      .map(option => this.renderOption(option));

    if (shownOptions.length) ops.push(shownOptions);
    else ops.push(<div className="Dropdown-noresults" key="dropdown-noresult">No options found</div>);

    return ops;
  }

  /*
   * rederOption read the options from props and feed it to buildMenu
   */
  renderOption(option) {
    const optionClass = cn({
      'Dropdown-option': true,
      'is-selected': option === this.state.selected,
    });
    const key = option.key;
    const label = option.label;

    return (
      <div
        key={`${key}-dropdown`}
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
