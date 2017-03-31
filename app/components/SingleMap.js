/**
 * Created by go_songs on 2017/3/14.
 */
import React, {Component, PropTypes} from 'react';
import {Map, Marker, InfoWindow} from '../libs/ReactAMap/lib/index';
import InfoWindowContent from './InfoWindowContent';
import {
  AMAP_SDK_KEY,
  currIcon,
  currIconOffline,
  currIconLocked,
  currIconOfflineLocked,
  otherIcon,
  otherIconLocked,
  otherIconOffline,
  otherIconOfflineLocked
} from '../constants/Config';

class SingleMap extends Component {
  constructor(props) {
    super(props);
    this.renderMarker = ::this.renderMarker;
    this.renderInfoWindow = ::this.renderInfoWindow;
    this.state = {
      infoWindowVisible: true
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      infoWindowVisible: true
    })
  }

  renderMarker() {
    let {currentDevice} = this.props;
    let marker, markerIcon, markerOffset = [-31, -78];
    if (currentDevice) {
      if (currentDevice.LockState === 0) {
        if (currentDevice.Status) {
          markerIcon = currIcon; // 当前在线未锁定
        } else {
          markerIcon = currIconOffline; // 当前离线未锁定
        }
      } else if (currentDevice.LockState === 1) {
        if (currentDevice.Status) {
          markerIcon = currIconLocked; // 当前在线锁定
        } else {
          markerIcon = currIconOfflineLocked; // 当前离线锁定
        }
      }
      const markerEvents = {
        click: () => {
          this.setState({
            infoWindowVisible: true
          })
        }
      };
      marker = (
        <Marker position={{longitude: currentDevice.Lon, latitude: currentDevice.Lat}}
                offset={markerOffset}
                events={markerEvents}>
          <img src={markerIcon} alt=""/>
        </Marker>
      )
    }
    return marker;
  }

  renderInfoWindow() {
    let {currentDevice} = this.props;
    let infoWindow;
    let infoWindowOffset = [0, -80];
    if (currentDevice) {
      infoWindow = (
        <InfoWindow
          position={{longitude: currentDevice.Lon, latitude: currentDevice.Lat}}
          visible={this.state.infoWindowVisible}
          isCustom
          offset={infoWindowOffset}>
          <InfoWindowContent device={currentDevice}/>
        </InfoWindow>
      )
    }
    return infoWindow;
  }

  render() {
    let {currentDevice} = this.props;
    if (currentDevice) {
      const mapEvents = {
        click: () => {
          this.setState({
            infoWindowVisible: false
          })
        }
      };
      return (
        <div style={{height: "100%", width: "100%"}}>
          <Map
            events={mapEvents}
            zoom={11}
            center={{longitude: currentDevice.Lon, latitude: currentDevice.Lat}}
            plugins={['ToolBar', 'Scale', 'OverView']}
            key={AMAP_SDK_KEY}>
            {this.renderMarker()}

            {this.renderInfoWindow()}
          </Map>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

export default SingleMap;
