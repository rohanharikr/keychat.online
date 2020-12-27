export default function () {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // IPad on iOS 13 detection
    navigator.userAgent.includes('Mac')
  )
}
