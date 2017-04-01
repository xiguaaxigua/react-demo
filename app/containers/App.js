/**
 * Created by go_songs on 2017/3/1.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Notifications from '../libs/Notify/index';
import Head from '../components/Head';
import Side from '../components/Side';
import MultiMap from '../components/MultiMap';
import EmptyDevice from '../components/EmptyDevice';
import ScrollBar from '../libs/ScrollBar/index';
import {getList} from '../actions/index';

import OfflineModal from '../components/OfflineModal';
import LockModal from '../components/LockModal';
import EraseModal from '../components/EraseModal';
import EraseConfirmModal from '../components/EraseConfirmModal';
import BellModal from '../components/BellModal';
import {mobileAndTabletCheck, detectBrowser} from '../utils/detectUserDevice';

import '../scss/reset.scss';
import '../scss/icon.scss';
import '../scss/btn.scss';
import '../scss/modal.scss';
import '../scss/main.scss';
import '../assets/home_logo/homeLogo.css';
import '../assets/icon_fonts/style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getList());
    if (!detectBrowser()) {
      this.setState({
        isMobile: true
      });
      document.body.innerHTML = '<p style="margin-top: 20px; text-align: center;">浏览器版本太低, 请升级!</p>';
      return false;
    } else {
      this.setState({
        isMobile: true
      });
    }
    if (mobileAndTabletCheck()) {
      this.setState({
        isMobile: true
      });
      document.body.innerHTML = '<p style="margin-top: 20px; text-align: center;">暂不支持手机登录，请使用PC登录!</p>';
      return false;
    } else {
      this.setState({
        isMobile: false
      });
    }
  }

  render() {
    if (this.state.isMobile) {
      return <div></div>
    } else {
      let con;
      if (this.props.noDevice === undefined) {
        con = <div></div>
      } else if (this.props.noDevice === false) {
        con = (
          <div className="main-container">
            <Notifications />

            <OfflineModal {...this.props}/>

            <LockModal
              list={this.props.list}
              curDevice={this.props.curDevice}
              dispatch={this.props.dispatch}
              currentModal={this.props.currentModal}/>

            <EraseModal {...this.props}/>
            <EraseConfirmModal
              list={this.props.list}
              curDevice={this.props.curDevice}
              dispatch={this.props.dispatch}
              currentModal={this.props.currentModal}/>

            <BellModal {...this.props}/>

            <Side {...this.props}/>
            <MultiMap {...this.props}/>
          </div>
        )
      } else {
        con = <EmptyDevice />
      }

      return (
        <ScrollBar style={{width: '100%', height: '100%'}}
                   autoHide
                   autoHideTimeout={200}
                   autoHideDuration={200}>
          <div className="silly-phone">
            <Head {...this.props}/>

            {con}
          </div>
        </ScrollBar>
      )
    }
  }
}

const mapStateToProps = state => {
  const {phoneReducer} = state;
  const {list, newList, curDevice, currentModal, curLocTime, curLockTime, curBellTime, curEraseTime, noDevice, serverTime} = phoneReducer;
  return {
    list,
    newList,
    curDevice,
    currentModal,
    curLocTime,
    curLockTime,
    curBellTime,
    curEraseTime,
    noDevice,
    serverTime
  }
};

export default connect(mapStateToProps)(App);