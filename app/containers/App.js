/**
 * Created by go_songs on 2017/3/1.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Hello from '../components/Hello';
import {sayHello} from '../actions/index';

import '../scss/reset.scss';
import '../scss/main.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(sayHello('Hello World!'));
  }

  render() {
    return (
      <div>
        <Hello {...this.props}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {helloReducer} = state;
  const {hello} = helloReducer;

  return {
    hello
  }
};

export default connect(mapStateToProps)(App);