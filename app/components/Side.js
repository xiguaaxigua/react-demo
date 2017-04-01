/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import MyDevice from './MyDevice';
import DeviceList from './DeviceList';

class Side extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {list} = this.props;
    let deviceNum = 0;
    let onlineNum = 0;
    if (list) {
      for(let udid in list){
        deviceNum++;
        if(list[udid].OnlineStatus){
          onlineNum++;
        }
      }
    }
    return (
      <div className="side-container">
        <MyDevice deviceNum={deviceNum} onlineNum={onlineNum}/>
        <div className="device">
          <DeviceList {...this.props}/>
        </div>
      </div>
    )
  }
}

export default Side;