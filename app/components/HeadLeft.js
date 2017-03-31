/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import HeadLogo from './HeadLogo';

class HeadLeft extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="head-left">
        <HeadLogo />
      </div>
    )
  }
}

export default HeadLeft;