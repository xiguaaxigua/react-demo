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
import {getList, setCurDevice, getOneLoc, setCurrentModal, setCurLocTime} from '../actions/index';
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
      ins: '',
      isFirst: true
    }
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
      let device = newProps.list[newProps.curDevice];

      if (newProps.list && newProps.curDevice) {
        let nextD = newProps.list[newProps.curDevice];
        if (+nextD.Lon && +nextD.Lat && this.props.currentModal === 'InfoWindowModal') {
          // 正常显示
          this.setState({
            mapCenter: {longitude: nextD.Lon, latitude: nextD.Lat}
          });
          dispatch(setCurrentModal(''));
          dispatch(setCurLocTime(null));
        }
      }

      if (this.state.isFirst) {
        if (+device.Lat && +device.Lon) {

        } else {
          dispatch(setCurrentModal('InfoWindowModal'));
          this.setState({
            mapCenter: {longitude: 116.397428, latitude: 39.90923}
          });
        }
      }

      if (this.props.curDevice !== newProps.curDevice) {
        this.setState({
          isFirst: false
        });
        if (+device.Lat && +device.Lon) {
          // 切换设备, 改变地图中心点
          let curD = newProps.list[newProps.curDevice];
          this.setState({
            mapCenter: {longitude: curD.Lon, latitude: curD.Lat}
          });
        } else {
          //无效位置
          dispatch(setCurrentModal('InfoWindowModal'));
          this.setState({
            mapCenter: {longitude: 116.397428, latitude: 39.90923}
          });
        }
      }
    }
  }

  /**
   * markers
   */
  renderMarkers() {
    let markerIcon, markerOffset, markers = [];
    const {list, curDevice} = this.props;

    if (list && curDevice) {
      let curD = list[curDevice];
      for (let udid in list) {
        let device = list[udid];
        if (curD.UDID === device.UDID) {
          markerOffset = [-31, -78];
          if (curD.LockState === 0) {
            if (curD.OnlineStatus) {
              markerIcon = currIcon; // 当前在线未锁定
            } else {
              markerIcon = currIconOffline; // 当前离线未锁定
            }
          } else {
            if (curD.OnlineStatus) {
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
            dispatch(setCurDevice(device.UDID));
            if (+device.Lat && +device.Lon) {
              this.setState({
                mapCenter: {longitude: device.Lon, latitude: device.Lat}
              });
            } else {
              dispatch(setCurrentModal('InfoWindowModal'))
            }
          }
        };
        if (+device.Lon && +device.Lat) {
          let marker = (
            <Marker key={udid}
                    extData={{device: device}}
                    position={{longitude: device.Lon, latitude: device.Lat}}
                    offset={markerOffset}
                    events={markerEvents}>
              <img src={markerIcon} alt=""/>
            </Marker>
          );
          markers.push(marker);
        } else {
          markers.push(<div key={udid}></div>);
        }
      }
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
      for (let udid in list) {
        let d = list[udid];
        if (udid === curDevice && +d.Lon && +d.Lat) {
          infoWindow = (
            <InfoWindow
              position={{longitude: d.Lon || 115, latitude: d.Lat || 30}}
              visible={this.state.infoWindowVisible}
              isCustom
              offset={infoWindowOffset}>
              <InfoWindowContent {...this.props}/>
            </InfoWindow>
          )
        }
      }
    }
    return infoWindow;
  }

  closeModal() {
    const {dispatch} = this.props;
    dispatch(setCurrentModal(''));
  }

  renderInfoWindowModal() {
    const {currentModal, curDevice, list} = this.props;
    let deviceName = '';
    if (curDevice && list) {
      let d = list[curDevice];
      deviceName = d.DeviceName || d.UDID;
      if (d.OnlineStatus) {
        return (
          <Modal
            isOpen={currentModal === 'InfoWindowModal'}
            contentLabel="Modal"
          >
            <InfoWindowContent {...this.props}/>
          </Modal>
        )
      } else {
        return (
          <Modal
            isOpen={currentModal === 'InfoWindowModal'}
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
    } else {
      return <div></div>;
    }
  }

  render() {
    const {curDevice, list, dispatch} = this.props;

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
    let marker = <div></div>;
    let infoWindow = <div></div>;
    if (list && curDevice) {
      let d = list[curDevice];
      if (+d.Lon && +d.Lat) {
        marker = this.renderMarkers();
        infoWindow = this.renderInfoWindow();
        // console.info('当前设备经纬度: ' + d.Lat + ',' + d.Lon);
      } else {
        // 显示当前城市
        if (this.state.ins) {
          this.state.ins.clearMap(); // 清除其他覆盖物
        }
        // console.log('当前设备经纬度无效, 默认为天安门坐标')
      }
    }

    console.log('render mmmmmap')
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
