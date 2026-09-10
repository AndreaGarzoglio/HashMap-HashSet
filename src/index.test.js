/**
 * Test suite for index.js
 * Add your tests here to verify the functionality of your main code
 */

import { HashMap, HashSet } from "./index.js";

const map = new HashMap();
map.set("apple", "red");
map.set("banana", "yellow");
map.set("carrot", "orange");

test("get / has", () => {
  expect(map.get("apple")).toBe("red");
  expect(map.has("apple")).toBe(true);
  expect(map.has("missing")).toBe(false);
});

test("overwrite keeps length stable", () => {
  map.set("apple", "green");
  expect(map.get("apple")).toBe("green");
  expect(map.length()).toBe(3);
});

test("remove", () => {
  expect(map.remove("banana")).toBe(true);
  expect(map.has("banana")).toBe(false);
  expect(map.remove("banana")).toBe(false);
});

test("keys / values / entries", () => {
  expect(map.keys().sort()).toEqual(["apple", "carrot"]);
  expect(map.values().sort()).toEqual(["green", "orange"]);
  expect(map.entries().length).toBe(2);
});

test("clear", () => {
  map.clear();
  expect(map.length()).toBe(0);
  expect(map.keys()).toEqual([]);
});

const set = new HashSet();
set.set("alpha");
set.set("beta");
set.set("alpha");

test("set is deduplicated", () => {
  expect(set.length()).toBe(2);
});

test("has", () => {
  expect(set.has("alpha")).toBe(true);
  expect(set.has("gamma")).toBe(false);
});

test("remove", () => {
  expect(set.remove("alpha")).toBe(true);
  expect(set.has("alpha")).toBe(false);
});
