
const { div, h } = require('react-hyperscript-helpers')
const { NotificationStack } = require('react-notification')
const { openExternal } = require('shell')
const { render } = require('react-dom')
const prettyMs = require('pretty-ms')
const tmpPath = require('temp-path')
const mkdirp = require('mkdirp')
const execa = require('execa')
const React = require('react')

const {
  isPclCompatible,
  convertToPngs,
  convertToPdf
} = require('@core/convert')
const FileDropper = require('@core/file-dropper')

const App = React.createClass({
  getInitialState () {
    return {
      isDropped: false,
      isConverting: false,
      extensionError: false,
      file: null,
      outputPath: null,
      notifications: [],
      notificationCount: 0
    }
  },

  addNotification (notification) {
    const { notifications, notificationCount } = this.state
    const newCount = notificationCount + 1
    return this.setState({
      notificationCount: newCount,
      notifications: notifications.concat([Object.assign({
        key: newCount,
        dismissAfter: 4000
      }, notification)])
    })
  },

  removeNotification (count) {
    const { notifications } = this.state
    this.setState({
      notifications: notifications.filter(({ key }) => key !== count)
    })
  },

  pdfNotify (name, time) {
    return this.addNotification({
      title: 'Success!',
      message: `generated in ${prettyMs(time)}`
    })
  },

  pngNotify (name, time) {
    return this.addNotification({
      title: name,
      message: `generated in ${prettyMs(time)}`
    })
  },

  savePdf () {
    const { file } = this.state
    this.setState({ isConverting: true })

    convertToPdf(file)
      .then(({ outputPath, elapsed }) => {
        this.setState({ isDropped: false, isConverting: false, outputPath })
        this.pdfNotify(file.name, elapsed)
        openExternal(outputPath)
      }).catch((err) => {
        console.error(err.stack)
      })
  },

  savePng () {
    const { file } = this.state
    const outputPath = tmpPath()

    this.setState({ isConverting: true })
    mkdirp.sync(outputPath)
    openExternal(outputPath)

    convertToPngs(file, outputPath)
      .then(({ outputPath, elapsed }) => {
        this.setState({ isDropped: false, isConverting: false, outputPath })
        this.pdfNotify(file.name, elapsed)
      }).catch((err) => {
        console.error(err.stack)
      })
  },

  onDrop (files) {
    const file = files[0]

    if (!isPclCompatible(file.name)) {
      // TODO: remove animation hack with fixed timeout
      this.setState({ extensionError: true })
      setTimeout(() => this.setState({ extensionError: false }), 1000)
    } else {
      this.setState({ isDropped: true, file })
    }
  },

  render () {
    const {
      extensionError,
      notifications,
      isConverting,
      isDropped,
      file
    } = this.state

    return div([
      h(NotificationStack, {
        notifications,
        onDismiss: ({ key }) => this.removeNotification(key)
      }),
      h(FileDropper, {
        onDrop: this.onDrop,
        onSavePng: this.savePng,
        onSavePdf: this.savePdf,
        extensionError,
        isConverting,
        isDropped,
        file
      })
    ])
  }
})

render(
  h(App),
  document.getElementById('js-app')
)