// Annotated copies of the HashMap/HashSet logic (merged with the shared
// HashTable base they extend in index.js), shown in the "how it works"
// modal. Kept separate from index.js so the real, uncommented source stays
// clean while this stays purely explanatory.

const HASHMAP_SOURCE = `class HashMap {
  constructor(loadFactor, capacity) {
    // How full the table can get (size / capacity) before it grows.
    this.loadFactor = loadFactor ?? 0.75;
    this.capacity = capacity ?? 16;

    // The table: an array of "buckets". Each one starts empty (null) and
    // becomes an array of [key, value] pairs once something hashes there.
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  validateKey(key) {
    // Keys must be strings, since hash() relies on charCodeAt().
    if (typeof key !== "string") {
      throw new Error("Key must be a string!");
    }
  }

  hash(key) {
    // A classic polynomial rolling hash: each character nudges the hash,
    // weighted by its position via the running multiplication by \`prime\`.
    let hashCode = 0;
    const prime = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (prime * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode; // always between 0 and capacity - 1
  }

  set(key, value) {
    this.validateKey(key);
    const index = this.hash(key);
    if (this.buckets[index] === null) {
      this.buckets[index] = []; // first key ever to land in this bucket
    }

    const bucket = this.buckets[index];

    // Two different keys can hash to the same index (a "collision"). This
    // is handled with separate chaining: the bucket becomes a small list
    // of [key, value] pairs instead of a single slot.
    const existing = bucket.find(([k]) => k === key);
    if (existing) {
      existing[1] = value; // key already exists: overwrite its value
      return;
    }

    bucket.push([key, value]); // brand new key
    this.size++;

    // Once the table gets too full, collisions get more likely and
    // lookups slow down. Doubling the capacity and re-inserting every
    // entry keeps operations close to O(1) on average.
    if (this.size > this.capacity * this.loadFactor) {
      const oldBuckets = this.buckets;
      this.capacity *= 2;
      this.buckets = new Array(this.capacity).fill(null);
      this.size = 0;

      for (const bucket of oldBuckets) {
        if (!bucket) continue;
        for (const [k, v] of bucket) this.set(k, v); // re-insert at new indices
      }
    }
  }

  get(key) {
    this.validateKey(key);
    const bucket = this.buckets[this.hash(key)];
    if (bucket === null) return null; // nothing ever hashed here
    const pair = bucket.find(([k]) => k === key);
    return pair ? pair[1] : null; // null also means "key not found"
  }

  has(key) {
    this.validateKey(key);
    const bucket = this.buckets[this.hash(key)];
    return bucket !== null && bucket.some(([k]) => k === key);
  }

  remove(key) {
    this.validateKey(key);
    const bucket = this.buckets[this.hash(key)];
    if (bucket === null) return false;

    const entryIndex = bucket.findIndex(([k]) => k === key);
    if (entryIndex === -1) return false;

    bucket.splice(entryIndex, 1);
    this.size--;

    // No point keeping an empty array around once its last entry is gone.
    if (bucket.length === 0) {
      this.buckets[this.hash(key)] = null;
    }

    return true;
  }

  length() {
    return this.size;
  }

  currentLoad() {
    // How full the table is right now, as a fraction of its capacity.
    return this.length() / this.capacity;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  keys() {
    const keys = [];
    for (const bucket of this.buckets) {
      if (!bucket) continue;
      for (const [k] of bucket) keys.push(k);
    }
    return keys;
  }

  values() {
    const values = [];
    for (const bucket of this.buckets) {
      if (!bucket) continue;
      for (const [, v] of bucket) values.push(v);
    }
    return values;
  }

  entries() {
    const entries = [];
    for (const bucket of this.buckets) {
      if (!bucket) continue;
      for (const pair of bucket) entries.push(pair);
    }
    return entries;
  }
}`;

const HASHSET_SOURCE = `class HashSet {
  constructor(loadFactor, capacity) {
    // Same bucket layout as HashMap, but a bucket holds bare values
    // instead of [key, value] pairs: in a set, the value IS the key.
    this.loadFactor = loadFactor ?? 0.75;
    this.capacity = capacity ?? 16;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  validateKey(key) {
    if (typeof key !== "string") {
      throw new Error("Key must be a string!");
    }
  }

  hash(key) {
    // Identical hashing strategy to HashMap: same trade-offs, same result.
    let hashCode = 0;
    const prime = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (prime * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  set(key) {
    this.validateKey(key);
    const index = this.hash(key);
    if (this.buckets[index] === null) {
      this.buckets[index] = [];
    }

    const bucket = this.buckets[index];

    // Sets only care about uniqueness: adding an existing value is a no-op.
    const existing = bucket.find((k) => k === key);
    if (existing) {
      return;
    }

    bucket.push(key);
    this.size++;

    // Same growth strategy as HashMap: keep the table roomy enough that
    // lookups stay fast as it fills up.
    if (this.size > this.capacity * this.loadFactor) {
      const oldBuckets = this.buckets;
      this.capacity *= 2;
      this.buckets = new Array(this.capacity).fill(null);
      this.size = 0;

      for (const bucket of oldBuckets) {
        if (!bucket) continue;
        for (const key of bucket) this.set(key);
      }
    }
  }

  has(key) {
    this.validateKey(key);
    const bucket = this.buckets[this.hash(key)];
    return bucket !== null && bucket.includes(key);
  }

  remove(key) {
    this.validateKey(key);
    const bucket = this.buckets[this.hash(key)];
    if (bucket === null) return false;

    const entryIndex = bucket.indexOf(key);
    if (entryIndex === -1) return false;

    bucket.splice(entryIndex, 1);
    this.size--;

    if (bucket.length === 0) {
      this.buckets[this.hash(key)] = null;
    }

    return true;
  }

  length() {
    return this.size;
  }

  currentLoad() {
    return this.size / this.capacity;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  keys() {
    const keys = [];
    for (const bucket of this.buckets) {
      if (!bucket) continue;
      for (const key of bucket) keys.push(key);
    }
    return keys;
  }
}`;

export { HASHMAP_SOURCE, HASHSET_SOURCE };
