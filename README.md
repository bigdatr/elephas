elephas
=======================

Some added sugar on top of express to give our app some sensible defaults and a little structure.

## Install

```sh
npm install elephas --save
```

## Usage

```js
var elephas = require('elephas');

var config = {
	server: {
    	port: 3000
    }
};

var app = elephas(config);
app.createServer();

```

###Options
...

###Hooks
...


##Logging
A winston logger.

```js
var logger = require('elephas/lib/logger');

logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

```

## Testing

```js
npm test
```

## License
[BSD](https://github.com/bigdatr/elephas/blob/master/LICENSE)