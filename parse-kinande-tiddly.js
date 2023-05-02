let ngrams = (sequence, n) => sequence
  .slice(0, sequence.length - n + 1)
  .map((x,i) => sequence.slice(i, i+n))

let bigrams = sequence => ngrams(sequence, 2)

let tidyKey = token => {
  token = token.replaceAll('.', '_')

  if(!token.includes('[[')){
    token = token.split(' ')
    return token
  } else {
    return token
      .replaceAll('[[','')
      .replaceAll(']]','')  
  }
}

let parseTags = tagString => {
  return tagString
    .trim()
    .replaceAll('[[', '\n[[')
    .replaceAll(']]', ']]\n')
    .split('\n')
    .map(token => tidyKey(token))
    .flat()
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(1)
}


let parseMetadata = s => s.split('\n')
  .reduce((metadata, line) => {
    let [key,value] = line.trim().split(':')
    if(typeof value == 'string'){
      value = value.trim()
    }
    key = tidyKey(key)
    switch(key){
      case "tags":
        value = parseTags(value)
        break
      default:
        break
    }
    metadata[key] = value
    return metadata
  },{})

let parseValues = sentence => {
  let pairs = Object.entries(sentence)
    .map(([key,value]) => {
      switch(key){
        case 'metadata': 
          return ["metadata", parseMetadata(value)]
          break
        case 'sentence': 
          return ["stanza", value]
          break
        default:
          return [key,value]
          break
      }
    })

  return Object.fromEntries(pairs)
}

let parseSentence = plainText => {
  plainText = plainText
    .replaceAll(`<br />`, '')
    .replaceAll(`<br>`, '')
    .replaceAll(`<nowiki>`,``)
    .replaceAll(`</nowiki>`,``)
  plainText = `''metadata: ''` + plainText
  let fieldRE = /(''[^']+: *'')/g

  let lines = plainText.split(fieldRE)
  let sentence = bigrams(lines)
    .filter(([a,b]) => a.startsWith(`''`))
    .map(([a,b]) => [
      a.replaceAll(`''`, '').replaceAll(':','').trim().toLowerCase().replaceAll(" ", "_"),
      b.trim()
    ])
    .reduce((entry, [key,value]) => {
      entry[key] = value
      return entry
    }, {})

  sentence = parseValues(sentence)
  return sentence
}


export {
  parseSentence
}
