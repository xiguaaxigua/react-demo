/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';

class MyDevice extends Component{
  render(){
    return (
      <div className="my-device">
        <p>我的酷派设备</p>
        <p>共{this.props.deviceNum}台设备，{this.props.onlineNum}台在线</p>
      </div>
    )
  }
}

export default MyDevice;