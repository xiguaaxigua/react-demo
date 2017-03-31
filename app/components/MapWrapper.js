/**
 * Created by go_songs on 2017/3/28.
 */
import React, {Component, PropTypes} from 'react';
import MultiMap from './MultiMap';

class MapWrapper extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {curDevice} = this.props;
    console.info(curDevice)
    if (curDevice) {
      if (curDevice.Lon && curDevice.Lat) {
        return (
          <MultiMap {...this.props}></MultiMap>
        )
      } else {
        return (
          <div>dangqianc城市</div>
        )
      }
    }else{
      return <div></div>
    }
  }
}

export default MapWrapper;