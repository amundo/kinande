import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { parseSentence, parseTags, toSentence, nameSentenceChunks } from "./parse-kinande-tiddly.js";


Deno.test("parseTags should parse a tags string", () => {
  let input = `tags: [[Kinande Q12: March 15 2021]] unglossed contextData eritolera kumbe [[i- (pfx)]] deontic [[weak necessity]]`
  let expectedOutput = [
    "Kinande Q12: March 15 2021",
    "unglossed", 
    "contextData", 
    "eritolera", 
    "kumbe",
    "i- (pfx)",
    "deontic",
    "weak necessity"
  ]
  const actualOutput = parseTags(input);
  assertEquals(actualOutput, expectedOutput);
})

/*
Deno.test("parseSentence function should parse TiddlyWiki text into a sentence object", () => {
  const tiddlyText =
    "Title: Sample Sentence\n\n\n\n\nSíwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.<br>\nSi-u-a-bi-a mundu wa e-ri-mi-a enzira eyo. Hane akathirisa ako mundu a-ki-ma-y-a e-ri-gend-a-yo<br>\nNEG-SM.2sg-TM-be-FV c1.person c1.ASSOC c5-c5-take-FV c9.road that. There.is shortcut c12-REL? c1.person SM.c1-TM-TM-go-FV c5-c5-go-FV-c9.PRN\n\nThis is a sample sentence for testing purposes.\n\n";
  const expectedOutput = {
    sentence: {
      metadata: {
        Title: "Sample Sentence",
      },
      prompt: "Sentence: ",
      transcription:
        "Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.",
      translation:
        "You shouldn't have taken that road. There is a shortcut that you could have taken.",
      words: [
        { form: "Si-u-a-bi-a", gloss: "NEG-SM.2sg-TM-be-FV" },
        { form: "mundu", gloss: "c1.person" },
        { form: "wa", gloss: "c1.ASSOC" },
        { form: "e-ri-mi-a", gloss: "c5-c5-take-FV" },
        { form: "enzira", gloss: "c9.road" },
        { form: "eyo", gloss: "that." },
        { form: "Hane", gloss: "There.is" },
        { form: "akathirisa", gloss: "shortcut" },
        { form: "ako", gloss: "c12-REL?" },
        { form: "mundu", gloss: "c1.person" },
        { form: "a-ki-ma-y-a", gloss: "SM.c1-TM-TM-go-FV" },
        { form: "e-ri-gend-a-yo", gloss: "c5-c5-go-FV-c9.PRN" },
      ],
    },
  };
  const actualOutput = parseSentence(tiddlyText);
  assertEquals(actualOutput, expectedOutput);
});

Deno.test("parsePrompt function should remove the 'Sentence: ' prefix from the prompt", () => {
  const prompt = "Sentence: Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.";
  const expectedOutput = "Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.";
  const actualOutput = parsePrompt(prompt);
  assertEquals(actualOutput, expectedOutput);
});


Deno.test("parseSentence parses a sentence correctly", () => {
  const tiddlyText = `---
id: 1234
author: Alice
date: 2022-04-19
---
Context: Lorem ipsum dolor sit amet, consectetur adipiscing elit.

''Sentence: ''
Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.<br>
Si-u-a-bi-a mundu wa e-ri-mi-a enzira eyo. Hane akathirisa ako mundu a-ki-ma-y-a e-ri-gend-a-yo<br>
NEG-SM.2sg-TM-be-FV c1.person c1.ASSOC c5-c5-take-FV c9.road that. There.is shortcut c12-REL? c1.person SM.c1-TM-TM-go-FV c5-c5-go-FV-c9.PRN<br>
"You shouldn't have taken that road. There is a shortcut that you could have taken."

Comment 1: This sentence is interesting because...
Comment 2: Another comment.`;

  const expected = {
    sentence: {
      metadata: {
        id: "1234",
        author: "Alice",
        date: "2022-04-19",
      },
      prompt: "You shouldn't have taken that road. There is a shortcut that you could have taken.",
      transcription:
        "Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.",
      translation:
        '"You shouldn\'t have taken that road. There is a shortcut that you could have taken."',
      words: [
        { form: "Si-u-a-bi-a", gloss: "NEG-SM.2sg-TM-be-FV" },
        { form: "mundu", gloss: "c1.person" },
        { form: "wa", gloss: "c1.ASSOC" },
        { form: "e-ri-mi-a", gloss: "c5-c5-take-FV" },
        { form: "enzira", gloss: "c9.road" },
        { form: "eyo.", gloss: "that." },
        { form: "Hane", gloss: "There.is" },
        { form: "akathirisa", gloss: "shortcut" },
        { form: "ako", gloss: "c12-REL?" },
        { form: "mundu", gloss: "c1.person" },
        { form: "a-ki-ma-y-a", gloss: "SM.c1-TM-TM-go-FV" },
        { form: "e-ri-gend-a-yo", gloss: "c5-c5-go-FV-c9.PRN" },
      ],
    },
  };

  const actual = parseSentence(tiddlyText);
  assertEquals(actual, expected);
});

Deno.test("parseSentence handles missing comments correctly", () => {
  const tiddlyText = `---
speaker: Alice
title: Test Sentence
---

Context: Some context

''Sentence: ''Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.<br>
Si-u-a-bi-a mundu wa e-ri-mi-a enzira eyo. Hane akathirisa ako mundu a-ki-ma-y-a e-ri-gend-a-yo<br>
NEG-SM.2sg-TM-be-FV c1.person c1.ASSOC c5-c5-take-FV c9.road that. There.is shortcut c12-REL? c1.person SM.c1-TM-TM-go-FV c5-c5-go-FV-c9.PRN<br>
"You shouldn't have taken that road. There is a shortcut that you could have taken."
`

  const expected = {
    sentence: {
      metadata: {
        speaker: 'Alice',
        title: 'Test Sentence',
      },
      prompt: 'Síwabyá mundú w’ erímy’ enzir’ eyô. Hané akathirísa ako mundú akímaya erigendáyô.',
      transcription: 'Si-u-a-bi-a mundu wa e-ri-mi-a enzira eyo. Hane akathirisa ako mundu a-ki-ma-y-a e-ri-gend-a-yo',
      translation: '"You shouldn\'t have taken that road. There is a shortcut that you could have taken."',
      words: [
        { form: 'NEG-SM.2sg-TM-be-FV', gloss: 'c1.person' },
        { form: 'c1.ASSOC', gloss: 'c5-c5-take-FV' },
        { form: 'c9.road', gloss: 'that.' },
        { form: 'There.is', gloss: 'shortcut' },
        { form: 'c12-REL?', gloss: 'c1.person' },
        { form: 'SM.c1-TM-TM-go-FV', gloss: 'c5-c5-go-FV-c9.PRN' },
      ],
      comments: []
    }
  }

  const actual = parseSentence(tiddlyText)

  assertEquals(actual, expected)
})


*/