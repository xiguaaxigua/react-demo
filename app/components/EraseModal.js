/**
 * Created by go_songs on 2017/3/16.
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../libs/Modal/index';
import {setCurrentModal} from '../actions/index';

class EraseModal extends Component{
  constructor(props){
    super(props);
    this.closeModal = ::this.closeModal;
  }

  closeModal(){
    const {dispatch, curDevice, list} = this.props;
    let d = list[curDevice];
    if(d){
      if(+d.Lon && +d.Lat){
        dispatch(setCurrentModal(''));
      }else{
        dispatch(setCurrentModal('InfoWindowModal'));
      }
    }
  }

  render(){
    const {dispatch} = this.props;
    return (
      <Modal
        isOpen={this.props.currentModal === 'EraseModal'}
        onRequestClose={this.closeAddModal}
        contentLabel="Modal"
      >
        <div className="modal-header">
          擦除数据
          <i className="icon icon-clear" onClick={this.closeModal}/>
        </div>
        <div className="modal-content">
          请注意！使用此功能会将手机上的数据全部清除，你也会断开与此手机的联系，是否继续擦除？
        </div>
        <div className="modal-footer" style={{textAlign: 'right'}}>
          <button className="btn btn-info" style={{width: 'auto'}} onClick={() => dispatch(setCurrentModal('EraseConfirmModal'))}>继续擦除</button>
        </div>
      </Modal>
    )
  }
}

export default EraseModal;
