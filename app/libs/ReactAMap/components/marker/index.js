import React, { Component, Children } from 'react';
import { render } from 'react-dom';
import log from '../../lib/utils/log';
import isFun from '../../lib/utils/isFun';
import toCapitalString from '../../lib/utils/toCapitalString';
const configurableProps = [
  'position',
  'offset',
  'icon',
  'content',
  'draggable',
  'visible',
  'zIndex',
  'angle',
  'animation',
  'shadow',
  'title',
  'clickable',
  'cursor',
  'extData',
  'label'
];

const allProps = configurableProps.concat([
  'topWhenClick',
  'bubble',
  'raiseOnDrag',
  'cursor',
  'autoRotation',
  'shape',
]);

class Marker extends Component {
  constructor(props) {
    super(props);
    if (!props.__map__) {
      log.warning('MAP_INSTANCE_REQUIRED');
    } else {
      this.map = props.__map__;
      this.element = props.__ele__;
      this.createMarker(props);
    }
  }
  
  shouldComponentUpdate(){
    return false;
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.map) {
      this.refreshMarkerLayout(nextProps);
    }
  }

  componentDidUpdate(){
    if (this.map) {
      this.map.setFitView();
    }
  }
  
  componentDidMount() {
    if (this.map) {
      this.setChildComponent(this.props);
      this.map.setFitView();
    }
  }
  
  createMarker(props) {
    const options = this.buildCreateOptions(props);
    this.marker = new window.AMap.Marker(options);
    const events = this.exposeMarkerInstance(props);
    events && this.bindMarkerEvents(events);
    this.setMarkerLayout(props);
  }
  
  // 在创建实例时根据传入配置，设置初始化选项
  buildCreateOptions(props) {
    let opts = {};
    allProps.forEach((key) => {
      if (key in props) {
        opts[key] = this.getSetterParam(key, props[key]);
      }
    });
    opts.map = this.map;
    return opts;
  }
  
  setMarkerLayout(props) {
    if (props.children) {
      this.createContentWrapper(props);
    } else {
      //
    }
  }
  
  buildPosition(pos) {
    if ('getLng' in pos) {
      return pos;
    }
    return new window.AMap.LngLat(pos.longitude, pos.latitude);
  }
  
  buildOffset(os) {
    if ('getX' in os) {
      return os;
    }
    return new window.AMap.Pixel(os[0], os[1]);
  }
  
  
  createContentWrapper(props) {
    this.contentWrapper = document.createElement('div');
    this.marker.setContent(this.contentWrapper);
  }
  
  setChildComponent(props) {
    const child = props.children;
    const childType = typeof child;
    if (childType !== 'undefined' && this.contentWrapper) {
      if (childType === 'string') {
        render(<div>{child}</div>, this.contentWrapper);
      } else if (Children.count(child) === 1) {
        render(child, this.contentWrapper);
      } else {
        render(<div>{child}</div>, this.contentWrapper);
      }
    }
  }
  
  refreshMarkerLayout(nextProps) {
    configurableProps.forEach((key) => {
      // 必须确定属性改变才进行刷新
      if (this.props[key] !== nextProps[key]) {
        if (key === 'visible') {
          if (nextProps[key]) {
            this.marker.show();
          } else {
            this.marker.hide();
          }
        } else {
          const setterName = this.getSetterName(key);
          const param = this.getSetterParam(key, nextProps[key]);
          this.marker[setterName](param);
        }
      }
    });
    this.setChildComponent(nextProps);
  }
  
  getSetterParam(key, val) {
    if (key === 'position') {
      return this.buildPosition(val);
    } else if (key === 'offset') {
      return this.buildOffset(val)
    }
    return val;
  }
  
  // 获取设置属性的方法
  getSetterName(key) {
    switch(key) {
      case 'zIndex':
        return 'setzIndex';
      default:
        return `set${toCapitalString(key)}`;
    }
  }
  
  exposeMarkerInstance(props) {
    if ('events' in props) {
      const events = props.events;
      if (isFun(events.created)) {
        events.created(this.marker);
      }
      delete events.created;
      return events;
    }
    return false;
  }
  
  bindMarkerEvents(events) {
    const list = Object.keys(events);
    list.length && list.forEach((evName) => {
      this.marker.on(evName, events[evName]);
    });
  }
  
  render(){
    return null;
  }
}

export default Marker;