
import is from 'is_js'
import slugify from 'slugify'
import {local} from 'brownies'

export const trimCharacter = (string, character) => {
  let trimmie = string
  
  // Trim beginning
  while (trimmie.charAt(0) === character) {
   trimmie = trimmie.substr(1)
  }
  
  // Trim end
  while (trimmie.charAt(trimmie.length - 1) === character) {
   trimmie = trimmie.slice(0, -1)
  }
  
  return trimmie
}

// https://www.npmjs.com/package/slugify
export const makeSlug = (string) => slugify(string, {
  // replace spaces with replacement
  replacement: '-',
  // regex to remove characters
  remove: null,
  // result in lower case
  lower: true
})

const escape = document.createElement('textarea')
export const escapeHTML = (html) => {
    escape.textContent = html
    return escape.innerHTML
}

// https://stackoverflow.com/a/21895354/1397641
export const splitByLineBreaks = (string) => string.split(/[\r\n]+/)


export const saveCopy = (copy) => {
  console.log('Saving Copy', copy)
  local.copy = copy
}

export const loadCopy = (initialValue = '') => {
  // console.log('is.not.array(local.copy)', is.not.array(local.copy))
  // console.log('local.copy', local.copy)
  // If it's not give it the initial value
  if (is.not.string(local.copy)) local.copy = initialValue

  console.log('Loading Copy', local.copy)

  return local.copy
}