import { leftZeroFill } from './utils'

export const formattingTokens = /(\[[^[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
export const parseTokenOneOrTwoDigits = /\d\d?/
export const parseTokenOneToThreeDigits = /\d{1,3}/
export const parseTokenThreeDigits = /\d{3}/
export const parseTokenFourDigits = /\d{1,4}/
export const parseTokenSixDigits = /[+-]?\d{1,6}/
export const parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i
export const parseTokenTimezone = /Z|[+-]\d\d:?\d\d/i
export const parseTokenT = /T/i
export const parseTokenTimestampMs = /[+-]?\d+(\.\d{1,3})?/

export const symbolMap = {
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
  '0': '۰'
}

export const numberMap = {
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '۰': '0'
}

export const formatFunctions = {}

export const ordinalizeTokens = 'DDD w M D'.split(' ')
export const paddedTokens = 'M D w'.split(' ')

export const formatTokenFunctions =
  {
    jM () {
      return this.jMonth() + 1
    },
    jMMM (format) {
      return this.localeData().jMonthsShort(this, format)
    },
    jMMMM (format) {
      return this.localeData().jMonths(this, format)
    },
    jD () {
      return this.jDate()
    },
    jDDD () {
      return this.jDayOfYear()
    },
    jw () {
      return this.jWeek()
    },
    jYY () {
      return leftZeroFill(this.jYear() % 100, 2)
    },
    jYYYY () {
      return leftZeroFill(this.jYear(), 4)
    },
    jYYYYY () {
      return leftZeroFill(this.jYear(), 5)
    },
    jgg () {
      return leftZeroFill(this.jWeekYear() % 100, 2)
    },
    jgggg () {
      return this.jWeekYear()
    },
    jggggg () {
      return leftZeroFill(this.jWeekYear(), 5)
    }
  }

function padToken (func, count) {
  return function (a) {
    return leftZeroFill(func.call(this, a), count)
  }
}

function ordinalizeToken (func, period) {
  return function (a) {
    return this.localeData().ordinal(func.call(this, a), period)
  }
}

while (ordinalizeTokens.length) {
  let i = ordinalizeTokens.pop()
  formatTokenFunctions['j' + i + 'o'] = ordinalizeToken(formatTokenFunctions['j' + i], i)
}

while (paddedTokens.length) {
  let i = paddedTokens.pop()
  formatTokenFunctions['j' + i + i] = padToken(formatTokenFunctions['j' + i], 2)
}

formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3)
