
const { div, h2, p, h } = require('react-hyperscript-helpers')
const Dropzone = require('react-dropzone')
const cn = require('classnames')
const React = require('react')

const FileActionChooser = require('./file-action-chooser')
const { pclExtensions } = require('@core/convert')
const Loader = require('@core/loader')

function Container ({ children }) {
  return div({ className: 'p2 fill-vh' }, [
    div({ className: 'roboto relative fill-width fill-height' }, [children])
  ])
}

const FileDropper = React.createClass({
  getInitialState () {
    return {
      isDragging: false
    }
  },

  onDrop (files) {
    const { onDrop } = this.props
    this.setState({ isDragging: false })
    onDrop(files)
  },

  render () {
    const {
      extensionError,
      isConverting,
      isDropped,
      onSavePng,
      onSavePdf,
      file
    } = this.props

    const { isDragging } = this.state

    let contents = h(DropText, { extensionError })

    if (isConverting) {
      contents = h(Loader, { fileName: file.name })
    } else if (isDropped) {
      contents = h(FileActionChooser, { file, onSavePdf, onSavePng })
    }

    return h(Container, [
      h(Dropzone, {
        onDragEnter: () => this.setState({ isDragging: true }),
        onDragLeave: () => this.setState({ isDragging: false }),
        onDrop: this.onDrop,
        className: cn(
          'absolute fill-width fill-height border border-dashed',
          { 'bg-light-gray': isDragging }
        ),
        multiple: false
      }),

      div({ className: 'absolute absolute-center' }, [contents])
    ])
  }
})

function DropText ({ extensionError }) {
  return div([
    h2({ className: 'h2 roboto thin' }, 'Drop your file here'),
    p({
      className: cn(
        'center bold',
        { 'shake': extensionError }
      )
    }, [pclExtensions.join(', ')])
  ])
}

module.exports = FileDropper