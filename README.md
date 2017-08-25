# ng-middle-click
> A simple directive to watch middle button click event. Evaluates its own expression or from ng-click.

### Features
* Evaluates it's own expression or get `ng-click`'s expression.
* Prevents to execution when the tag has the disabled property activated.
* Listen `onauxclick` event or `mousedown` for older browsers.
* **Easy to use!** Auto detects angular global module on `html` or `body` tags. But to get this you must place the directive file after your angular init file.
* Creates a module called `'ng-middle-click'` when the conditions of the topic above aren't fulfilled.

### Note
> It' Should be used this directive on `a` tag to get the default behavior of open new tab when clicking with the middle button.

### Installation
Install via bower

```shell
bower install ng-middle-click -S
```

### Using
It will look for the `ng-app` attribute on the `<html>` or `<body>` tags to get your main module. If not found it'll create a module called `ng-middle-click`, so you have to inject it on your angular module.

**Using with `ng-click`**
```html
<a href="#" ng-click="onClick($event)" ng-middle-click>My link</a>
```

**Using it alone**
```html
<a href="#" ng-middle-click="onMiddleClick($event)">My link</a>
```
> It will evaluate the same expression of `ng-click`

### Development
Install all the dependencies running the following commands:

```shell
npm install
bower install
```

#### Commands
* `gulp` jslint, built, test, run server and open page `/demo`
* `gulp build` test, jslint
* `gulp test` run tests once
* `gulp serve-test` run karma serve and execute them when `src` or `test` files are changed


### License
MIT
