/**
 * Created by go_songs on 2017/3/1.
 */
import * as types from '../constants/ActionTypes';

const sayHelloAction = (hello) => {
  return {
    type: types.SAY_HELLO,
    hello
  }
};

export const sayHello = (hello) => (dispatch) => {
  dispatch(sayHelloAction(hello));
};

