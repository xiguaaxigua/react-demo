/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import ScrollBar from '../libs/ScrollBar/index';
import {setCurDevice, setCurrentModal, setCurLocTime} from '../actions/index';
import {imgPrefix} from '../constants/Config';

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.renderDeviceList = ::this.renderDeviceList;
    this.checkDevice = ::this.checkDevice;
    this.state = {
      list: '',
      curDevice: ''
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      curDevice: newProps.curDevice,
      list: newProps.list
    });
  }

  checkDevice(d) {
    const {dispatch} = this.props;
    if (+d.Lon && +d.Lat) {
      dispatch(setCurrentModal(''));
    } else {
      // 无效位置数据
      dispatch(setCurrentModal('InfoWindowModal'));
    }
    dispatch(setCurLocTime(null));
    dispatch(setCurDevice(d.UDID));
  }

  renderDeviceList() {
    const {list, curDevice} = this.props;
    if (list && curDevice) {
      let deviceList = [];
      for (let udid in list) {
        // 设备列表状态
        let device = list[udid];

        // 电量 && 在线信息
        let isOnline, isOnlineTxt, elec;
        if (device.OnlineStatus) {
          // 在线设备显示电量, 离线设备不显示电量
          elec = (
            <div className="device-stat">
              <span className="battery-value">{(device.Elec || 0) + '%'}</span>
              <span className="battery">
                <span style={{width: (device.Elec || 0) + '%'}}/>
              </span>
            </div>
          );
          isOnline = 'online';
          isOnlineTxt = <span className="online">在线</span>;
        } else {
          elec = '';
          isOnline = 'offline';
          isOnlineTxt = <span className="offline">离线</span>;
        }
        let active = curDevice === device.UDID ? 'active' : '';

        // 侧栏手机图标
        let deviceIcon;

        switch (device.LockState) {
          case 0: // 未锁定
            deviceIcon = <i className={`icon_phone_icon ${isOnline}`}/>;
            break;
          case 1: // 锁定
            deviceIcon = <i className={`icon_phone_locked ${isOnline}`}/>;
            break;
          case 2: // 等待锁定
            deviceIcon = (
              <i className={`icon_wait_lock ${isOnline}`}>
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            );
            break;
          default:
            deviceIcon = <i className={`icon_phone_icon ${isOnline}`}/>;
            break;
        }

        deviceList.push(
          <div key={udid} className={`device-item ${active}`} onClick={this.checkDevice.bind(this, device)}>
            <div className="device-icon">
              {deviceIcon}
            </div>
            <div className="device-info">
              <p className="device-name">{device.DeviceName || device.UDID}</p>
              <p className="device-is-online">{isOnlineTxt}</p>
            </div>
            {elec}
          </div>
        )
      }
      return deviceList;
    }
  }

  render() {
    return (
      <ScrollBar style={{width: '100%', height: '100%'}}
                 autoHide
                 autoHideTimeout={200}
                 autoHideDuration={200}>
        <div className="device-list">
          {this.renderDeviceList()}
        </div>
      </ScrollBar>
    )
  }
}

export default DeviceList;