import { formatTokenFunctions, formattingTokens } from './constants'

export function makeFormatFunction (format) {
  const array = format.match(formattingTokens)
  const length = array.length

  for (let i = 0; i < length; i += 1) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]]
    }
  }

  return mom => {
    let output = ''
    for (let i = 0; i < length; i += 1) {
      output += array[i] instanceof Function ? '[' + array[i].call(mom, format) + ']' : array[i]
    }
    return output
  }
}
