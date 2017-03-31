import React from 'react';
import { findDOMNode, render } from 'react-dom';
import isFun from '../../lib/utils/isFun';
import toCapitalString from '../../lib/utils/toCapitalString';
import log from '../../lib/utils/log';
/*
 * props
 * {
 *  __map__ 父级组件传过来的地图实例
 * }
 */

const Component = React.Component;
const Children = React.Children;

const defaultOpts = {
  offset: [0, -30],
  closeWhenClickMap: false,
};

const configurableProps = [
  'content',
  'position',
  'size',
  /* 以下属性是本插件的扩展 */
  'visible',
  
  /* 这个 setOffset  方法高德并没有明确在文档中列出来，不确定会不会撤销 */
  'offset',
];

const allProps = configurableProps.concat([
  'isCustom',
  'autoMove',
  'closeWhenClickMap',
  'showShadow',
]);

class InfoWindow extends Component {
  constructor(props) {
    super(props);
    if (!props.__map__) {
      log.warning('MAP_INSTANCE_REQUIRED');
    } else {
      this.map = props.__map__;
      this.element = props.__ele__;
      this.isCustom = true;
      this.createInfoWindow(props);
    }
  }
  
  componentDidMount() {
    if (this.map) {
      const props = this.props;
      if ('visible' in props) {
        if (!!props.visible) {
          this.showWindow();
          this.setClassName(props);
          this.setChild(props);
        } else {
          this.closeWindow();
        }
      }
    }
  }
  
  shouldComponentUpdate(){
    return false;
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.map) {
      this.refreshWindowLayout(nextProps);
    }
  }
  
  createInfoWindow(props) {
    const options = this.buildCreateOptions(props);
    this.infoWindow = new window.AMap.InfoWindow(options);
    const events = this.exposeWindowInstance(props);
    events && this.bindWindowEvents(events);
  }
  
  refreshWindowLayout(nextProps) {
    configurableProps.forEach((key) => {
      if (key in nextProps) {
        if (this.checkPropChanged(key, nextProps)) {
          if (key === 'visible') {
            if (nextProps.visible) {
              this.showWindow();
            } else {
              this.closeWindow();
            }
          } else {
            const setterName = `set${toCapitalString(key)}`;
            const setterValue = this.getSetterValue(key, nextProps[key]);
            this.infoWindow[setterName](setterValue);
          }
        }
      }
    });
    this.setChild(nextProps);
    this.setClassName(nextProps);
  }
  
  checkPropChanged(key, nextProps) {
    return this.props[key] !== nextProps[key];
  }
  
  showWindow() {
    this.infoWindow.open(this.map, this.infoWindow.getPosition());
  }
  
  closeWindow() {
    this.infoWindow.close();
  }
  
  buildCreateOptions(props) {
    const options = {};
  
    // 如果开发者没有设置 isCustom 属性，默认设置为 false
    if ('isCustom' in props) {
      options.isCustom = !!props.isCustom;
    } else {
      options.isCustom = false;
    }
  
    if ('content' in props) {
      options.content = props.content;
    } else {
      this.infoDOM = document.createElement('div');
      options.content = this.infoDOM;
    }
  
    // if (options.isCustom) {
    //   if ('content' in props) {
    //     options.content = props.content;
    //     console.warn('更推荐不定义 content（默认），组件内部的实现可以直接以 JSX 语法写窗体内容。');
    //   } else {
    //     this.infoDOM = document.createElement('div');
    //     options.content = this.infoDOM;
    //   }
    // } else {
    //   if ('content' in options) {
    //     options.content = props.content;
    //     console.warn('更推荐设置 isCustom 为 true 可以直接以 JSX 语法写窗体内容。')
    //   } else {
    //     //
    //   }
    // }
    allProps.forEach((key) => {
      if (key in props) {
        if (['visible', 'isCustom', 'content'].indexOf(key) === -1) {
          options[key] = this.getSetterValue(key, props[key]);
        }
      }
    });
    return options;
  }
  
  getSetterValue(key, value) {
    if (key === 'size') {
      return this.buildSize(value);
    }
    if (key === 'offset') {
      return this.buildPixel(value);
    }
    if (key === 'position') {
      return this.buildPosition(value);
    }
    return value;
  }
  
  buildSize(size) {
    if ('getWidth' in size) {
      return size;
    }
    return new window.AMap.Size(size.width, size.height);
  }
  
  buildPosition(pos) {
    if ('getLng' in pos) {
      return pos;
    }
    return new window.AMap.LngLat(pos.longitude, pos.latitude);
  }
  
  buildPixel(os) {
    if ('getX' in os) {
      return os;
    }
    return new window.AMap.Pixel(os[0], os[1]);
  }
  
  
  exposeWindowInstance(props) {
    if ('events' in props) {
      const events = props.events || {};
      if (isFun(events.created)) {
        events.created(this.infoWindow);
      }
      delete events.created;
      return events;
    }
    return false;
  }
  
  bindWindowEvents(events) {
    const list = Object.keys(events);
    list.length && list.forEach((evName) => {
      this.infoWindow.on(evName, events[evName]);
    });
  }
  
  setChild(props) {
    const child = props.children;
    if (this.infoDOM && child) {
      if (Children.count(child) === 1) {
        render(child, this.infoDOM);
      } else {
        render(<div>{props.children}</div>, this.infoDOM);
      }
    } else {
      if (props.children) {
        console.warn('因为你设置 isCustom 为 true，InfoWindow 的 Children 被忽略');
      }
    }
  }
  
  setClassName(props) {
    let baseClsValue = '';
    if (props.isCustom === true) {
      baseClsValue = 'custom-info-window ';
    }
    if (this.infoDOM) {
      // 刷新 className
      if ('className' in props) {
        baseClsValue += props.className;
      }
      this.infoDOM.className = baseClsValue;
    }
  }
  
  render() {
    return (null);
  }
}

export default InfoWindow;
