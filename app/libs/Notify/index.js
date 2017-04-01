import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

let notificationWrapperId = 'notification-wrapper';
let defaultTimeout = 2000; // ms
let animationDuration = 300; // ms

/* Colors */
const colorWhite = 'white';
const colorError = 'rgba(65,71,77,0.90)';
const colorSuccess = '#55CA92';
const colorWarning = '#F5E273';
const textColorWarning = '#333333';

/* React Notification Component */
class Toast extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    timeout: PropTypes.number,
    type: PropTypes.string,
    color: PropTypes.object,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ])
  };

  state = {
    styleParent: null
  };

  getStyles() {
    let styles = {};

    const containerStyle = {
      position: 'fixed',
      width: '50%',
      margin: '0 auto',
      right: '0px',
      top: '60px',
      left: '240px',
      textAlign: 'center',
      zIndex: '999999',
      pointerEvents: 'none',
      transition: 'all ' + animationDuration + 'ms ease',
      transform: 'translateY(0px)',
      // Vendor Prefixes
      msTransition: 'all ' + animationDuration + 'ms ease',
      msTransform: 'translateY(0px)',
      WebkitTransition: 'all ' + animationDuration + 'ms ease',
      WebkitTransform: 'translateY(0px)',
      OTransition: 'all ' + animationDuration + 'ms ease',
      OTransform: 'translateY(0px)',
      MozTransition: 'all ' + animationDuration + 'ms ease',
      MozTransform: 'translateY(0px)'
    };

    const contentStyle = {
      cursor: 'pointer',
      display: 'inline-block',
      minWidth: '406px',
      borderRadius: '2px',
      backgroundColor: 'white',
      padding: '19px',
      pointerEvents: 'all'
    };

    /* If type is set, merge toast action styles with base */
    switch (this.props.type) {
      case 'success':
        const successStyle = {
          backgroundColor: colorSuccess,
          color: colorWhite
        };
        styles.content = assign({}, contentStyle, successStyle);
        break;

      case 'error':
        const errorStyle = {
          backgroundColor: colorError,
          color: colorWhite
        };
        styles.content = assign({}, contentStyle, errorStyle);
        break;

      case 'warning':
        const warningStyle = {
          backgroundColor: colorWarning,
          color: textColorWarning
        };
        styles.content = assign({}, contentStyle, warningStyle);
        break;

      case 'custom':
        const customStyle = {
          backgroundColor: this.props.color.background,
          color: this.props.color.text
        };
        styles.content = assign({}, contentStyle, customStyle);
        break;

      default:
        styles.content = assign({}, contentStyle);
        break;
    }

    styles.container = containerStyle;

    return styles;
  }

  getVisibleState(context) {
    let base = this.getStyles().container;

    // Show
    const stylesShow = {
      opacity: 1
    };

    setTimeout(function() {
      context.updateStyle(base, stylesShow);
    }, 100); // wait 100ms after the component is called to animate toast.

    if (this.props.timeout === -1) {
      return;
    }

    // Hide after timeout
    const stylesHide = {
      opacity: 0
    };

    setTimeout(function() {
      context.updateStyle(base, stylesHide);
    }, this.props.timeout);
  }

  updateStyle(base, update) {
    this.setState({styleParent: assign({}, base, update)});
  }

  getBaseStyle() {
    this.setState({styleParent: this.getStyles().container});
  }

  componentDidMount() {
    this.getBaseStyle();
    this.getVisibleState(this);
  }

  handleClick(){
    hideToast();
  }

  render() {
    let {text, type} = this.props;
    let styles = this.getStyles();
    let {styleParent} = this.state;
    return (
      <div className="toast-notification" style={styleParent} onClick={this.handleClick.bind(this)}>
        <span className={type} style={styles.content}>{text}</span>
      </div>
    );
  }
}

/* Private Functions */

/* Render React component */
function renderToast(text, type, timeout, color) {
  ReactDOM.render(
    <Toast text={text} timeout={timeout} type={type} color={color}/>,
    document.getElementById(notificationWrapperId)
  );
}

/* Unmount React component */
function hideToast() {
  ReactDOM.unmountComponentAtNode(document.getElementById(notificationWrapperId));
}

/* Public functions */

/* Show Animated Toast Message */
function show(text, type, timeout, color) {
  if (!document.getElementById(notificationWrapperId).hasChildNodes()) {
    let renderTimeout = timeout;

    // Use default timeout if not set.
    if (!renderTimeout) {
      renderTimeout = defaultTimeout;
    }

    // Render Component with Props.
    renderToast(text, type, renderTimeout, color);

    if (timeout === -1) {
      return;
    }

    // Unmount react component after the animation finished.
    setTimeout(function() {
      hideToast();
    }, renderTimeout + animationDuration);
  }
}


/* Export notification container */
export default class extends React.Component {
  render() {
    return (
      <div id={notificationWrapperId}></div>
    );
  }
}

/* Export notification functions */
export let notify = {
  show,
  hide: hideToast
};