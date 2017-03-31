import React, {Component, PropTypes} from 'react';
import Popover from '../libs/Popover/index';
import {imgPrefix} from '../constants/Config';

class HeadLogo extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      popoverShow: false
    });
  }

  render() {
    let flipy = this.state.popoverShow ? 'flipy' : '';
    let toggleTrigger = (
      <h1>查找手机<i className={`icon_arrow_down ${flipy}`}/></h1>
    );
    return (
      <div className="head-logo">
        <div className="logo">
          <div className="hl hl-find-logo hl-24"></div>
        </div>
        <Popover position="bottom"
                 isOpen={this.state.popoverShow}
                 onShow={() => this.setState({popoverShow: true})}
                 onHide={() => this.setState({popoverShow: false})}
                 trigger={toggleTrigger}>
          <div className="nav">
            <a href="/contact" className="nav-item">
              <div className="hl hl-contact-logo hl-54"></div>
              <p>联系人</p>
            </a>
            <a href="/sms" className="nav-item">
              <div className="hl hl-msg-logo hl-54"></div>
              <p>短信</p>
            </a>
            <a href="/record" className="nav-item">
              <div className="hl hl-record-logo hl-54"></div>
              <p>通话记录</p>
            </a>
            <a href="/note" className="nav-item">
              <div className="hl hl-note-logo hl-54"></div>
              <p>点滴笔记</p>
            </a>
            <a href="/Login" className="nav-item">
              <div className="hl hl-find-logo hl-54"></div>
              <p>查找手机</p>
            </a>
            <a href="/" className="nav-item">
              <div className="hl hl-home-logo hl-54"></div>
              <p>首页</p>
            </a>
          </div>
        </Popover>
      </div>
    )
  }
}

export default HeadLogo;
