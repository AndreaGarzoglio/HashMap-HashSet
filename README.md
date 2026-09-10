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
├── index.html            # UI markup (HashMap / HashSet tabs)
├── index.js              # the HashMap and HashSet classes
├── main.js               # wires the UI to the classes (event listeners, log, state)
├── annotated-source.js   # commented copies of the classes, shown in the "how it works" modal
├── styles.css            # "terminal" theme (JetBrains Mono, dark, violet)
├── index.test.js         # unit tests (Jest)
└── __mocks__/
    └── styleMock.js      # CSS mock used by the tests
```

Config files in the repo root: `webpack.config.js`, `babel.config.cjs`,
`eslint.config.js`, `jest.config.cjs`, `.prettierrc` / `.prettierignore`,
plus a `.husky/pre-commit` hook that runs `prettier` on staged files.

## The classes

`HashMap` and `HashSet` both extend a shared `HashTable` base class that
holds the bucket array, the hash function, key validation, `length()`,
`currentLoad()` and `clear()`: the two subclasses only differ in what a
bucket holds and how insertion/lookup use it.

### `HashMap`

A key/value map backed by buckets with separate chaining:

- `set(key, value)`: inserts or updates a pair. If the load factor
  (`size / capacity`) goes above `loadFactor` (default `0.75`), the
  capacity doubles and every pair is re-inserted (rehashing).
- `get(key)`: returns the value tied to a key, or `null` if it is missing.
- `has(key)`: checks whether a key is present.
- `remove(key)`: removes a pair, returns `true`/`false`.
- `keys()`, `values()`, `entries()`: lists of keys, values, or `[key, value]`
  pairs.

A key can only ever map to one value: calling `set()` again with the same
key overwrites the previous value instead of adding a second entry.

### `HashSet`

Uses the same bucket/hashing logic as `HashMap`, but stores unique values
only, with no separate value attached (the value itself acts as the key):

- `set(value)`: adds a value if it is not already present.
- `has(value)`: checks whether a value is present.
- `remove(value)`: removes a value.
- `keys()`: list of stored values.

## The interactive UI

Opening the app shows two tabs in the title bar, `~/hashmap.js` and
`~/hashset.js`. Each one is split into:

- a **command panel** on the left, itself split into two clickable tabs:
  - **mutate**: `set`, `remove`, `clear`;
  - **query**: `get`/`has`, `length`, `currentLoad`, `keys`, `values`
    (HashMap only) and `entries`;
- an **entries view** on the right: one box per key (with its value next to
  it for HashMap, or just the value for HashSet), updated live after every
  command, along with an entry count, capacity and load factor;
- a **"how it works"** button next to each title that opens a commented
  copy of that structure's source (`annotated-source.js`), explaining
  hashing, collisions and resizing line by line;
- a **log** pinned at the bottom of the window, always visible: it tracks
  the latest commands and any errors (for example, a missing field), newest
  first, scrolling horizontally.

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
