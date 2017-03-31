/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import formatTime from '../utils/formatTime';
import $ from 'jquery';
import {
  getOneLoc,
  setCurrentModal,
  setCurDevice,
  setCurLocTime,
  ThrowMsg,
  setCurLockTime,
  setBellTime,
  setEraseTime
} from '../actions/index';

class InfoWindowContent extends Component {
  constructor(props) {
    super(props);
    this.openModal = ::this.openModal;
    this.state = {
      deviceStatus: '',
      belling: true
    }
  }

  componentWillReceiveProps(newProps) {
    const {dispatch} = this.props;
    let udid = this.props.curDevice.UDID;
    if (newProps.curDevice.UDID === this.props.curDevice.UDID) {
      if (this.props.curLocTime && this.props.curDevice.LocationTime >= this.props.curLocTime) {
        // 单个定位成功
        dispatch(setCurLocTime(null));
      }

      if (newProps.newList && newProps.newList.Count) {
        if (newProps.newList.LocationTime - this.props.curLocTime > 60) {
          // ThrowErr('超时');
        }

        for (let i = 0; i < newProps.newList.Locations.length; i++) {
          if (newProps.newList.Locations[i].UDID === udid) {
            // 替换 curDevice 为 newList 中的
            dispatch(setCurDevice(newProps.newList.Locations[i]));
          }

          if (newProps.newList.Locations[i].LockState === 1 && newProps.newList.Locations[i].LockTime > this.props.curLockTime) {
            console.log('锁定成功');
            ThrowMsg('锁定成功');
            dispatch(setCurLockTime(newProps.newList.Locations[i].LockTime));
          }

          if (this.props.curLockTime && newProps.newList.Locations[i].LockState === 0 && newProps.newList.Locations[i].LockTime > this.props.curLockTime) {
            console.log('设备已解锁');
            ThrowMsg('设备已解锁');
            dispatch(setCurLockTime(''));
          }

          if (newProps.newList.Locations[i].BellState === 3 && newProps.newList.Locations[i].BellTime > this.props.curBellTime) {
            console.log('响铃成功');
            ThrowMsg('响铃成功');
            // $('#Belling').html('Hi'); // todo 响铃动画
            dispatch(setBellTime(newProps.newList.Locations[i].BellTime));
          }

          if (this.props.curBellTime && newProps.newList.Locations[i].BellState === 2 && newProps.newList.Locations[i].BellTime > this.props.curBellTime) {
            console.log('响铃已自动关闭');
            ThrowMsg('响铃已自动关闭');
            // $('#Belling').html('<i className="icon_bell"></i>');
            dispatch(setBellTime(''));
          }

          if (this.props.curBellTime && newProps.newList.Locations[i].BellState === 1 && newProps.newList.Locations[i].BellTime > this.props.curBellTime) {
            console.log('响铃已人为关闭');
            ThrowMsg('响铃已人为关闭');
            // $('#Belling').html('<i className="icon_bell"></i>');
            dispatch(setBellTime(''));
          }

          if (newProps.newList.Locations[i].EraseState === 1 && newProps.newList.Locations[i].EraseTime > this.props.curEraseTime) {
            console.log('擦除成功');
            ThrowMsg('擦除成功');
            dispatch(setEraseTime());
          }
        }
      }
    }
  }

  openModal(whichModal) {
    const {dispatch, curDevice} = this.props;
    if (whichModal === 'BellModal' && !curDevice.OnlineStatus) {
      return false;
    }
    dispatch(setCurrentModal(whichModal));
  }

  refresh(udid) {
    const {dispatch, curLocTime} = this.props;
    if (curLocTime) return false;
    dispatch(getOneLoc([udid]));
  }

  render() {
    let bellingClass = this.state.belling ? 'belling' : '';
    let {curDevice, curLocTime} = this.props;
    if (curDevice) {
      let deviceStatus;
      if (curDevice.isPosi) {
        deviceStatus = 'positioning';
      } else {
        if (curLocTime) {
          deviceStatus = 'positioning';
        } else {
          if (curDevice.OnlineStatus) {
            deviceStatus = 'online';
          } else {
            deviceStatus = 'offline';
          }
        }
      }

      let infoName;
      let spin;
      if (deviceStatus === 'positioning') {
        infoName = '定位中...';
        spin = 'spin';
      } else {
        infoName = formatTime(curDevice.LocationTime);
        spin = '';
      }

      if (this.props.onlyHandle) {
        return (
          <div className="only-handle">
            <div className={`handle-item`} onClick={this.openModal.bind(this, 'LockModal')}>
              <p><i className="icon_lock"/></p>
              <p><span>锁定</span></p>
            </div>
            <div className={`handle-item`} onClick={this.openModal.bind(this, 'EraseModal')}>
              <p><i className="icon_erase"/></p>
              <p><span>擦除</span></p>
            </div>
          </div>
        )
      } else {
        return (
          <div className={`custom-info-window ${deviceStatus}`}>
            <div className="info-window-title">
              <p className="info-name">{curDevice.DeviceName || curDevice.UDID}</p>
              <span className="info-time">{infoName}</span>
              <i className={`icon_refresh ${spin}`} onClick={this.refresh.bind(this, curDevice.UDID)}/>
            </div>
            <div className="info-window-content">
              <div className={`handle-item`} onClick={this.openModal.bind(this, 'BellModal')}>
                <p id="Belling"><i className="icon_bell"/></p>
                <p><span>响铃</span></p>
              </div>
              <div className={`handle-item`} onClick={this.openModal.bind(this, 'LockModal')}>
                <p><i className="icon_lock"/></p>
                <p><span>锁定</span></p>
              </div>
              <div className={`handle-item`} onClick={this.openModal.bind(this, 'EraseModal')}>
                <p><i className="icon_erase"/></p>
                <p><span>擦除</span></p>
              </div>
            </div>
          </div>
        )
      }

    } else {
      return <div></div>
    }
  }
}

export default InfoWindowContent;