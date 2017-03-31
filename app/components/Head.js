/**
 * Created by go_songs on 2017/3/7.
 */
import React, {Component, PropTypes} from 'react';
import HeadLeft from './HeadLeft';
import HeadRight from './HeadRight';

class Head extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="head-container">
        <HeadLeft {...this.props}/>
        <HeadRight {...this.props}/>
      </div>
    )
  }
}

export default Head;