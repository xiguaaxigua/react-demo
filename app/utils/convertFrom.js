/**
 * Created by go_songs on 2017/3/28.
 */
import $ from 'jquery';

// http://restapi.amap.com/v3/assistant/coordinate/convert?locations=116.481499,39.990475&coordsys=gps&output=json&key=4e70f650e9d05a1ba486620a39bf9250
export const convertFrom = (longitude, latitude) => {
  if (+longitude && +latitude) {
    let protocol = window.location.protocol || 'https:';
    let type = 'gps';
    let key = '4e70f650e9d05a1ba486620a39bf9250';
    let url = `${protocol}//restapi.amap.com/v3/assistant/coordinate/convert`;
    url += '?locations=' + longitude + ',' + latitude;
    url += '&coordsys=' + type + '&output=json';
    url += '&key=' + key;

    let output;
    $.ajax({
      type: 'GET',
      url: url,
      async: false,
      success: function (res) {
        // 转换成功
        output = res.locations.split(',')
      },
      error: function (res) {
        // 转换失败
        console.error('GPS坐标转高德坐标失败!');
      }
    });

    return output;
  } else {
    return [0, 0]
  }
};