import jalaali from 'jalaali-js'

export function toJalaali (gy, gm, gd) {
  let j = jalaali.toJalaali(gy, gm + 1, gd)
  j.jm -= 1
  return j
}

export function toGregorian (jy, jm, jd) {
  let g = jalaali.toGregorian(jy, jm + 1, jd)
  g.gm -= 1
  return g
}

export {
  jalaali
}
