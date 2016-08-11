
const { join, dirname, parse, extname } = require('path')
const { app } = require('electron').remote
const elapsed = require('@f/elapsed-time')
const execa = require('execa')

const bin = join(
  process.env.NODE_ENV == 'development' ? process.cwd() : app.getAppPath(),
  'bin/gpcl6win64-9.19.exe'
)

const pclExtensions = ['.prn', '.pcl', '.px3']

function isPclCompatible (name) {
  return pclExtensions.find((ext) => ext == extname(name))
}

function convertToPngs (input, outputPath) {
  const time = elapsed()
  return convert(
    'pnggray',
    input.path,
    join(outputPath, `%d-${parse(input.name).name}.png`)
  ).then(() => ({
    elapsed: time(),
    outputPath
  }))
}

function convertToPdf (input) {
  const time = elapsed()
  const dir = dirname(input.path)
  return convert(
    'pdfwrite',
    input.path,
    join(dir, `${parse(input.name).name}.pdf`)
  ).then((outputPath) => ({
    elapsed: time(),
    outputPath
  }))
}

function convert (device, input, output) {
  return execa.stdout(bin, [
    '-dNOPAUSE',
    '-dBATCH',
    '-dNumRenderingThreads=4',
    '-dBandBufferSpace=500000000',
    '-sBandListStorage=memory',
    '-dBufferSpace=1000000000',
    '-dMaxPatternBitmap=1000000',
    '-dCompressFonts=true',
    '-dMaxInlineImageSize=0',
    '-dNOGC',
    `-sDEVICE=${device}`,
    `-sOutputFile=${output}`,
    input
  ]).then(() => output)
}

exports.isPclCompatible = isPclCompatible
exports.pclExtensions = pclExtensions
exports.convertToPngs = convertToPngs
exports.convertToPdf = convertToPdf
exports.convert = convert