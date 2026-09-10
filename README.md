# HashMap & HashSet

A from-scratch JavaScript implementation of a **HashMap** and a **HashSet**,
paired with a small interactive web app so you can try them out with
commands instead of opening a console.

The app mirrors the structure, stack and visual theme of the
[Linked-List](https://github.com/AndreaGarzoglio/Linked-List) project: a
"terminal" style interface, monospace font, and a command panel split into
`mutate` (operations that change the structure) and `query` (read-only
operations), with the state updating live after every command.

## Project structure

```
src/
├── index.html         # UI markup (HashMap / HashSet tabs)
├── index.js            # the HashMap and HashSet classes
├── main.js             # wires the UI to the classes (event listeners, log, state)
├── styles.css           # "terminal" theme (JetBrains Mono, dark, violet)
├── index.test.js       # unit tests (Jest)
└── __mocks__/
    └── styleMock.js    # CSS mock used by the tests
```

Config files in the repo root: `webpack.config.js`, `babel.config.cjs`,
`eslint.config.js`, `jest.config.cjs`, `.prettierrc` / `.prettierignore`,
plus a `.husky/pre-commit` hook that runs `prettier` on staged files.

## The classes

### `HashMap`

A key/value map backed by buckets with separate chaining:

- `set(key, value)`: inserts or updates a pair. If the load factor
  (`size / capacity`) goes above `loadFactor` (default `0.75`), the
  capacity doubles and every pair is re-inserted (rehashing).
- `get(key)`: returns the value tied to a key, or `null` if it is missing.
- `has(key)`: checks whether a key is present.
- `remove(key)`: removes a pair, returns `true`/`false`.
- `length()`: number of pairs currently stored.
- `currentLoad()`: the current load factor.
- `clear()`: empties the map.
- `keys()`, `values()`, `entries()`: lists of keys, values, or `[key, value]`
  pairs.
- `hash(key)`: a polynomial hash function (base 31) used to compute the
  bucket index.

Keys must be strings (`validateKey`); an index outside the bucket array's
bounds throws an error (`assertIndexInBounds`).

### `HashSet`

Uses the same bucket/hashing logic as `HashMap`, but stores unique values
only (no key/value pairs):

- `set(value)`: adds a value if it is not already present.
- `has(value)`: checks whether a value is present.
- `remove(value)`: removes a value.
- `length()`, `currentLoad()`, `clear()`, `keys()`: same behavior as in
  `HashMap`.

## The interactive UI

Opening the app shows two tabs in the title bar, `~/hashmap.js` and
`~/hashset.js`, each displaying:

- the **current state** of the structure, rendered as a list of buckets
  (`[0] apple: red  [1] ·  [2] banana: yellow ...`), updated with a
  typewriter effect after every command;
- a **mutate** panel with the commands that change the structure (`set`,
  `remove`, `clear`);
- a **query** panel with read-only commands (`get`/`has`, `length`,
  `currentLoad`, `entries`/`keys`);
- a **log** at the bottom that tracks the latest commands and any errors
  (for example, a missing field).

Both structures' state is saved to `localStorage`, so it survives a page
reload.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server (webpack-dev-server) with hot reload
npm run build     # production build, output in docs/
npm run lint      # run eslint on src/
npm test          # run the Jest tests
npm run test:watch
```
