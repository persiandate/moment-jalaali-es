import moment from 'moment'
import { extend, getPrototypeOf } from './utils'
import jMoment from './jmoment'

extend(getPrototypeOf(moment.localeData()),
  {
    _jMonths: [
      'Farvardin',
      'Ordibehesht',
      'Khordaad',
      'Tir',
      'Amordaad',
      'Shahrivar',
      'Mehr',
      'Aabaan',
      'Aazar',
      'Dey',
      'Bahman',
      'Esfand'
    ],
    jMonths (m) {
      return this._jMonths[m.jMonth()]
    },
    _jMonthsShort: [
      'Far',
      'Ord',
      'Kho',
      'Tir',
      'Amo',
      'Sha',
      'Meh',
      'Aab',
      'Aaz',
      'Dey',
      'Bah',
      'Esf'
    ],
    jMonthsShort (m) {
      return this._jMonthsShort[m.jMonth()]
    },

    jMonthsParse (monthName) {
      let i, mom, regex
      if (!this._jMonthsParse) {
        this._jMonthsParse = []
      }
      for (i = 0; i < 12; i += 1) {
        // Make the regex if we don't have it already.
        if (!this._jMonthsParse[i]) {
          mom = jMoment([2000, (2 + i) % 12, 25])
          regex = '^' + this.jMonths(mom, '') + '|^' + this.jMonthsShort(mom, '')
          this._jMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i')
        }
        // Test the regex.
        if (this._jMonthsParse[i].test(monthName)) { return i }
      }
    }
  }
)
