import jMoment from './jmoment'

export function jWeekOfYear (mom, firstDayOfWeek, firstDayOfWeekOfYear) {
  let end = firstDayOfWeekOfYear - firstDayOfWeek
  let daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
  let adjustedMoment

  if (daysToDayOfWeek > end) {
    daysToDayOfWeek -= 7
  }

  if (daysToDayOfWeek < end - 7) {
    daysToDayOfWeek += 7
  }

  adjustedMoment = jMoment(mom).add(daysToDayOfWeek, 'd')

  return {
    week: Math.ceil(adjustedMoment.jDayOfYear() / 7),
    year: adjustedMoment.jYear()
  }
}
