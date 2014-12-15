elephas
=======================

Some added sugar on top of express to give our app some sensible defaults and a little structure.

## Install

```sh
npm install elephas --save
```

## Quick Start

```js
var config = {
    server: {
        port: 3000
    }
};

var elephas = require('elephas')(config);
elephas.createServer();

```

##Options
...

##Hooks
Using the following hooks, you can jump in between each stage of the boot process to run your own code. You **MUST** execute the `done()` callback so that the boot process can continue. All hooks are optional.

```js
elephas.createServer({
    beforeRoutes: function(done, app) {
        // Do some stuff here

        done(); // Let elephas know when you have finished
    }
});
```

####List of hooks (in order of execution)

* beforeServices
* beforeMiddleware
* beforeRoutes
* afterRoutes
* onComplete



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


[npm-image]: https://img.shields.io/npm/v/koa.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa