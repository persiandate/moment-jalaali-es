export const localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS?|LL?L?L?|l{1,4})/g

export const unitAliases = {
  jm: 'jmonth',
  jmonths: 'jmonth',
  jy: 'jyear',
  jyears: 'jyear'
}

export function extend (a, b) {
  let key
  for (key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key]
    }
  }
  return a
}

export function leftZeroFill (number, targetLength) {
  let output = number + ''
  while (output.length < targetLength) {
    output = '0' + output
  }
  return output
}

export function isArray (input) {
  return Object.prototype.toString.call(input) === '[object Array]'
}

// function compareArrays(array1, array2) {
//   let len = Math.min(array1.length, array2.length)
//     , lengthDiff = Math.abs(array1.length - array2.length)
//     , diffs = 0
//     , i
//   for (i = 0; i < len; i += 1)
//     if (~~array1[i] !== ~~array2[i])
//       diffs += 1
//   return diffs + lengthDiff
// }

export function normalizeUnits (units) {
  if (units) {
    let lowered = units.toLowerCase()
    units = unitAliases[lowered] || lowered
  }
  return units
}

export function setDate (m, year, month, date) {
  let d = m._d
  if (m._isUTC) {
    /* eslint-disable new-cap */
    m._d = new Date(Date.UTC(year, month, date,
      d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
    /* eslint-enable new-cap */
  } else {
    m._d = new Date(year, month, date,
      d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())
  }
}

export function objectCreate (parent) {
  function F () { }
  F.prototype = parent
  return new F()
}

export function getPrototypeOf (object) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(object)
  }
  return object.constructor.prototype
}

export function div (a, b) {
  return ~~(a / b)
}

export function mod (a, b) {
  return a - ~~(a / b) * b
}

export function fixFormat (format, _moment) {
  let i = 5
  let replace = input => _moment.localeData().longDateFormat(input) || input
  while (i > 0 && localFormattingTokens.test(format)) {
    i -= 1
    format = format.replace(localFormattingTokens, replace)
  }
  return format
}
