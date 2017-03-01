/**
 * Created by go_songs on 2017/3/1.
 */
import * as types from '../constants/ActionTypes';

const initialState = {
  hello: 'hello'
};

const helloReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAY_HELLO:
      return {...state, hello: action.hello};
    default: {
      return {}
    }
  }
};

export default helloReducer;
