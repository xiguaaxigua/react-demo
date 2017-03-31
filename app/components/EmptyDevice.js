/**
 * Created by go_songs on 2017/3/8.
 */
import React, {Component, PropTypes} from 'react';

class EmptyDevice extends Component{
  render(){
    return (
      <div className="empty-device">
        <div className="empty-logo">
          <img src="../assets/images/logo.png" alt=""/>
        </div>
        <div className="empty-txt">
          <h2>没有发现设备</h2>
          <p>你是否开启了查找手机服务？</p>
          <p>请在“设置” &gt; “我的众思” 中打开 “查找手机” 选项来开启此服务。</p>
        </div>
        <div className="empty-phone">
          <img src="../assets/images/empty_phone.png" alt="" />
        </div>
      </div>
    )
  }
}

export default EmptyDevice;