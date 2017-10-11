import moment from 'moment'
import { extend, fixFormat, objectCreate, normalizeUnits, div, mod, setDate } from './utils'
import makeMoment from './make-moment'
import { toJalaali, toGregorian, jalaali } from './jalaali'
import { makeFormatFunction } from './format'
import { formatFunctions, numberMap, symbolMap } from './constants'
import { jWeekOfYear } from './week'

export default function jMoment (input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, false)
}

extend(jMoment, moment)
jMoment.fn = objectCreate(moment.fn)

jMoment.utc = function (input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, true)
}

jMoment.unix = function (input) {
  return makeMoment(input * 1000)
}

/************************************
     Prototype
************************************/

jMoment.fn.format = function (format) {
  if (format) {
    format = fixFormat(format, this)

    if (!formatFunctions[format]) {
      formatFunctions[format] = makeFormatFunction(format)
    }
    format = formatFunctions[format](this)
  }
  return moment.fn.format.call(this, format)
}

jMoment.fn.jYear = function (input) {
  let lastDay, j, g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm))
    g = toGregorian(input, j.jm, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jy
  }
}

jMoment.fn.jMonth = function (input) {
  let lastDay, j, g
  if (input != null) {
    if (typeof input === 'string') {
      input = this.lang().jMonthsParse(input)
      if (typeof input !== 'number') {
        return this
      }
    }
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input))
    this.jYear(j.jy + div(input, 12))
    input = mod(input, 12)
    if (input < 0) {
      input += 12
      this.jYear(this.jYear() - 1)
    }
    g = toGregorian(this.jYear(), input, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jm
  }
}

jMoment.fn.jDate = function (input) {
  let j, g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    g = toGregorian(j.jy, j.jm, input)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jd
  }
}

jMoment.fn.jDayOfYear = function (input) {
  let dayOfYear = Math.round((jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5) + 1
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd')
}

jMoment.fn.jWeek = function (input) {
  let week = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).week
  return input == null ? week : this.add((input - week) * 7, 'd')
}

jMoment.fn.jWeekYear = function (input) {
  let year = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year
  return input == null ? year : this.add(input - year, 'y')
}

jMoment.fn.add = function (val, units) {
  let temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() + val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() + val)
  } else {
    moment.fn.add.call(this, val, units)
  }
  return this
}

jMoment.fn.subtract = function (val, units) {
  let temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() - val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() - val)
  } else {
    moment.fn.subtract.call(this, val, units)
  }
  return this
}

jMoment.fn.startOf = function (units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    if (units === 'jyear') {
      this.jMonth(0)
    }
    this.jDate(1)
    this.hours(0)
    this.minutes(0)
    this.seconds(0)
    this.milliseconds(0)
    return this
  } else {
    return moment.fn.startOf.call(this, units)
  }
}

jMoment.fn.endOf = function (units) {
  units = normalizeUnits(units)
  if (units === undefined || units === 'milisecond') {
    return this
  }
  return this.startOf(units).add(1, (units === 'isoweek' ? 'week' : units)).subtract(1, 'ms')
}

jMoment.fn.isSame = function (other, units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    return moment.fn.isSame.call(this.startOf(units), other.startOf(units))
  }
  return moment.fn.isSame.call(this, other, units)
}

jMoment.fn.clone = function () {
  return jMoment(this)
}

jMoment.fn.jYears = jMoment.fn.jYear
jMoment.fn.jMonths = jMoment.fn.jMonth
jMoment.fn.jDates = jMoment.fn.jDate
jMoment.fn.jWeeks = jMoment.fn.jWeek

/************************************
 Statics
************************************/

jMoment.jDaysInMonth = function (year, month) {
  year += div(month, 12)
  month = mod(month, 12)
  if (month < 0) {
    month += 12
    year -= 1
  }
  if (month < 6) {
    return 31
  } else if (month < 11) {
    return 30
  } else if (jMoment.jIsLeapYear(year)) {
    return 30
  } else {
    return 29
  }
}

jMoment.jIsLeapYear = jalaali.isLeapJalaaliYear

jMoment.loadPersian = function (args) {
  let usePersianDigits = args !== undefined && args.hasOwnProperty('usePersianDigits') ? args.usePersianDigits : false
  let dialect = args !== undefined && args.hasOwnProperty('dialect') ? args.dialect : 'persian'
  moment.locale('fa', null)
  moment.defineLocale('fa'
    , {
      months: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_'),
      monthsShort: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_'),
      weekdays:
            {
              'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
              'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
            }[dialect],
      weekdaysShort:
            {
              'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
              'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
            }[dialect],
      weekdaysMin:
            {
              'persian': 'ی_د_س_چ_پ_آ_ش'.split('_'),
              'persian-modern': 'ی_د_س_چ_پ_ج_ش'.split('_')
            }[dialect],
      longDateFormat:
            {
              LT: 'HH:mm',
              L: 'jYYYY/jMM/jDD',
              LL: 'jD jMMMM jYYYY',
              LLL: 'jD jMMMM jYYYY LT',
              LLLL: 'dddd، jD jMMMM jYYYY LT'
            },
      calendar:
            {
              sameDay: '[امروز ساعت] LT',
              nextDay: '[فردا ساعت] LT',
              nextWeek: 'dddd [ساعت] LT',
              lastDay: '[دیروز ساعت] LT',
              lastWeek: 'dddd [ی پیش ساعت] LT',
              sameElse: 'L'
            },
      relativeTime:
            {
              future: 'در %s',
              past: '%s پیش',
              s: 'چند ثانیه',
              m: '1 دقیقه',
              mm: '%d دقیقه',
              h: '1 ساعت',
              hh: '%d ساعت',
              d: '1 روز',
              dd: '%d روز',
              M: '1 ماه',
              MM: '%d ماه',
              y: '1 سال',
              yy: '%d سال'
            },
      preparse (string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function (match) {
            return numberMap[match]
          }).replace(/،/g, ',')
        }
        return string
      },
      postformat (string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function (match) {
            return symbolMap[match]
          }).replace(/,/g, '،')
        }
        return string
      },
      ordinal: '%dم',
      week:
            {
              dow: 6, // Saturday is the first day of the week.
              doy: 12 // The week that contains Jan 1st is the first week of the year.
            },
      meridiem (hour) {
        return hour < 12 ? 'ق.ظ' : 'ب.ظ'
      },
      jMonths:
            {
              'persian': ('فروردین_اردیبهشت_خرداد_تیر_امرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_'),
              'persian-modern': ('فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')
            }[dialect],
      jMonthsShort:
            {
              'persian': 'فرو_ارد_خرد_تیر_امر_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_'),
              'persian-modern': 'فرو_ارد_خرد_تیر_مرد_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_')
            }[dialect]
    }
  )
}

jMoment.jConvert = {
  toJalaali: toJalaali,
  toGregorian: toGregorian
}
