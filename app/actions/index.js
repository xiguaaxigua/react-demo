/**
 * Created by go_songs on 2017/3/25.
 */
import {notify} from '../libs/Notify/index';
import * as types from '../constants/ActionTypes';
import {DEV_API, myHeaders, userID, ServiceToken} from '../constants/Config';
import md5 from 'js-md5';
import base64 from 'base-64';
import $ from 'jquery';
import {convertFrom} from '../utils/convertFrom.js';
//
// $.ajaxSetup({
//   xhrFields: {
//     withCredentials: true
//   },
//   crossDomain: true,
//   cache: false,
// });

export const setIntervalAndExecute = (fn, t) => {
  fn();
  return (setInterval(fn, t));
};

export const ThrowErr = (res) => {
  if (res.Code === 1017) {
    console.error('token 失效');
    window.location = LOGIN_URL;
  } else {
    notify.show(res.Message, 'error');
  }
  return false;
};

export const ThrowMsg = (msg) => {
  notify.show(msg, 'error');
};

const setCurrentModalAction = (currentModal) => {
  return {
    type: types.CURRENT_MODAL,
    currentModal
  }
};

export const setCurrentModal = (str) => (dispatch) => {
  dispatch(setCurrentModalAction(str));
};

const listAction = (list) => {
  return {
    type: types.LIST,
    list
  }
};

const newListAction = (newList) => {
  return {
    type: types.NEW_LIST,
    newList
  }
};

const curDeviceAction = (curDevice) => {
  return {
    type: types.CUR_DEVICE,
    curDevice
  }
};

const curLocTimeAction = (curLocTime) => {
  return {
    type: types.CUR_LOC_TIME,
    curLocTime
  }
};

const bellTimeAction = (curBellTime) => {
  return {
    type: types.BELL_TIME,
    curBellTime
  }
};

const curLockTimeAction = (curLockTime) => {
  return {
    type: types.CUR_LOCK_TIME,
    curLockTime
  }
};

const curEraseTimeAction = (curEraseTime) => {
  return {
    type: types.CUR_ERASE_TIME,
    curEraseTime
  }
};

const noDeviceAction = (noDevice) => {
  return {
    type: types.NO_DEVICE,
    noDevice
  }
};

const setServerTimeAction = (serverTime) => {
  return{
    type: types.SERVER_TIME,
    serverTime
  }
};

export const setNoDevice = (bool) => (dispatch) => {
  dispatch(noDeviceAction(bool))
};

export const setCurLocTime = (num) => (dispatch) => {
  dispatch(curLocTimeAction(num));
};

export const setCurLockTime = (num) => (dispatch) => {
  dispatch(curLockTimeAction(num));
};

export const setBellTime = (num) => (dispatch) => {
  dispatch(bellTimeAction(num));
};

export const setEraseTime = (num) => (dispatch) => {
  dispatch(curEraseTimeAction(num));
};

export const setCurDevice = (obj) => (dispatch) => {
  dispatch(curDeviceAction(obj));
};

export const getList = () => (dispatch) => {
  // 获取设备列表
  $.ajax(DEV_API + '/find/DeviceList', {
    method: 'post',
    headers: myHeaders,
    data: JSON.stringify({
      UserID: userID
    })
  })
    .then(res => {
      if (res.Code === 0) {
        let list = res.Data;
        let udids = [];
        if (list.Count) {
          dispatch(noDeviceAction(false));
          let correctList = {};
          for (let i = 0; i < list.Locations.length; i++) {
            let udid = list.Locations[i].UDID;
            correctList[udid] = list.Locations[i];

            // 坐标转换, 如果转换失败, 则使用未转换的坐标
            let lon = correctList[udid].Lon;
            let lat = correctList[udid].Lat;
            let convertData = convertFrom(lon, lat);
            if (convertData) {
              correctList[udid].Lon = convertData[0];
              correctList[udid].Lat = convertData[1];
            }
            udids.push(udid);
          }

          dispatch(curDeviceAction(udids[0]));
          dispatch(listAction(correctList));

          // 发送定位指令
          $.ajax(DEV_API + '/find/PushMessage', {
            method: 'post',
            headers: myHeaders,
            data: JSON.stringify({
              ServiceToken: 'demo token',
              UserID: userID,
              UDID: udids,
              OpType: 1004
            })
          })
            .then(res2 => {
              let msgTime;
              if (res2.Code === 0) {
                msgTime = res2.Data.ServerTime;
                let limit = 1; // 最大循环次数
                let overtime = 2; //超时次数
                let converted = {}; // 存储转换过的坐标
                // 循环 Status
                const loopStatus = setIntervalAndExecute(() => { // 开始循环, 并立即执行
                  // if(limit = 0){
                  //   clearInterval(loopStatus);
                  //   return false;
                  // }
                  dispatch(newListAction(null));
                  limit--;
                  overtime--;
                  $.ajax(DEV_API + '/find/Status', {
                    method: 'post',
                    headers: myHeaders,
                    data: JSON.stringify({
                      UDID: udids
                    })
                  })
                    .then(res3 => {
                      if (res3.Code === 0) {
                        dispatch(setServerTimeAction(res3.Data.ServerTime));
                        let isNewLoc = false;
                        let newCorrectList = {};

                        for (let i = 0; i < res3.Data.Locations.length; i++) {
                          let udid = res3.Data.Locations[i].UDID;
                          newCorrectList[udid] = res3.Data.Locations[i];
                        }

                        for (let i = 0; i < udids.length; i++) {
                          let udid = udids[i];
                          if (converted[udid] && converted[udid].Lon == newCorrectList[udid].Lon && converted[udid].Lat == newCorrectList[udid].Lat) {
                            newCorrectList[udid].Lon = converted[udid].convertedLon;
                            newCorrectList[udid].Lat = converted[udid].convertedLat;
                          } else {
                            // 存储当前位置信息, 避免重复转换
                            let Lon = newCorrectList[udid].Lon;
                            let Lat = newCorrectList[udid].Lat;
                            let convertedLon, convertedLat; // 转换过的坐标
                            let convertData = convertFrom(Lon, Lat);
                            if (convertData) {
                              convertedLon = convertData[0];
                              convertedLat = convertData[1];
                            }
                            converted[udid] = {
                              Lon, Lat, convertedLon, convertedLat
                            };
                            newCorrectList[udid].Lon = convertedLon;
                            newCorrectList[udid].Lat = convertedLat;
                          }
                          for (let key in newCorrectList[udid]) {
                            // 新位置相比旧位置来说, 有更改
                            if (newCorrectList[udid][key] !== correctList[udid][key]) {
                              // console.info(key)
                              // console.log(newCorrectList[udid][key], correctList[udid][key])
                              correctList[udid][key] = newCorrectList[udid][key];
                              isNewLoc = true;
                            }
                          }
                        }

                        if (isNewLoc) {
                          dispatch(setCurLocTime(null));
                          dispatch(newListAction(correctList));
                        }
                      } else {
                        ThrowErr(res3);
                        clearInterval(loopStatus);
                      }
                    })
                    .catch(error => {
                      clearInterval(loopStatus);
                      throw(error);
                    })
                }, 5000);
              } else {
                ThrowErr(res2);
              }
            })
        } else {
          dispatch(noDeviceAction(true));
        }
      } else {
        ThrowErr(res);
      }
    })
    .catch(error => {
      throw(error);
    })
};

export const getOneLoc = (udids) => (dispatch) => {
  $.ajax(DEV_API + '/find/PushMessage', {
    method: 'post',
    headers: myHeaders,
    data: JSON.stringify({
      ServiceToken: 'demo token',
      UserID: userID,
      UDID: udids,
      OpType: 1004
    })
  })
    .then(res => {
      if (res.Code === 0) {
        dispatch(curLocTimeAction(res.Data.ServerTime));
      } else {
        ThrowErr(res)
      }
    })
};

export const fireBell = (udid, curDevice) => (dispatch) => {
  $.ajax(DEV_API + '/find/PushMessage', {
    method: 'post',
    headers: myHeaders,
    data: JSON.stringify({
      ServiceToken: ServiceToken,
      UserID: userID,
      UDID: [udid],
      OpType: 1001
    })
  })
    .then(json => {
      if (json.Code === 0) {
        if ("MsgID" in json.Data) {
          // ThrowMsg('发送响铃命令成功');
        }

        dispatch(bellTimeAction(json.Data.ServerTime));

        if (curDevice.Lon && curDevice.Lat && curDevice.Lon != '0' && curDevice.Lat != '0') {
          dispatch(setCurrentModal(''));
        } else {
          dispatch(setCurrentModal('InfoWindowModal'));
        }
      } else {
        ThrowErr(json);
      }
    })
    .catch(error => {
      throw error;
    })
};

export const fireLock = (udid, pin, info, isOnline, curDevice) => (dispatch) => {
  $.ajax(DEV_API + '/find/PushMessage', {
    method: 'post',
    headers: myHeaders,
    data: JSON.stringify({
      ServiceToken: ServiceToken,
      UserID: userID,
      OpType: 1003,
      UDID: [udid],
      Pin: base64.encode(pin),
      prompt: info
    })
  })
    .then(json => {
      if (json.Code === 0) {
        if (isOnline) {
          // ThrowMsg('发送锁定命令成功');
        } else {
          ThrowMsg('设置锁定成功，待设备上线后，将自动锁定');
        }
        dispatch(curLockTimeAction(json.Data.ServerTime))
      } else {
        ThrowErr(json);
      }
      if (curDevice.Lon && curDevice.Lat && curDevice.Lon != '0' && curDevice.Lat != '0') {
        dispatch(setCurrentModal(''));
      } else {
        dispatch(setCurrentModal('InfoWindowModal'));
      }
    })
    .catch(error => {
      throw error;
    })
};

export const fireErase = (isOnline, psd, udid, curDevice) => (dispatch) => {
  $.ajax(DEV_API + '/find/CheckUser', {
    method: 'post',
    headers: myHeaders,
    data: JSON.stringify({
      ServiceToken: ServiceToken,
      UserID: userID,
      PassWord: md5(psd),
      UDID: [udid]
    })
  })
    .then(json => {
      if (json.Code === 0) {
        $.ajax(DEV_API + '/find/PushMessage', {
          method: 'post',
          headers: myHeaders,
          data: JSON.stringify({
            ServiceToken: ServiceToken,
            UserID: userID,
            OpType: 1002,
            UDID: [udid]
          })
        })
          .then(json2 => {
            if (json2.Code === 0) {
              if (isOnline) {
                // ThrowMsg('发送擦除命令成功');
              } else {
                ThrowMsg('设置擦除成功，待设备上线后，将自动擦除');
              }

              dispatch(curEraseTimeAction(json2.Data.ServerTime));

              if (curDevice.Lon && curDevice.Lat && curDevice.Lon != '0' && curDevice.Lat != '0') {
                dispatch(setCurrentModal(''));
              } else {
                dispatch(setCurrentModal('InfoWindowModal'));
              }
            } else {
              ThrowErr(json2);
            }
          })
          .catch(error => {
            throw error;
          })
      } else {
        ThrowErr(json);
      }
    })
    .catch(error => {
      throw error;
    })
};