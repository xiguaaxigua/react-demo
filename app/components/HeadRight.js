/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import Popover from '../libs/Popover/index';
import {imgPrefix} from '../constants/Config';

class HeadRight extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      popoverShow: false
    });
  }

  logOut() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let spcook = cookies[i].split("=");
      cookie.remove(spcook[0].replace(/(^\s*)|(\s*$)/g,""));
    }

    window.location = LOGOUT_URL;
  }

  render() {
    let accountID;
    let flipy = this.state.popoverShow ? 'flipy' : '';
    if (cookie.load('nickname')) {
      accountID = decodeURI(cookie.load('nickname'));
    } else {
      accountID = cookie.load('AccountID') || '游客';
    }
    const userAvatarImgUrl = cookie.load('HeadIconUrl') || imgPrefix + '/assets/images/default_avatar.png';
    const accountTrigger = (
      <div className="account-user-inner">
        <span className="line"/>
        <img src={userAvatarImgUrl}/>
        <p>{accountID}</p>
        <i className={`icon_arrow_down ${flipy}`}/>
      </div>
    );
    return (
      <div className="head-account">
        <div className="head-account-user">
          <Popover position="bottom"
                   isOpen={this.state.popoverShow}
                   onShow={() => this.setState({popoverShow: true})}
                   onHide={() => this.setState({popoverShow: false})}
                   trigger={accountTrigger}>
            <ul className="header-popover">
              <li onClick={() => window.open(UCENTER_URL)}>账号中心</li>
              <li onClick={this.logOut}>退出</li>
            </ul>
          </Popover>
        </div>
      </div>
    );
  }
}

export default HeadRight;