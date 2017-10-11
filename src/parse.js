import moment from 'moment'
import {
  parseTokenThreeDigits,
  parseTokenFourDigits,
  parseTokenSixDigits,
  parseTokenOneToThreeDigits,
  parseTokenWord,
  parseTokenOneOrTwoDigits,
  parseTokenTimestampMs,
  parseTokenTimezone,
  parseTokenT,
  formattingTokens,
  formatTokenFunctions
} from './constants'

import makeMoment from './make-moment'
import jMoment from './jmoment'
import { toGregorian, toJalaali } from './jalaali'

export function getParseRegexForToken (token, config) {
  switch (token) {
    case 'jDDDD':
      return parseTokenThreeDigits
    case 'jYYYY':
      return parseTokenFourDigits
    case 'jYYYYY':
      return parseTokenSixDigits
    case 'jDDD':
      return parseTokenOneToThreeDigits
    case 'jMMM':
    case 'jMMMM':
      return parseTokenWord
    case 'jMM':
    case 'jDD':
    case 'jYY':
    case 'jM':
    case 'jD':
      return parseTokenOneOrTwoDigits
    case 'DDDD':
      return parseTokenThreeDigits
    case 'YYYY':
      return parseTokenFourDigits
    case 'YYYYY':
      return parseTokenSixDigits
    case 'S':
    case 'SS':
    case 'SSS':
    case 'DDD':
      return parseTokenOneToThreeDigits
    case 'MMM':
    case 'MMMM':
    case 'dd':
    case 'ddd':
    case 'dddd':
      return parseTokenWord
    case 'a':
    case 'A':
      return moment.localeData(config._l)._meridiemParse
    case 'X':
      return parseTokenTimestampMs
    case 'Z':
    case 'ZZ':
      return parseTokenTimezone
    case 'T':
      return parseTokenT
    case 'MM':
    case 'DD':
    case 'YY':
    case 'HH':
    case 'hh':
    case 'mm':
    case 'ss':
    case 'M':
    case 'D':
    case 'd':
    case 'H':
    case 'h':
    case 'm':
    case 's':
      return parseTokenOneOrTwoDigits
    default:
      return new RegExp(token.replace('\\', ''))
  }
}

export function addTimeToArrayFromToken (token, input, config) {
  let a
  let datePartArray = config._a

  switch (token) {
    case 'jM':
    case 'jMM':
      datePartArray[1] = input == null ? 0 : ~~input - 1
      break
    case 'jMMM':
    case 'jMMMM':
      a = moment.localeData(config._l).jMonthsParse(input)
      if (a != null) { datePartArray[1] = a } else { config._isValid = false }
      break
    case 'jD':
    case 'jDD':
    case 'jDDD':
    case 'jDDDD':
      if (input != null) { datePartArray[2] = ~~input }
      break
    case 'jYY':
      datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400)
      break
    case 'jYYYY':
    case 'jYYYYY':
      datePartArray[0] = ~~input
  }
  if (input == null) { config._isValid = false }
}

export function dateFromArray (config) {
  let g
  let j
  let jy = config._a[0]
  let jm = config._a[1]
  let jd = config._a[2]

  if ((jy == null) && (jm == null) && (jd == null)) { return [0, 0, 1] }
  jy = jy != null ? jy : 0
  jm = jm != null ? jm : 0
  jd = jd != null ? jd : 1
  if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11) { config._isValid = false }
  g = toGregorian(jy, jm, jd)
  j = toJalaali(g.gy, g.gm, g.gd)
  config._jDiff = 0
  if (~~j.jy !== jy) { config._jDiff += 1 }
  if (~~j.jm !== jm) { config._jDiff += 1 }
  if (~~j.jd !== jd) { config._jDiff += 1 }
  return [g.gy, g.gm, g.gd]
}

export function makeDateFromStringAndFormat (config) {
  let tokens = config._f.match(formattingTokens)
  let string = config._i + ''
  let len = tokens.length
  let i
  let token
  let parsedInput

  config._a = []

  for (i = 0; i < len; i += 1) {
    token = tokens[i]
    parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0]
    if (parsedInput) { string = string.slice(string.indexOf(parsedInput) + parsedInput.length) }
    if (formatTokenFunctions[token]) { addTimeToArrayFromToken(token, parsedInput, config) }
  }
  if (string) { config._il = string }
  return dateFromArray(config)
}

export function makeDateFromStringAndArray (config, utc) {
  let len = config._f.length
  let i
  let format
  let tempMoment
  let bestMoment
  let currentScore
  let scoreToBeat

  if (len === 0) {
    return makeMoment(new Date(NaN))
  }

  for (i = 0; i < len; i += 1) {
    format = config._f[i]
    currentScore = 0
    tempMoment = makeMoment(config._i, format, config._l, config._strict, utc)

    if (!tempMoment.isValid()) continue

    // currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
    currentScore += tempMoment._jDiff
    if (tempMoment._il) { currentScore += tempMoment._il.length }
    if (scoreToBeat == null || currentScore < scoreToBeat) {
      scoreToBeat = currentScore
      bestMoment = tempMoment
    }
  }

  return bestMoment
}

export function removeParsedTokens (config) {
  let string = config._i + ''
  let input = ''
  let format = ''
  let array = config._f.match(formattingTokens)
  let len = array.length
  let i
  let match
  let parsed

  for (i = 0; i < len; i += 1) {
    match = array[i]
    parsed = (getParseRegexForToken(match, config).exec(string) || [])[0]
    if (parsed) { string = string.slice(string.indexOf(parsed) + parsed.length) }
    if (!(formatTokenFunctions[match] instanceof Function)) {
      format += match
      if (parsed) { input += parsed }
    }
  }
  config._i = input
  config._f = format
}
