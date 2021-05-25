// helpers/utilities.js is a list of helper functions to validate data 

module.exports = {
  isEmail: function (email) {
    const testEmail = email.toLowerCase()
    const emailFormat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (emailFormat.test(testEmail)) {
      return true
    }
    return false
  },
  isNumber: function (number) {
    const phoneNumber = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([0-9]1[0-9]|[0-9][0-9]1|[0-9][0-9][0-9])\s*\)|([0-9]1[0-9]|[0-9][0-9]1|[0-9][0-9][0-9]))\s*(?:[.-]\s*)?)?([0-9]1[0-9]|[0-9][0-9]1|[0-9][0-9]{2})\s*(?:[.-]\s*)?([0-9]{4})?$/
    if (number.match(phoneNumber)) {
      return true
    } else {
      return false
    }
  },
  isAlphaNumeric: function (str) {
    let code, i, len

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i)
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false
      }
    }
    return true
  },
  // just check through possible mistakes to clean up a phone number
  cleanNumber: function (number) {
    let cleanNumber = number.replace(/-/g, '')
    cleanNumber = cleanNumber.replace(/\./g, '')
    cleanNumber = cleanNumber.replace(/ /g, '')
    cleanNumber = cleanNumber.replace(/\(/g, '')
    cleanNumber = cleanNumber.replace(/\)/g, '')
    // cleanNumber = number.replace(/(?<!^)\+|[^\d+]+/g, '')
    if (cleanNumber.charAt(0) == '+') {
      if (cleanNumber.length == 11) {
        cleanNumber = '+1' + cleanNumber.replace('+', '')
      }
    } else {
      if (cleanNumber.length == 10) {
        cleanNumber = '+1' + cleanNumber
      } else if (cleanNumber.length == 11) {
        cleanNumber = '+' + cleanNumber
      }
    }
    return cleanNumber
  },
  titleCase: function (string) {
    if (string.length == 0) {
      return string
    }
    const sentence = string.toLowerCase().split(' ')
    let result = ''
    for (let i = 0; i < sentence.length; i++) {
      result += sentence[i][0].toUpperCase() + sentence[i].slice(1) + ' '
    }
    return result.trim()
  },
  isIn: function (item, list) {
    for (let c = 0; c < list.length; c++) {
      if (list[c] == item) {
        return true
      }
    }
    return false
  },
  filterAddressesByLocality: function (locality, addresses) {
    const filtered = []
    for (let a = 0; a < addresses.length; a++) {
      const address = addresses[a]
      // remove addresses that are not in the given locality
      if (address.locality == locality) {
        filtered.push(address)
      }
    }
    return filtered
  },
  getBaseUrl: function () {
    let url = process.env.ROOT_URL
    if (url == 'http://localhost:8080/') {
      url = 'http://localhost:8080'
    }
    return url
  },
  dateString: function (date) {
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }
    var hours = date.getHours() % 12
    if(hours == 0){
      hours = 12
    }
    const dateString = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ', ' + hours + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM')
    return dateString
  }

}
