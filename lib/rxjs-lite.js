(function() {

    console.log('script_loaded: rxjs-lite.js');

    const CallbackContext = function(eventName, name, target) {
        this.eventName = eventName;
        this.name = name;
        this.callbacks = [];
        this.target = target;
    }

    CallbackContext.prototype.runAllCallbacks = function (e) {
        let state = e.detail;
        for (let i = 0; i < this.callbacks.length; i++) {
            // run callback
            const callback = this.callbacks[i];
            const returnValue = callback.run(state);
            // should we adjust the state?
            if (callback.setState) {
                console.log('adjusted state after callback (old vs new)', state, returnValue);
                state = returnValue;
            }
        }
        return state;
    }

    CallbackContext.prototype.startWith = function (value) {
        $emit(this.eventName, value);
        return this;
    }

    CallbackContext.prototype.with = function(run) {
        this.callbacks.push({ 
            run
        });
        return this;
    }

    CallbackContext.prototype.as = function(eventName) {
        this.callbacks.push({ 
            run: function (e) {
                $emit(eventName, e);
            }
        });
        return this;
    }

    // map is the same as with, but user should return a value
    CallbackContext.prototype.map = function(run) {
        this.callbacks.push({
            run,
            setState: true,
        });
        return this;
    }

    CallbackContext.prototype.updateStyle = function (querySelector, styleName, valueSelector) {
        this.callbacks.push({
            run: function(e) {
                const value = valueSelector ? valueSelector(e) : e;
                document.querySelector(querySelector).style[styleName] = value;
            }
        });
        return this;
    }

    CallbackContext.prototype.updateTextContent = function(querySelector, valueSelector) {
        this.callbacks.push({
            run: function (e) {
                const value = valueSelector ? valueSelector(e) : e;
                document.querySelector(querySelector).textContent = value;
            },
        });
        return this;
    }

    CallbackContext.prototype.setAttribute = function(querySelector, attributeName, valueSelector) {
        this.callbacks.push({
            run: function (e) {
                const value = valueSelector ? valueSelector(e) : e;
                document.querySelector(querySelector).setAttribute(attributeName, value);
            },
        });
        return this;
    }

    // context register
    window._rxjslBindContexts = {};

    // default emit load
    window.addEventListener('load', function (e) {
       $emit(':load', e);
    });

    window.$emit = function (eventName, detail, owner) {
        const target = owner || window;
        const thisEvent = new CustomEvent(eventName, { detail });
        console.log(`$emit ${eventName}`, detail);
        target.dispatchEvent(thisEvent);
    }

    window.$subscribe = function (eventName, name, owner) {
        const target = owner || window;
        const context = new CallbackContext(eventName, name, target);
        target.addEventListener(eventName, function (e) {
            console.log(`calling subscriber with pipeline of ${this.callbacks.length}`, this);
            this.runAllCallbacks(e);
        }.bind(context));
        return context;
    }

})();