import React, { Component, PropTypes } from 'react';
import MouseTracker from './helpers/mouseTracker';

export default class Scrollbar extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.setState({
      focused: true,
    });
  }

  onBlur() {
    this.setState({
      focused: false,
    });
  }

  render() {
    if (!this.state.scrollable) {
      return null;
    }
    const { isHorizontal, isActive, faceSize } = this.state;
    const { isOpaque, verticalTop } = this.props;

    return (
      <div
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        onWheel={this.wheelHandler.onWheel}
        tabIndex={0}>
        <div
          ref="face"
        />
      </div>
    );
  }
}
