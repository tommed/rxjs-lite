# rxjs-lite
Simple event aggregator pipeline for browser front-end JavaScript when RxJs is too much

## Demo

Install developer dependencies and run a basic web server:

```bash
$ yarn install
$ yarn serve
```

When the web server is running it'll provide a link; click this and run the _test.html_ page to show this library working.

## Installation

`rxjs-lite.js` is a standalone script file; simply add a reference to it on your page.

## Getting Started

Similar concept to [RxJs](https://www.learnrxjs.io/) but a far, far simpler implementation, methods optimised for browser JavaScript rather than NodeJs development.

### One-Way Binding

You can bind the inner-text of a _span_ tag to the value of a select control:

```html
<p>You picked <span id="colorSelection">?</span></p>
<select 
  class="control" 
  onchange="$emit('color-changed', event.target.value)">
    <option selected value="#fff">White</option>
    <option value="#999">Grey</option>
    <option value="#f00">Red</option>
    <option value="#0f0">Green</option>
    <option value="#00f">Blue</option>
</select>

<script>
// update the css style of an element based on value
$subscribe('color-changed', 'set-background-color')
    .updateStyle('body', 'background-color')
    .updateTextContent('#colorSelection')
    .setAttribute(
        '#colorSelection', 
        'data-color', 
        (e) => e.replace('#', ''))
    .startWith('#fff');
</script>
```

Or just simply map/use a particular value like so:

```html
<p>You picked <span id="choice">?</span></p>
<input type="button" onclick="$emit('clicked', '1')" value="1"/>
<input type="button" onclick="$emit('clicked', '2')" value="2"/>

<script>
// update the css style of an element based on value
$subscribe('clicked', 'receive-click')
    .map((e) => parseInt(e, 10) * 20)
    .updateTextContent('#choice')
    .with((e) => document.title = e.toString())
    .startWith('1');
</script>
```