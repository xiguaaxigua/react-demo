var React = require('react');
var ReactDOM = require('react-dom');
var ExecutionEnvironment = require('exenv');
var ModalPortal = React.createFactory(require('./ModalPortal'));
var ariaAppHider = require('../helpers/ariaAppHider');
var elementClass = require('element-class');
var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
var Assign = require('lodash.assign');

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};
var AppElement = ExecutionEnvironment.canUseDOM ? document.body : {
  appendChild: function () {
  }
};

function getParentElement(parentSelector) {
  return parentSelector();
}

var Modal = React.createClass({

  displayName: 'Modal',
  statics: {
    setAppElement: function (element) {
      AppElement = ariaAppHider.setElement(element);
    },
    injectCSS: function () {
      "production" !== process.env.NODE_ENV
      && console.warn('React-Modal: injectCSS has been deprecated ' +
        'and no longer has any effect. It will be removed in a later version');
    }
  },

  propTypes: {
    minWidth: React.PropTypes.string,
    isOpen: React.PropTypes.bool.isRequired,
    style: React.PropTypes.shape({
      content: React.PropTypes.object,
      overlay: React.PropTypes.object
    }),
    portalClassName: React.PropTypes.string,
    appElement: React.PropTypes.instanceOf(SafeHTMLElement),
    onAfterOpen: React.PropTypes.func,
    onRequestClose: React.PropTypes.func,
    closeTimeoutMS: React.PropTypes.number,
    ariaHideApp: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    parentSelector: React.PropTypes.func,
    role: React.PropTypes.string,
    contentLabel: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
      portalClassName: 'modal',
      ariaHideApp: true,
      closeTimeoutMS: 0,
      shouldCloseOnOverlayClick: true,
      parentSelector: function () {
        return document.body;
      }
    };
  },

  componentDidMount: function () {
    this.node = document.createElement('div');
    // this.node = document.getElementById('map-area');
    this.node.className = this.props.portalClassName;

    var parent = document.getElementsByClassName('map-container')[0];
    // var parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
    this.renderPortal(this.props);
  },

  componentWillReceiveProps: function (newProps) {
    var currentParent = getParentElement(this.props.parentSelector);
    var newParent = getParentElement(newProps.parentSelector);

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }

    this.renderPortal(newProps);
  },

  componentWillUnmount: function () {
    if (this.props.ariaHideApp) {
      ariaAppHider.show(this.props.appElement);
    }

    ReactDOM.unmountComponentAtNode(this.node);
    var parent = getParentElement(this.props.parentSelector);
    parent.removeChild(this.node);
    elementClass(document.body).remove('modal-open');
  },

  renderPortal: function (props) {
    if (props.isOpen) {
      elementClass(document.body).add('modal-open');
    } else {
      elementClass(document.body).remove('modal-open');
    }

    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    this.portal = renderSubtreeIntoContainer(this, ModalPortal(Assign({}, props, {defaultStyles: Modal.defaultStyles})), this.node);
  },

  render: function () {
    return React.DOM.noscript();
  }
});

Modal.defaultStyles = {
  overlay: {
    position: 'absolute',
    top: '0',
    left: '239px',
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: 'rgba(10,27,46,0.30)'
  },
  content: {
    position: 'absolute',
    minWidth: 'auto',
    maxWidth: '304px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    //border: '1px solid #ccc',
    background: '#fff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    //boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.20)',
    borderRadius: '2px',
    WebkitOverflowScrolling: 'touch',
    outline: 'none'
  }
};

/**
 * -webkit-border-radius: 2px;
 -moz-border-radius: 2px;
 border-radius: 2px;
 -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
 box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
 */

module.exports = Modal;