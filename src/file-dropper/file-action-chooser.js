
const { div, h2, h, button } = require('react-hyperscript-helpers')

const { ButtonRow } = require('@core/button')

function render ({
  onSavePdf,
  onSavePng,
  file
}) {
  return div({ className: 'bg-light-gray p3 rounded' }, [
    h2({ className: 'h2 roboto thin center' }, file.name),
    h(ButtonRow, [
      button({ className: 'btn', onClick: onSavePdf }, 'View as PDF'),
      button({ className: 'btn', onClick: onSavePng }, 'Convert to PNGs')
    ])
  ])
}

module.exports = render