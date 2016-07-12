'use strict';
const newUpdateContext = require('immutability-helper').newContext;

class StateRegistry {
    constructor (initialState) {
        this.state = initialState || {};
        this.pendingChanges = [];
        this.changeListeners = [];
        this.updateContext = newUpdateContext();
    }

    addChangeListener (listener) {
        this.changeListeners.push(listener);
    }

    removeChangeListener (listener) {
        const index = this.changeListeners.indexOf(listener);
        if (index >= 0) {
            this.changeListeners.splice(index, 1);
        }
    }

    update (changeSet) {
        this.pendingChanges.push(changeSet);
    }

    commitChanges () {
        if (!this.pendingChanges.length === 0) {
            return;
        }

        const oldState = this.state;
        const newState = this.pendingChanges.reduce(this.updateContext, oldState);
        this.pendingChanges = [];

        if (newState !== oldState) {
            this.state = newState;
            this.changeListeners.forEach(function (listener) {
                listener(newState, oldState);
            });
        }
    }

    updateAndCommit (changeSet) {
        this.update(changeSet);
        this.commitChanges();
    }

    extendUpdate (directive, fnc) {
        this.updateContext.extend(directive, fnc);
    }
}

module.exports = StateRegistry;
