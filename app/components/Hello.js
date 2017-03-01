/**
 * Created by go_songs on 2017/3/1.
 */
import React, {Component, PropTypes} from 'react';

class Hello extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1><i className="add" />{this.props.hello}</h1>
    )
  }
}

export default Hello;