import moment from 'moment'

import {
  fixFormat,
  objectCreate,
  isArray,
  leftZeroFill,
  extend
} from './utils'

import {
  makeDateFromStringAndFormat,
  makeDateFromStringAndArray,
  removeParsedTokens
} from './parse'

import jMoment from './jmoment'

export default function makeMoment (input, format, lang, strict, utc) {
  if (typeof lang === 'boolean') {
    utc = strict
    strict = lang
    lang = undefined
  }

  if (format && typeof format === 'string') { format = fixFormat(format, moment) }

  let config = {
    _i: input,
    _f: format,
    _l: lang,
    _strict: strict,
    _isUTC: utc
  }

  let date
  let m
  let jm
  let origInput = input
  let origFormat = format

  if (format) {
    if (isArray(format)) {
      return makeDateFromStringAndArray(config, utc)
    } else {
      date = makeDateFromStringAndFormat(config)
      removeParsedTokens(config)
      format = 'YYYY-MM-DD-' + config._f
      input = leftZeroFill(date[0], 4) + '-' +
                leftZeroFill(date[1] + 1, 2) + '-' +
                leftZeroFill(date[2], 2) + '-' +
                config._i
    }
  }
  if (utc) { m = moment.utc(input, format, lang, strict) } else { m = moment(input, format, lang, strict) }
  if (config._isValid === false) { m._isValid = false }
  m._jDiff = config._jDiff || 0
  jm = objectCreate(jMoment.fn)
  extend(jm, m)
  if (strict && jm.isValid()) {
    jm._isValid = jm.format(origFormat) === origInput
  }
  return jm
}
