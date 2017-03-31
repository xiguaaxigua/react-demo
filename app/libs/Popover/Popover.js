import React from 'react';
import classnames from 'classnames';
import shouldPureComponentUpdate from 'react-pure-render/function'; // 好像没有 后期可以考虑去掉这个包
import enhanceWithClickOutside from 'react-click-outside';
import './Popover.scss';

class PopoverStore {
  callback = null;

  hide() {
    this.register(null);
  }

  register(cb) {
    if (this.callback) {
      this.callback();
    }
    this.callback = cb;
  }

  unregister(cb) {
    if (this.callback === cb) {
      this.callback = null;
    }
  }
}

export const popoverStore = new PopoverStore();

export class Popover extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    triggerClassName: React.PropTypes.string,
    children: React.PropTypes.node,
    trigger: React.PropTypes.any.isRequired,
    position: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    onShow: React.PropTypes.func,
    onHide: React.PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    position: 'top',
    triggerClassName: 'popover__trigger',
  };

  state = {
    isPopoverShown: false,
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillUnmount = () => {
    popoverStore.unregister(this.hide);
  };

  show = (e) => {
    popoverStore.register(this.hide);
    this.setState({isPopoverShown: true});
    if (this.props.onShow) {
      this.props.onShow(e);
    }
  };

  handleClickOutside = (e) => {
    this.hide(e);
  };

  hide = (e) => {
    this.setState({isPopoverShown: false});
    if (this.props.onHide) {
      this.props.onHide(e);
    }
  };

  toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.isPopoverShown) {
      this.hide(e);
      popoverStore.unregister(this.hide);
    } else {
      this.show(e);
    }
  };

  render() {
    const {className, triggerClassName, position, trigger} = this.props;
    const popoverClasses = classnames('popover', className, `popover--${position}`, {'popover--active': this.state.isPopoverShown});
    const popoverBoxClasses=classnames(className,"popover__content");

    return (
      <div className={popoverClasses}>
        <a href="" onClick={this.toggle} className={triggerClassName}>{trigger}</a>
        <div className={popoverBoxClasses}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class PopoverWrapper extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  hidePopovers(e) {
    popoverStore.hide();
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  render() {
    return (
      <div onMouseDownCapture={this.hidePopovers.bing(this)} onTouchEnd={this.hidePopovers} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}


export default enhanceWithClickOutside(Popover);
