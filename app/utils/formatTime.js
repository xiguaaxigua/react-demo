/**
 * Created by go_songs on 2017/3/8.
 */
const formatTime = (time) => {
  const t = Date.parse(new Date());
  const diff = t - time;
  if (time === 0) {
    return '未知';
  }
  if (diff > 0 && diff <= 60) {
    return '1分钟以前';
  }
  if (diff > 60 && diff <= 180) {
    return '3分钟以前';
  }
  if (diff > 180 && diff <= 300) {
    return '5分钟以前';
  }
  if (diff > 300 || diff <= 0) {
    return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
  }
};

export default formatTime;