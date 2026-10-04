import test from "node:test";
import assert from "node:assert/strict";
import { stripHtml, decodeEntities } from "../src/utils/text.js";

test("stripHtml removes tags and decodes entities", () => {
  assert.equal(stripHtml("<p>Hello &amp; <b>welcome</b></p>"), "Hello & welcome");
});

test("decodeEntities handles apostrophes", () => {
  assert.equal(decodeEntities("it&#039;s"), "it's");
});
