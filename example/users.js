'use strict';
const StateRegistry = require('../');

const appState = new StateRegistry({
    users: [],
});

appState.extendUpdate('$arrayRemove', function (value, newObject, spec, object) {
    if (!Array.isArray(newObject)) {
        throw new Error('$arrayRemove applied to a non-array');
    }

    if (!Array.isArray(value)) {
        throw new Error('$arrayRemove expected value to be an array');
    }

    let originalValue = newObject === object ? object.slice() : newObject;
    value.forEach(function (item) {
        let index;
        while ((index = originalValue.indexOf(item)) >= 0) {
            if (originalValue === object) {
                originalValue = originalValue.slice();
            }

            originalValue.splice(index, 1);
        }
    });

    return originalValue;
});

appState.extendUpdate('$findAndRemove', function (value, newObject, spec, object) {
    if (!Array.isArray(newObject)) {
        throw new Error('$findAndRemove applied to a non-array');
    }

    if (typeof value !== 'function') {
        throw new Error('$findAndRemove expected value to be a function');
    }

    return appState.updateContext(newObject, {
        $arrayRemove: newObject.filter(value),
    });
});

appState.addChangeListener(function (newState, oldState) {
    console.log('[ CHANGE\n    from:', oldState, '\n    to:', newState, '\n]');
});

function addUser(user) {
    appState.update({
        users: { $push: [user] },
    });
}

function removeUser(user) {
    appState.update({
        users: { $arrayRemove: [user] },
    });
}

function removeUserById(id) {
    appState.update({
        users: { $findAndRemove: (user) => user.id === id },
    });
}

const user1 = {
    id: 1,
    name: 'User #1',
};
const user2 = {
    id: 2,
    name: 'User #2',
};

console.log('  state:', appState.state, '\n');

console.log('addUser(', user1, ')');
addUser(user1);
console.log('  state:', appState.state, '\n');

console.log('addUser(', user2, ')');
addUser(user2);
console.log('  state:', appState.state, '\n');

console.log('appState.commitChanges()');
appState.commitChanges();
console.log('  state:', appState.state, '\n');

console.log('removeUser(', user1, ')');
removeUser(user1);
console.log('  state:', appState.state, '\n');

console.log('appState.commitChanges()');
appState.commitChanges();
console.log('  state:', appState.state, '\n');

console.log('removeUser(', user1, ')');
removeUser(user1);
console.log('  state:', appState.state, '\n');

console.log('appState.commitChanges()');
appState.commitChanges();
console.log('  state:', appState.state, '\n');

console.log('removeUserById(', 2, ')');
removeUserById(2);
console.log('  state:', appState.state, '\n');

console.log('appState.commitChanges()');
appState.commitChanges();
console.log('  state:', appState.state, '\n');
