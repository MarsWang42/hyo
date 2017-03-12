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
      filter: "",
    };
    this.mounted = true;
    this.hideDropdown = this.hideDropdown.bind(this);
  }

  /**
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

  /**
   * handle onBlur situation
   */
  hideDropdown(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  render() {
    const {
      disabled,
      remove,
      shownContent,
      options,
      filterable,
      onRemove,
      inline,
    } = this.props;
    const {
      selected,
      isOpen,
      filter,
    } = this.state;

    /**
     * trigger the onchange method from props if given
     */
    const triggerChangeEvent = (newState) => {
      if (newState.selected !== this.state.selected && this.props.onChange) {
        this.props.onChange(newState.selected);
      }
    };

    /**
     * setValue reset the current chosen value in state and close the dropdown.
     */
    const setValue = (key, label) => {
      const newState = {
        selected: {
          key,
          label,
        },
        isOpen: false,
      };
      triggerChangeEvent(newState);
      this.setState(newState);
    };

    /**
     * handleMouseDown toggles the dropdown.
     */
    const handleMouseDown = (event) => {
      if (event.type === 'mousedown' && event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();

      this.setState({
        isOpen: !isOpen,
      });
    };

    const removeDropdown = (event) => {
      if (event.type === 'mousedown' && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      onRemove();
    };

    const changeFilter = (event) => {
      this.setState({ filter: event.target.value });
    };

    /**
     * rederOption read the options from props and feed it to buildMenu
     */
    const renderOption = (option) => {
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
          onMouseDown={() => setValue(key, label)}
          onClick={() => setValue(key, label)}
        >
          {option.label}
        </div>
      );
    };

    /**
     * build Menu generate the dropdown menu
     */
    const buildMenu = () => {
      const ops = [];
      const renderFilter = () => (
        <div className="Dropdown-filter" key="dropdown-filter">
          <input type="text" onChange={changeFilter} />
          <span className="search-btn" />
        </div>
      );
      // if the menu is filterable, only show the options being filtered.
      if (filterable) ops.push(renderFilter());
      const shownOptions = options.filter(option =>
          option.key.toString().toLowerCase().includes(filter.toLowerCase()))
        .map(option => renderOption(option));

      if (shownOptions.length) ops.push(shownOptions);
      else ops.push(<div className="Dropdown-noresults" key="dropdown-noresult">No options found</div>);

      return ops;
    };

    const dropdownClass = cn({
      'Dropdown-root': !inline,
      'Dropdown-inline-root': inline,
      'is-open': isOpen,
    });
    const controlClass = cn({
      'Dropdown-control': !inline,
      'Dropdown-disabled': disabled,
      'Dropdown-remove': remove,
    })
    const menu = isOpen ? <div className="Dropdown-menu">{buildMenu()}</div> : null;
    const placeHolderValue = typeof selected === 'string' ? selected : selected.label;
    const content = (<div className="Dropdown-placeholder">{shownContent || placeHolderValue}</div>);

    return (
      <div className={dropdownClass}>
        <div
          className={controlClass}
          onMouseDown={handleMouseDown}
          onTouchEnd={handleMouseDown}
        >
          {content}
          <span className="Dropdown-arrow" />
          {remove && <span className="remove-btn" onMouseDown={removeDropdown} onTouchEnd={removeDropdown} />}
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
  shownContent: PropTypes.string,
  filterable: PropTypes.bool,
  onRemove: PropTypes.func,
};

Dropdown.defaultProps = {
  placeholder: "",
  disabled: false,
  onChange: undefined,
  remove: false,
  shownContent: "",
  filterable: false,
  onRemove: undefined,
};
