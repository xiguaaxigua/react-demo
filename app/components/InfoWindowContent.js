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
    const {dispatch, curDevice, list, curLocTime, curLockTime, curBellTime, serverTime} = this.props;
    // console.info(newProps)
    let d = list[curDevice];
    if (newProps.curDevice === curDevice) {
      if (curLocTime && serverTime - curLocTime > 60000 && newProps.list[curDevice].LocationTime <= curLocTime) {
        console.log('超时, 暂时无法定位');
        ThrowMsg('暂时无法定位');
        dispatch(setCurLocTime(null));
      }

      if (newProps.newList) {
        // if (newProps.newList.LocationTime - curLocTime > 10000) {
        //   console.log('超时')
        //   ThrowMsg('超时');
        // }

        for (let udid in newProps.newList) {
          if (udid === curDevice) {
            let c = newProps.newList[udid];

            // if(c.LocationTime > curLocTime){
            //   dispatch(setCurLocTime(null));
            // }

            if (c.BellState === 3 && c.BellTime > curBellTime) {
              console.log('设备正在响铃');
              ThrowMsg('设备正在响铃');
              // $('#Belling').html('Hi'); // todo 响铃动画
              dispatch(setBellTime(c.BellTime));
            }

            if (curBellTime && c.BellState === 2 && c.BellTime > curBellTime) {
              console.log('手机端的响铃已停止');
              ThrowMsg('手机端的响铃已停止');
              // $('#Belling').html('<i className="icon_bell"></i>');
              dispatch(setBellTime(''));
            }

            if (curBellTime && c.BellState === 1 && c.BellTime > curBellTime) {
              console.log('手机端的响铃已人为关闭');
              ThrowMsg('手机端的响铃已人为关闭');
              // $('#Belling').html('<i className="icon_bell"></i>');
              dispatch(setBellTime(''));
            }

            if (c.LockState === 1 && c.LockTime > curLockTime) {
              console.log('已成功锁定手机');
              ThrowMsg('已成功锁定手机');
              dispatch(setCurLockTime(c.LockTime));
            }

            if (curLockTime && c.LockState === 0 && c.LockTime > curLockTime) {
              console.log('手机端的锁定已被人为破解');
              ThrowMsg('手机端的锁定已被人为破解');
              dispatch(setCurLockTime(''));
            }

            if (c.EraseState === 1 && c.EraseTime > curEraseTime) {
              console.log('已成功擦除手机');
              ThrowMsg('已成功擦除手机');
              dispatch(setEraseTime());
            }
          }
        }
      }
    }
  }

  openModal(whichModal) {
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    if (whichModal === 'BellModal' && !d.OnlineStatus) {
      return false;
    }
    dispatch(setCurrentModal(whichModal));
  }

  refresh(udid) {
    const {dispatch, curLocTime, curDevice, list} = this.props;
    let d = list[curDevice];
    if (curLocTime) return false;
    if (d.OnlineStatus) {
      // 只有在线设备可以定位
      dispatch(getOneLoc([udid]));
    } else {
      ThrowMsg('查找不到手机，暂时无法定位');
    }
  }

  render() {
    let bellingClass = this.state.belling ? 'belling' : '';
    let {curDevice, curLocTime, list} = this.props;
    if (curDevice) {
      let d = list[curDevice];
      let deviceStatus;
      if (d.isPosi) {
        deviceStatus = 'positioning';
      } else {
        if (curLocTime) {
          deviceStatus = 'positioning';
        } else {
          if (d.OnlineStatus) {
            deviceStatus = 'online';
          } else {
            deviceStatus = 'offline';
          }
        }
      }

      let infoName;
      let spin;
      infoName = formatTime(d.LocationTime);
      spin = '';

      if (deviceStatus === 'positioning') {
        infoName = '定位中...';
        spin = 'spin';
      } else if (!+d.Lon || !+d.Lat) {
        infoName = '暂时无法定位';
      }


      if (this.props.onlyHandle) {
        let bell = <div></div>;
        if (d.OnlineStatus) {
          // 现在没位置也可以响铃
          bell = (
            <div className={`handle-item`} onClick={this.openModal.bind(this, 'BellModal')}>
              <p id="Belling"><i className="icon_bell"/></p>
              <p><span>响铃</span></p>
            </div>
          );
        }
        return (
          <div className="only-handle">
            {bell}
            <div className={`handle-item`} onClick={this.openModal.bind(this, 'LockModal')}>
              <p><i className="icon_lock"/></p>
              <p><span>锁定</span></p>
            </div>
            <div className={`handle-item`} onClick={this.openModal.bind(this, 'EraseModal')}>
              <p><i className="icon_erase"/></p>
              <p><span>擦除</span></p>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`custom-info-window ${deviceStatus}`}>
            <div className="info-window-title">
              <p className="info-name">{d.DeviceName || d.UDID}</p>
              <p className="info-time">{infoName}</p>
              <i className={`icon_refresh ${spin}`} onClick={this.refresh.bind(this, d.UDID)}/>
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