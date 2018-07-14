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