/**
 * Created by go_songs on 2017/3/15.
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../libs/Modal/index';
import {setCurrentModal} from '../actions/index';

class OfflineModal extends Component {
  constructor(props) {
    super(props);
    this.closeAddModal = ::this.closeAddModal;
  }

  closeAddModal() {
    const {dispatch} = this.props;
    dispatch(setCurrentModal(''));
  }

  render() {
    const {currentDevice, currentModal} = this.props;
    if (currentDevice) {
      let name = currentDevice.DeviceName || currentDevice.UDID;
      return (
        <Modal
          isOpen={currentModal === 'OfflineModal'}
          onRequestClose={this.closeAddModal}
          contentLabel="Modal"
        >
          <div className="modal-header">
            <i className="icon icon-clear"/>
          </div>
          <div className="modal-content">
            {name}处于离线状态，你仍然可以对设备进行锁定和擦除，等设备连接网络或上线后，立即进行修改。
          </div>
          <div className="modal-footer">
            <div className="device-lost">
              <div className="handle-item">
                <p><i className="icon icon-lock"/></p>
                <p><span>锁定</span></p>
              </div>
              <div className="handle-item">
                <p><i className="icon icon-erase"/></p>
                <p><span>擦除</span></p>
              </div>
            </div>
          </div>
        </Modal>
      )
    } else {
      return <div></div>
    }
  }
}

export default OfflineModal;