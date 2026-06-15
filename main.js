import { HashMap } from "./index.js";
import { HashSet } from "./hashset.js";

const test = new HashMap();

console.log("--- Initial Insert (12 pairs) ---");
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
console.log("length:", test.length());
console.log("capacity:", test.capacity);
console.log("currentLoad:", test.currentLoad());
console.log("entries:", test.entries());

console.log("--- Overwrite Existing Keys ---");
test.set("frog", "purple");
test.set("hat", "gray");
test.set("lion", "blue");
console.log("length (should stay 12):", test.length());
console.log("frog:", test.get("frog"));
console.log("hat:", test.get("hat"));
console.log("lion:", test.get("lion"));

console.log("--- Trigger Growth (13th pair) ---");
test.set("moon", "silver");
console.log("length:", test.length());
console.log("capacity (should be 32):", test.capacity);
console.log("currentLoad:", test.currentLoad());
console.log("bucket sizes:", test.buckets.map((b) => (b ? b.length : 0)));

console.log("--- get / has ---");
console.log('get("apple"):', test.get("apple"));
console.log('get("missing"):', test.get("missing"));
console.log('has("apple"):', test.has("apple"));
console.log('has("missing"):', test.has("missing"));

console.log("--- remove ---");
console.log('remove("dog"):', test.remove("dog"));
console.log('remove("dog") again:', test.remove("dog"));
console.log('has("dog"):', test.has("dog"));
console.log("length after remove:", test.length());

console.log("--- keys / values / entries ---");
console.log("keys:", test.keys());
console.log("values:", test.values());
console.log("entries:", test.entries());

console.log("--- collision demo (same index as apple) ---");
const existingKey = "apple";
const collidingKey = "word1809";
const appleIndex = test.hash(existingKey);
test.set(collidingKey, "collision-value");
console.log("apple/index:", existingKey, appleIndex);
console.log("colliding/index:", collidingKey, test.hash(collidingKey));
console.log("bucket at apple index:", test.buckets[appleIndex]);
console.log(
  "full hashmap buckets:",
  test.buckets.map((bucket, index) => ({
    index,
    entries: bucket ?? [],
    size: bucket ? bucket.length : 0,
  })),
);
console.log("entries:", test.entries());

console.log("--- clear ---");
test.clear();
console.log("length after clear:", test.length());
console.log("keys after clear:", test.keys());
console.log("values after clear:", test.values());

console.log("--- HashSet smoke test ---");
const set = new HashSet();
set.set("alpha");
set.set("beta");
set.set("alpha");
console.log("length:", set.length());
console.log("has alpha:", set.has("alpha"));
console.log("has gamma:", set.has("gamma"));
console.log("keys:", set.keys());
