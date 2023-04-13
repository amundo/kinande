

let parseSentenceChunks = tiddlyText => {
  let chunks = tiddlyText
    .trim()
    .split(/\n\n+/g)
    .map(x => x.trim())
  let metadata = chunks[0]
  let context = chunks[1]
  let prompt = chunks[2]

  // ignore chunks[3]

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

let parsePrompt = prompt => prompt
  .replace(`''Sentence: ''`, "")


let parseSentence = tiddlyText => {
  let sentenceChunks = parseSentenceChunks(tiddlyText)
  let sentence = {}
  
  sentenceChunks.prompt = parsePrompt(sentenceChunks.prompt)
  return {sentenceChunks}
}


export {parseSentence}
