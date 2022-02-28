function formatMinute (minute) {
  const m = `0${minute}`
  return m.slice(-2)
}

export function toYearString (time) {
  const date = new Date(time)
  return date.getFullYear()
}

export function toDateString (time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function toTimeString (time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${formatMinute(date.getMinutes())}`
}

export function toTimestamp (time) {
  if (time instanceof Date) {
    return time.getTime()
  }
  const date = new Date(time)
  return date.getTime()
}

// 转化为一个小时单位
export function toTimeHour (time) {
  const date = new Date(time)
  return date.getHours()
}
