# notify.me


## Getting started

```html
<link rel="stylesheet" href="path/to/notify-me.min.css">
<script src="path/to/notify-me.min.js"></script>
```

## Basic usages

A simple info notice type with a simple text.

```javascript
$.notify.info('A simple info notice');
```

There are four types of notice : info, warning, success and error.

```javascript
$.notify.info('I am a info notice');
$.notify.warning('I am a warning notice');
$.notify.success('I am a success notice');
$.notify.error('I am a error notice');
```

You can give a title to the notice by specifying a second string argument

```javascript
$.notify.info('The title', 'The text');
```

Note : The title argument must always be specified before the text argument

## Advanced use

There is a third argument for more options. This must be an object.

You do not need to use the string type arguments to set the title and the text. You can directly define them in the options argument.

```javascript
$.notify.info({
    title:  'My title',
    text:  'My text'
});
```

## Bootstrap & FontAwesome compatibility

You can make notify.me compatible with Bootstrap 2/3 and FontAwesome by calling the dedicated methods :

For Bootstrap 3 :

```javascript
$.notify.useBootstrap3();
```

For Bootstrap 2 :

```javascript
$.notify.useBootstrap2();
```

For FontAwesome :

```javascript
$.notify.useFontAwesome();
```
