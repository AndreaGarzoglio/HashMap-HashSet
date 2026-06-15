class HashSet {
    constructor(loadFactor, capacity) {
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

    assertIndexInBounds(index) {
        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
    }

    getBucketIndex(key) {
        this.validateKey(key);
        const index = this.hash(key);
        this.assertIndexInBounds(index);
        return index;
    }

    hash(key) {
        this.validateKey(key);
        let hashCode = 0;
        const prime = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (prime * hashCode + key.charCodeAt(i)) % this.capacity;
        }
        return hashCode;
    }

    set(key) {
        const index = this.getBucketIndex(key);
        if (this.buckets[index] === null) {
            this.buckets[index] = [];
        }

        const bucket = this.buckets[index];
        const existing = bucket.find((k) => k === key);
        if (existing) {
            return;
        }

        bucket.push(key);
        this.size++;

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
        const index = this.getBucketIndex(key);
        const bucket = this.buckets[index];
        if (bucket === null) return false;
        return bucket.includes(key);
    }

    remove(key) {
        const index = this.getBucketIndex(key);
        const bucket = this.buckets[index];
        if (bucket === null) return false;

        const entryIndex = bucket.indexOf(key);
        if (entryIndex === -1) return false;

        bucket.splice(entryIndex, 1);
        this.size--;

        if (bucket.length === 0) {
            this.buckets[index] = null;
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
}

export { HashSet };