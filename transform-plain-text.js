export function transformPlainText(plainText) {
  const entry = {}

  // split the plain text string into an array of lines
  const lines = plainText.trim().split("\n")

  // extract the metadata and add it to the object
  const metadata = lines.slice(0, lines.indexOf("")).join("\n")
  entry.metadata = metadata

  // loop through the remaining lines and extract the fields
  let currentField = ""
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    // check if the line is a field label
    if (line.trim().match(/^''/)) {
      currentField = line.split(`''`)[1].trim().slice(0, -1)
    } else {
      // append the line to the current field value
      if (!entry[currentField]) {
        entry[currentField] = line
      } else {
        entry[currentField] += "\n" + line
      }
    }
  }

  return entry
}
