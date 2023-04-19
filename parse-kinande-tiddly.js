let parseIntoChunks = plaintext => plaintext
  .trim()
  .split(/\n\n+/g)
  .map(x => x.trim())

let toMetadataObject = metadataChunk => {
  let lines = metadataChunk.split("\n")
  let entries = lines
    .map(line => line.split(':'))
    .map(([name,value]) => [name.trim(), value.trim()])
  
  return Object.fromEntries(entries)
}

let parsePrompt = prompt => prompt
  .replace(`''Sentence: ''`, "")

/*

sample interlinear:

Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.<br>
Si-u-a-bi-a mundu wa e-ri-mi-a enzira eyo. Hane akathirisa ako mundu a-ki-ma-y-a e-ri-gend-a-yo<br>
NEG-SM.2sg-TM-be-FV c1.person c1.ASSOC c5-c5-take-FV c9.road that. There.is shortcut c12-REL? c1.person SM.c1-TM-TM-go-FV c5-c5-go-FV-c9.PRN<br>
"You shouldn't have taken that road. There is a shortcut that you could have taken."

*/

let toSentence = interlinearStanza => {
  let lines = interlinearStanza
    .replaceAll('<br>', '')
    .split('\n')
  let transcription = lines.shift()
  let translation = lines.pop()
  
  let tokenize = s => s
    .split(/\p{White_Space}+/gu)
    .filter(Boolean)

  let forms = tokenize(lines.shift())
  let glosses = tokenize(lines.pop())

  let words = forms.map((form,i) => ({form, gloss: glosses[i]}))
  
  return {transcription, translation, words}
} 


let nameSentenceChunks = tiddlyText => {
  let chunks = parseIntoChunks(tiddlyText)

  let metadata = chunks[0]
  let context = chunks[1]
  let prompt = chunks[2]
  //
  let interlinear = chunks[4]

  let comments = []
  if(chunks.length > 4){
		comments.push(...chunks.slice(5))
  }

  return {
    metadata,
    comments, 
    context,
    prompt,
    interlinear,
    comments
  }
}  

let parseTags = tagString => {
  return tagString
    .trim()
    .replaceAll('[[', '\n[[')
    .replaceAll(']]', ']]\n')
    .split('\n')
    .map(token => {
      if(!token.includes('[[')){
        token = token.split(' ')
        return token
      } else {
        return token
          .replaceAll('[[','')
          .replaceAll(']]','')  
      }
    })
    .flat()
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(1)
}

let parseSentence = tiddlyText => {
  let sentenceChunks = nameSentenceChunks(tiddlyText)
  let sentence = {}
  
  sentence.metadata = toMetadataObject(sentenceChunks.metadata)
  sentence.prompt = parsePrompt(sentenceChunks.prompt)
  let {transcription, translation, words} = toSentence(sentenceChunks.interlinear)

  Object.assign(sentence, {transcription, translation, words})
  return {sentence}
}


export {parseSentence, parseTags, toSentence, nameSentenceChunks}
