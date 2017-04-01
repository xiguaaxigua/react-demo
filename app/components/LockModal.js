/**
 * Created by go_songs on 2017/3/16.
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../libs/Modal/index';
import {fireLock, setCurrentModal} from '../actions/index';

class LockModal extends Component {
  constructor(props) {
    super(props);
    this.handlePsdChange = ::this.handlePsdChange;
    this.handleLockInfoChange = ::this.handleLockInfoChange;
    this.checkPsd = ::this.checkPsd;
    this.checkLockInfo = ::this.checkLockInfo;
    this.fireLock = ::this.fireLock;
    this.closeModal = ::this.closeModal;
    this.state = {
      curDevice: '',
      currentModal: '',
      psdValue: '',
      psdErr: false,
      lockInfo: '',
      lockErr: false
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      curDevice: newProps.curDevice,
      currentModal: newProps.currentModal
    });
    if (newProps.currentModal !== 'LockModal') {
      this.setState({
        curDevice: '',
        currentModal: '',
        psdValue: '',
        psdErr: false,
        lockInfo: '',
        lockErr: false
      })
    }
  }

  closeModal() {
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    if (d) {
      if (+d.Lon && +d.Lat) {
        dispatch(setCurrentModal(''));
      } else {
        dispatch(setCurrentModal('InfoWindowModal'));
      }
    }
  }

  fireLock() {
    if (this.state.psdValue.length !== 4) {
      this.setState({
        psdErr: true
      });
      return false;
    } else {
      this.setState({
        psdErr: false
      })
    }

    const {dispatch, curDevice, list} = this.props;
    console.log(list)
    let d = list[curDevice];
    let udid = d.UDID;
    let psd = this.state.psdValue;
    let info = this.state.lockInfo;
    let isOnline = d.OnlineStatus;
    dispatch(fireLock(udid, psd, info, isOnline, d));
  }

  checkPsd() {
    let psdErr;
    if (this.state.psdValue.length === 4) {
      psdErr = false;
    } else {
      psdErr = true;
    }
    this.setState({
      psdErr
    });
  }

  handlePsdChange(e) {
    let val = e.target.value.replace(/\D/g, '');
    let btnStatus;
    if (val.length === 4) {
      btnStatus = '';
    } else {
      btnStatus = 'disabled';
    }
    this.setState({
      psdValue: val,
      btnStatus
    });
  }

  handleLockInfoChange(e) {
    this.setState({
      lockInfo: e.target.value
    });
    let lockErr;
    if (e.target.value.length > 70) {
      lockErr = true;
    } else {
      lockErr = false;
    }
    this.setState({
      lockErr
    })
  }

  checkLockInfo() {
    let lockErr;
    if (this.state.lockInfo.length <= 70) {
      lockErr = false;
    } else {
      lockErr = true;
    }
    this.setState({
      lockErr
    })
  }

  render() {
    let btnStatus = this.state.btnStatus;
    let psdErr = this.state.psdErr ? 'error' : '';
    let lockErr = this.state.lockErr ? 'error' : '';
    let currentModal = this.state.currentModal;
    return (
      <Modal
        style={{height: '303px'}}
        isOpen={currentModal === 'LockModal'}
        onRequestClose={this.closeAddModal}
        contentLabel="Modal"
      >
        <div className="modal-header">
          锁定手机
          <i className="icon icon-clear" onClick={this.closeModal}/>
        </div>
        <div className="modal-content">
          <p>成功设置手机锁定密码后，原来已设定的解锁密码将会被覆盖。</p>
          <div className="from-group clearfix">
            <div className="from-group-label">锁定密码</div>
            <div className="from-group-content">
              <input type="text"
                     className={`${psdErr}`}
                     value={this.state.psdValue}
                     maxLength={4}
                     onFocus={() => this.setState({psdErr: false})}
                     onChange={this.handlePsdChange}
                     placeholder="请设置4位数字密码"/>
              {this.state.psdErr ? <p className="error-tips">请设置4位数字密码</p> : ''}
            </div>
          </div>

          <p style={{color: '#333'}}>给手机发送消息（选填）</p>
          <div className="text-area">
            <textarea placeholder="消息内容会显示在手机锁屏界面"
                      className={lockErr}
                      onFocus={() => this.setState({lockErr: false})}
                      onChange={this.handleLockInfoChange}
                      onBlur={this.checkLockInfo}
                      value={this.state.lockInfo}/>
            <p className={`limit-number ${lockErr}`}>{this.state.lockInfo.length}/70</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className={`btn btn-info`} onClick={this.fireLock}>立即锁定</button>
        </div>
      </Modal>
    )
  }
}

export default LockModal;
