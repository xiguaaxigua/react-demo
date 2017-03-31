/**
 * Created by go_songs on 2017/3/25.
 */
import React, {Component, PropTypes} from 'react';
import {Map, Marker, InfoWindow} from '../libs/ReactAMap/lib/index';
import InfoWindowContent from './InfoWindowContent';
import Modal from '../libs/Modal/index';
import {
  MAP_SDK_KEY,
  currIcon,
  currIconOffline,
  currIconLocked,
  currIconOfflineLocked,
  otherIcon,
  otherIconLocked,
  otherIconOffline,
  otherIconOfflineLocked
} from '../constants/Config';
import {getList, setCurDevice, setNoDevice, setCurrentModal} from '../actions/index';
import {convertFrom} from '../utils/convertFrom.js';

class MultiMap extends Component {
  constructor(props) {
    super(props);
    this.renderMarkers = ::this.renderMarkers;
    this.renderInfoWindow = ::this.renderInfoWindow;
    this.closeModal = ::this.closeModal;
    this.state = {
      mapCenter: {longitude: 116.397428, latitude: 39.90923},
      infoWindowVisible: true,
      list: [],
      ins: ''
    }
  }

  componentWillMount() {
    // const {dispatch} = this.props;
    // dispatch(getList());
  }

  componentWillReceiveProps(newProps) {
    const {dispatch} = this.props;
    let finalList = [];
    if (newProps.newList && newProps.newList.length) {
      finalList = newProps.newList;
    } else if (newProps.list) {
      finalList = newProps.list;
    }
    this.setState({
      list: finalList
    });
    if (newProps.curDevice && this.props.curDevice) {
      // 切换设备, 改变地图中心点
      if (this.props.curDevice.UDID !== newProps.curDevice.UDID) {
        this.setState({
          mapCenter: {longitude: newProps.curDevice.Lon || 116.397428, latitude: newProps.curDevice.Lat || 39.90923}
        });
        if (this.state.ins.getZoom() === 3) {
          this.state.ins.setZoom(13)
        }

        if (!newProps.curDevice.Lat || !newProps.curDevice.Lon) {
          dispatch(setCurrentModal('InfoWindowModal'))
        }
      }
    }
  }

  /**
   * markers
   */
  renderMarkers() {
    let markerIcon, markerOffset, markers;
    const {list, curDevice} = this.props;

    if (list && curDevice) {
      let devices = list.Locations;
      markers = devices.map((device, i) => {
        // 设置 marker 样式
        if (device.UDID === curDevice.UDID) {
          markerOffset = [-31, -78];
          if (curDevice.LockState === 0) {
            if (curDevice.OnlineStatus) {
              markerIcon = currIcon; // 当前在线未锁定
            } else {
              markerIcon = currIconOffline; // 当前离线未锁定
            }
          } else {
            if (curDevice.OnlineStatus) {
              markerIcon = currIconLocked; // 当前在线锁定
            } else {
              markerIcon = currIconOfflineLocked; // 当前离线锁定
            }
          }
        } else {
          // 其他设备
          markerOffset = [-18, -18];
          if (device.LockState === 0) {
            if (device.OnlineStatus) {
              markerIcon = otherIcon; // 其他在线未锁定
            } else {
              markerIcon = otherIconOffline; // 其他离线未锁定
            }
          } else {
            if (device.OnlineStatus) {
              markerIcon = otherIconLocked; // 其他在线锁定
            } else {
              markerIcon = otherIconOfflineLocked; // 其他离线锁定
            }
          }
        }
        const markerEvents = {
          click: (e) => {
            let device = e.target.getExtData().device;
            const {dispatch} = this.props;
            dispatch(setCurDevice(device));
            if (!device.Lat || !device.Lon) {
              dispatch(setCurrentModal('InfoWindowModal'))
            }
          }
        };

        if (device.Lat && device.Lon && device.Lon !== "0" && device.Lat !== "0") {
          return (
            <Marker key={i}
                    extData={{device: device}}
                    position={{longitude: device.Lon, latitude: device.Lat}}
                    offset={markerOffset}
                    events={markerEvents}>
              <img src={markerIcon} alt=""/>
            </Marker>
          )
        } else {
          return <Marker key={i} visible={false}/>
        }
      });
    }
    return markers;
  }

  /**
   * info window
   */
  renderInfoWindow() {
    let infoWindow = '';
    let infoWindowOffset = [200, 40];
    const {list, curDevice} = this.props;
    if (list && curDevice) {
      list.Locations.map((device, i) => {
        if (device.UDID === curDevice.UDID) {
          if (device.Lat && device.Lon) {
            infoWindow = (
              <InfoWindow
                position={{longitude: device.Lon || 115, latitude: device.Lat || 30}}
                visible={this.state.infoWindowVisible}
                isCustom
                offset={infoWindowOffset}>
                <InfoWindowContent {...this.props}/>
              </InfoWindow>
            )
          }
        }
      });
    }
    return infoWindow;
  }

  closeModal() {
    const {dispatch} = this.props;
    dispatch(setCurrentModal(''));
  }

  renderInfoWindowModal() {
    // <InfoWindowContent {...this.props}/>
    const {currentModal, curDevice} = this.props;
    let deviceName = '';
    if (curDevice) {
      deviceName = curDevice.DeviceName || curDevice.UDID;
    }
    return (
      <Modal
        isOpen={currentModal === 'InfoWindowModal'}
        onRequestClose={this.closeAddModal}
        contentLabel="Modal"
      >
        <div className="modal-header" style={{height: '36px'}}>
          <i className="icon_clear" onClick={this.closeModal} style={{top: '6px'}}/>
        </div>
        <div className="modal-content">
          {deviceName}处于离线状态，你仍然可以对设备进行锁定和擦除，等设备连接网络或上线后，立即进行修改。
        </div>
        <div className="modal-footer" style={{padding: "0 24px"}}>
          <InfoWindowContent onlyHandle={true} {...this.props}/>
        </div>
      </Modal>
    )
  }

  render() {
    const mapEvents = {
      click: () => {
        console.log('click')
      },
      created: (ins) => {
        this.setState({
          ins
        });
      }
    };

    let {list, curDevice} = this.props;

    let marker = <div></div>;
    let infoWindow = <div></div>;
    if (list && curDevice) {
      if (curDevice.Lat && curDevice.Lon && curDevice.Lat !== "0" && curDevice.Lon !== "0") { // 坐标为0
        // 正常显示
        marker = this.renderMarkers();
        infoWindow = this.renderInfoWindow();
      } else {
        // 显示当前城市
        this.state.ins.setZoom();
        this.state.ins.setCenter();
        this.state.ins.clearMap(); // 清除其他覆盖物
      }
    }

    return (
      <div className="map-container">
        <div id="map-area">
          <Map
            center={this.state.mapCenter}
            events={mapEvents}
            plugins={['ToolBar', 'Scale', 'OverView']}
            sdkKey={MAP_SDK_KEY}>
            {marker}
            {infoWindow}
          </Map>
          {this.renderInfoWindowModal()}
        </div>
      </div>
    )
  }
}

export default MultiMap;
