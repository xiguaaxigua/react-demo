/**
 * Created by go_songs on 2017/3/13.
 */
import React, {Component, PropTypes} from 'react';
import {
  currIcon,
  currIconOffline,
  currIconLocked,
  currIconOfflineLocked,
  otherIcon,
  otherIconLocked,
  otherIconOffline,
  otherIconOfflineLocked
} from '../constants/Config';

class Marker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.mapLoadStatus) {
      const map = this.props.map;
      const device = this.props.currentDevice;
      const title = device.DeviceName || device.UDID;
      const lockState = device.LockState;
      const status = device.OnlineStatus;
      const lat = device.Lat;
      const lon = device.Lon;
      let markerIcon;
      if (status) {
        if (lockState) {
          markerIcon = currIconLocked;
        } else {
          markerIcon = currIcon;
        }
      } else {
        if (lockState) {
          markerIcon = currIconOfflineLocked;
        } else {
          markerIcon = currIconOffline;
        }
      }
      const currentMarker = new AMap.Marker({
        map: map,
        icon: markerIcon,
        position: [lat, lon],
        offset: new window.AMap.Pixel(-12, -36),
        title: title
      });
    }
    return (
      <div>

      </div>
    )
  }
}

export default Marker;