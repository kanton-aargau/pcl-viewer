
const { div } = require('react-hyperscript-helpers')

function render ({ children }) {
  return div({ className: 'flex' }, children.map((btn, i) => {
    if (i == children.length - 1) return btn
    return div({ className: 'mr1' }, [ btn ])
  }))
}

module.exports = render