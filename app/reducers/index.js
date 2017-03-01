/**
 * Hello World!
 * Created by jason.liu on 17/2/8.
 */
import { combineReducers } from 'redux';
import helloReducer from './helloReducer';

const rootReducer = combineReducers({
  helloReducer
});

export default rootReducer;
