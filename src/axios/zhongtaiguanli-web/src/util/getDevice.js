export function getOrientation () {
  const supportOrientation = (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object')

  const htmlNode = document.body.parentNode

  let orientation

  if (supportOrientation) {
    orientation = window.orientation

    switch (orientation) {
      case 90:
      case -90:
        orientation = 'landscape'
        break
      default:
        orientation = 'portrait'
    }
  } else {
    orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
  }

  return orientation
}

export function getDevice () {
  const ua = window.navigator.userAgent

  const device = {
    mobile: false,
    ios: false,
    android: false,
    androidChrome: false,
    desktop: false,
    windows: false,
    iphone: false,
    iphoneX: false,
    ipod: false,
    ipad: false,
    webView: false,
    pixelRatio: 1,
    orientation: getOrientation()
  }

  /* eslint no-useless-escape: 0 */
  const windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/)
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/)
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/)
  const iphoneX = iphone && window.screen.width === 375 && window.screen.height === 812

  if (windows) {
    device.os = 'windows'
    device.osVersion = windows[2]
    device.windows = true
  }

  if (android && !windows) {
    device.os = 'android'
    device.osVersion = android[2]
    device.android = true
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios'
    device.ios = true
  }

  if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.')
    device.iphone = true
    device.iphoneX = iphoneX
  }

  if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.')
    device.ipad = true
  }

  if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    device.iphone = true
  }

  // iOS 8+ changed UA
  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
      device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0]
    }
  }

  device.webView = (iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || window.navigator.standalone)

  device.desktop = !(device.os || device.android || device.webView)

  device.mobile = !device.desktop

  device.pixelRatio = window.devicePixelRatio || 1

  return device
}

export const device = () => getDevice()