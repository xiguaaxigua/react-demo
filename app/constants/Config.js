import cookie from 'react-cookie';
// 高德地图 key
export const MAP_SDK_KEY = '4e70f650e9d05a1ba486620a39bf9250'; // 2f3d9e20103a737c0679c06ab6551feb
let ServiceToken, DEV_API, userID, token, imgPrefix, currIcon, currIconOffline, currIconLocked, currIconOfflineLocked, otherIcon, otherIconLocked, otherIconOffline, otherIconOfflineLocked;
if (process.env.NODE_ENV == "production") {
  ServiceToken = cookie.load('ServiceToken') || 'demo token';
  DEV_API = API_URL;
  userID = cookie.load('AccountID');
  imgPrefix = '/mobilefind';

  currIcon = imgPrefix + '/assets/images/current_device.svg';
  currIconOffline = imgPrefix + '/assets/images/current_device_offline.svg';
  currIconLocked = imgPrefix + '/assets/images/current_device_locked.svg';
  currIconOfflineLocked = imgPrefix + '/assets/images/current_device_offline_locked.svg';
  otherIcon = imgPrefix + '/assets/images/other_device.svg';
  otherIconLocked = imgPrefix + '/assets/images/other_device_locked.svg';
  otherIconOffline = imgPrefix + '/assets/images/other_device_offline.svg';
  otherIconOfflineLocked = imgPrefix + '/assets/images/other_device_offline_locked.svg';
} else {
  // 开发
  ServiceToken = 'd19352cc43d1222e01b792268df48a2e43d1222e01b79226';
  DEV_API = 'http://10.0.53.28:8000';
  // cookie.save('uid', '74458365');
  // cookie.save('AccountID', '74458365');
  // cookie.save('ServiceToken', 'd19352cc43d1222e01b792268df48a2e43d1222e01b79226');

  userID = '74458365';
  token = '91fb3ca8b28d3ada249c38282e17b082';
  imgPrefix = '';

  currIcon = '../assets/images/current_device.svg';
  currIconOffline = '../assets/images/current_device_offline.svg';
  currIconLocked = '../assets/images/current_device_locked.svg';
  currIconOfflineLocked = '../assets/images/current_device_offline_locked.svg';
  otherIcon = '../assets/images/other_device.svg';
  otherIconLocked = '../assets/images/other_device_locked.svg';
  otherIconOffline = '../assets/images/other_device_offline.svg';
  otherIconOfflineLocked = '../assets/images/other_device_offline_locked.svg';
}

export {
  ServiceToken,
  DEV_API,
  userID,
  token,
  imgPrefix,
  currIcon,
  currIconOffline,
  currIconLocked,
  currIconOfflineLocked,
  otherIcon,
  otherIconLocked,
  otherIconOffline,
  otherIconOfflineLocked
};

export const myHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  // 'AccountID': uid,
  // 'token': token
};
