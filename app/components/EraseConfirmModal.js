/**
 * Created by go_songs on 2017/3/16.
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../libs/Modal/index';
import cookie from 'react-cookie';
import {userID} from '../constants/Config';
import {setCurrentModal, fireErase} from '../actions/index';

class EraseConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = ::this.closeModal;
    this.fireErase = ::this.fireErase;
    this.handleUserPsdChange = ::this.handleUserPsdChange;
    this.checkUserPsd = ::this.checkUserPsd;
    this.state = {
      curDevice: '',
      currentModal: '',
      userPsd: '',
      userPsdErr: false
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      curDevice: newProps.curDevice,
      currentModal: newProps.currentModal
    });
    if(newProps.currentModal !== 'EraseConfirmModal'){
      this.setState({
        userPsd: '',
        userPsdErr: false
      })
    }
  }

  handleUserPsdChange(e) {
    this.setState({
      userPsd: e.target.value
    });
    if(e.target.value.length >= 6 && e.target.value.length <= 16){

    }else{

    }
  }

  checkUserPsd() {
    let userPsdErr;
    if (this.state.userPsd.length < 6 || this.state.userPsd.length > 16) {
      userPsdErr = true;
    } else {
      userPsdErr = false;
    }
    this.setState({
      userPsdErr
    });
  }

  closeModal() {
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    if(d){
      if(+d.Lat && +d.Lon){
        dispatch(setCurrentModal(''));
      }else{
        dispatch(setCurrentModal('InfoWindowModal'));
      }
    }
  }

  fireErase() {
    if(!this.state.userPsd.length) return false;
    const {dispatch, curDevice} = this.props;
    let isOnline = curDevice.OnlineStatus;
    let psd = this.state.userPsd;
    let udid = curDevice.UDID;
    dispatch(fireErase(isOnline, psd, udid, curDevice));
  }

  render() {
    let userName;
    if (cookie.load('nickname')) {
      userName = decodeURI(cookie.load('nickname'));
    } else {
      userName = cookie.load('AccountID') || '游客';
    }

    let userPsdErr = this.state.userPsdErr ? 'error' : '';
    let btnStatus = this.state.btnStatus;
    return (
      <Modal
        isOpen={this.state.currentModal === 'EraseConfirmModal'}
        onRequestClose={this.closeAddModal}
        contentLabel="Modal"
      >
        <div className="modal-header">
          验证密码
          <i className="icon icon-clear" onClick={this.closeModal}/>
        </div>
        <div className="modal-content">
          <p>请输入你的酷派账号登录密码</p>
          <div className="from-group clearfix" style={{marginBottom: '0'}}>
            <div className="from-group-label">用户名</div>
            <div className="from-group-content">
              {userName}
            </div>
          </div>
          <div className="from-group clearfix" style={{marginBottom: '0'}}>
            <div className="from-group-label">密码</div>
            <div className="from-group-content">
              <input type="password"
                     className={`${userPsdErr}`}
                     value={this.state.userPsd}
                     onChange={this.handleUserPsdChange}
                     onFocus={() => {
                       this.setState({userPsdErr: false})
                     }}
                     onBlur={this.checkUserPsd}
                     placeholder="密码(6-16位)"/>
              {userPsdErr ? <p className="error-tips">请输入6-16位的密码</p> : ''}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className={`btn btn-info`} onClick={this.fireErase}>立即擦除</button>
        </div>
      </Modal>
    )
  }
}

export default EraseConfirmModal;
