/**
 * Created by go_songs on 2017/3/1.
 */
import * as types from '../constants/ActionTypes';

const initialState = {
  noDevice: false
};

const phoneReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DEVICE_LIST:
      return {...state, deviceList: action.deviceList};
    case types.CURRENT_DEVICE:
      return {...state, currentDevice: action.currentDevice};
    case types.IS_MULTI:
      return {...state, isMulti: action.isMulti};
    case types.NEW_LOCATION:
      return {...state, newLocation: action.newLocation};
    case types.SET_POSITIONING:
      return {...state, positioning: action.positioning};
    case types.CURRENT_MODAL:
      return {...state, currentModal: action.currentModal};
    case types.CAN_GET_ALL:
      return {...state, canGetAll: action.canGetAll};
    case types.CURRENT_POSITION:
      return {...state, currentPosition: action.currentPosition};


    case types.LIST:
      return {...state, list: action.list};
    case types.NEW_LIST:
      return {...state, newList: action.newList};
    case types.CUR_DEVICE:
      return {...state, curDevice: action.curDevice};
    case types.CUR_LOC_TIME:
      return {...state, curLocTime: action.curLocTime};
    case types.CUR_LOCK_TIME:
      return {...state, curLockTime: action.curLockTime};
    case types.BELL_TIME:
      return {...state, curBellTime: action.curBellTime};
    case types.CUR_ERASE_TIME:
      return {...state, curEraseTime: action.curEraseTime};
    case types.NO_DEVICE:
      return {...state, noDevice: action.noDevice};
    default: {
      return {}
    }
  }
};

export default phoneReducer;
