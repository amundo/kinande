

let isIdentifier = line => (/(''[^']+: *'')/g).test(line)


let ngrams = (sequence, n) => sequence
  .slice(0, sequence.length - n + 1)
  .map((x,i) => sequence.slice(i, i+n))

let bigrams = sequence => ngrams(sequence, 2)



export function transformPlainText(plainText) {
  plainText = plainText
    .replaceAll(`<br />`, '')
    .replaceAll(`<br>`, '')
    .replaceAll(`<nowiki>`,``)
    .replaceAll(`</nowiki>`,``)
  plainText = `''metadata: ''` + plainText
  let fieldRE = /(''[^']+: *'')/g

  let lines = plainText.split(fieldRE)
  let pairs = bigrams(lines)
    .filter(([a,b]) => a.startsWith(`''`))
    .map(([a,b]) => [
      a.replaceAll(`''`, '').replaceAll(':','').trim().toLowerCase().replaceAll(" ", "_"),
      b.trim()
    ])
    .reduce((entry, [key,value]) => {
      entry[key] = value
      return entry
    }, {})

  return pairs
}

