import { walk } from "https://deno.land/std@0.184.0/fs/walk.ts"
// import { transformPlainText } from "./transform-plain-text.js"
import { parseSentence } from "./parse-kinande-tiddly.js"

const directoryPath = "corpus"

let output = []

for await (const { name } of walk(directoryPath, { exts: ["tid"] })) {
  const fileContent = Deno.readTextFileSync(`${directoryPath}/${name}`)

  output.push(parseSentence(fileContent))
}

Deno.writeTextFileSync("corpus/big.json", JSON.stringify(output, null, 2))
