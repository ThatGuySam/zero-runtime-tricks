import slugify from 'slugify'

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