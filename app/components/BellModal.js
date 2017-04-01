/**
 * Created by go_songs on 2017/3/16.
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../libs/Modal/index';
import {setCurrentModal, fireBell} from '../actions/index';

class BellModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = ::this.closeModal;
    this.fireBell = ::this.fireBell;
  }

  fireBell() {
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    dispatch(fireBell(curDevice, d));
  }

  closeModal() {
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    if (d) {
      if (+d.Lon && +d.Lat) {
        dispatch(setCurrentModal(''));
      } else {
        dispatch(setCurrentModal('InfoWindowModal'));
      }
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.currentModal === 'BellModal'}
        contentLabel="Modal"
      >
        <div className="modal-header">
          手机将以最大声响铃
          <i className="icon icon-clear" onClick={this.closeModal}/>
        </div>
        <div className="modal-content">
          即使手机设置了静音，仍然可以响铃。
        </div>
        <div className="modal-footer" style={{textAlign: 'right'}}>
          <button className="btn btn-info" style={{width: 'auto'}} onClick={this.fireBell}>确定</button>
        </div>
      </Modal>
    )
  }
}

export default BellModal;
