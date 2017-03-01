/**
 * Created by go_songs on 2017/3/1.
 */
require('es6-promise').polyfill();
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configStore from './store/configStore';
import App from './containers/App';

const store = configStore();
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body.appendChild(document.getElementById('app'))
);
