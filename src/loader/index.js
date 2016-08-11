
const { div, svg, span, h, p } = require('react-hyperscript-helpers')
const ripple = require('./ripple.svg')

module.exports = function Loader ({ fileName }) {
  return div({ 
    className: 'flex flex-column items-center'
  }, [
    svg([
      h('use', { xlinkHref: ripple })
    ]),
    p([
      'Processing ',
      span({ className: 'bold' }, fileName),
      ' ...'
    ])
  ])
}