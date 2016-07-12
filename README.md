# state-registry
Immutable application state registry

## API

```js
const appState = new StateRegistry(initialState)
```

Add a change to the list of pending changes.
See https://github.com/kolodny/immutability-helper for details.
```js
appState.update(changeSet);
```

Perform all pending changes.
```js
appState.commitChanges();
```

Add some changes and commit right away. This is the same as calling update()
then commitChanges().
```js
appState.updateAndCommit(changeSet);
```

Listen for state changes. The listener receive the new state as first argument
and the old state as second argument.
```js
appState.addChangeListener(listener);
```

Remove a change listener.
```js
appState.removeChangeListener(listener);
```

Extend the update functionalities.
See https://github.com/kolodny/immutability-helper for details.
```js
appState.extendUpdate(directive, fnc);
```
