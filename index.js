'use strict';
var newUpdateContext = require('immutability-helper').newContext;

function StateRegistry(initialState) {
    this.state = initialState || {};
    this.pendingChanges = [];
    this.changeListeners = [];
    this.updateContext = newUpdateContext();
}

var proto = StateRegistry.prototype;

proto.addChangeListener = function (listener) {
    this.changeListeners.push(listener);
};

proto.removeChangeListener = function (listener) {
    const index = this.changeListeners.indexOf(listener);
    if (index >= 0) {
        this.changeListeners.splice(index, 1);
    }
};

proto.update = function (changeSet) {
    this.pendingChanges.push(changeSet);
};

proto.commitChanges = function () {
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
};

proto.updateAndCommit = function (changeSet) {
    this.update(changeSet);
    this.commitChanges();
};

proto.extendUpdate = function (directive, fnc) {
    this.updateContext.extend(directive, fnc);
};

module.exports = StateRegistry;
