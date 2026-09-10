# HashMap & HashSet

Implementazione da zero di una **HashMap** e di una **HashSet** in JavaScript,
con una piccola web app interattiva per provarle a comando senza dover
aprire la console.

L'app riprende struttura, stack e tema grafico del progetto
[Linked-List](https://github.com/AndreaGarzoglio/Linked-List): un'interfaccia
a "terminale", font monospace, e un pannello di comandi diviso in
`mutate` (operazioni che modificano la struttura) e `query` (operazioni di
sola lettura), con lo stato aggiornato in tempo reale a ogni comando.

## Struttura del progetto

```
src/
├── index.html         # markup della UI (tab HashMap / HashSet)
├── index.js            # le classi HashMap e HashSet
├── main.js             # collega la UI alle classi (event listener, log, stato)
├── styles.css           # tema "terminale" (JetBrains Mono, dark, violet)
├── index.test.js       # test unitari (Jest)
└── __mocks__/
    └── styleMock.js    # mock del CSS per i test
```

File di configurazione in root: `webpack.config.js`, `babel.config.cjs`,
`eslint.config.js`, `jest.config.cjs`, `.prettierrc` / `.prettierignore`,
e un hook `.husky/pre-commit` che esegue `prettier` sui file in staging.

## Le classi

### `HashMap`

Mappa chiave/valore basata su bucket con _separate chaining_:

- `set(key, value)` — inserisce o aggiorna una coppia; se il fattore di
  carico (`size / capacity`) supera `loadFactor` (default `0.75`), la
  capacità raddoppia e tutte le coppie vengono re-inserite (rehashing).
- `get(key)` — restituisce il valore associato, o `null` se assente.
- `has(key)` — verifica la presenza di una chiave.
- `remove(key)` — rimuove una coppia, restituisce `true`/`false`.
- `length()` — numero di coppie presenti.
- `currentLoad()` — fattore di carico corrente.
- `clear()` — svuota la mappa.
- `keys()`, `values()`, `entries()` — liste di chiavi, valori o coppie
  `[key, value]`.
- `hash(key)` — funzione di hash polinomiale (base 31) usata per calcolare
  l'indice del bucket.

Le chiavi devono essere stringhe (`validateKey`); un indice fuori dai limiti
dell'array di bucket lancia un errore (`assertIndexInBounds`).

### `HashSet`

Stessa logica di bucket/hashing della `HashMap`, ma memorizza solo valori
unici (nessuna coppia chiave/valore):

- `set(value)` — aggiunge un valore se non è già presente.
- `has(value)` — verifica la presenza di un valore.
- `remove(value)` — rimuove un valore.
- `length()`, `currentLoad()`, `clear()`, `keys()` — analoghi alla `HashMap`.

## L'interfaccia interattiva

Aprendo la app si vedono due tab nella barra del titolo, `~/hashmap.js` e
`~/hashset.js`, che mostrano ciascuna:

- lo **stato corrente** della struttura, visualizzato come elenco dei
  bucket (`[0] apple: red  [1] ·  [2] banana: yellow …`), aggiornato con un
  effetto "typewriter" a ogni comando;
- un pannello **mutate** con i comandi che modificano la struttura (`set`,
  `remove`, `clear`);
- un pannello **query** con i comandi di sola lettura (`get`/`has`,
  `length`, `currentLoad`, `entries`/`keys`);
- un **log** in basso che tiene traccia degli ultimi comandi eseguiti e
  degli eventuali errori (es. campo mancante).

Lo stato di entrambe le strutture viene salvato in `localStorage`, quindi
resta invariato ricaricando la pagina.

## Comandi

```bash
npm install       # installa le dipendenze
npm run dev       # avvia il dev server (webpack-dev-server) con hot reload
npm run build     # build di produzione in docs/
npm run lint      # esegue eslint su src/
npm test          # esegue i test con Jest
npm run test:watch
```
