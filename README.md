# ng-middle-click

> A simple directive to watch middle button click event. Evaluates its own expression or from ng-click.

### Features
* Evaluates it's own expression or get `ng-click`'s expression.
* Prevents to execution when the tag has the disabled property activated.
* Listen `onauxclick` event or `mousedown` for older browsers.
* Should be used on `a` tag to get the default behavior of open new tab when clicking with the middle button.

### Installation

Install via bower

```shell
bower install ng-middle-click -S
```

### Using

It will look for the `ng-app` attribute on the `<html>` or `<body>` tags to get your main module. If not found it'll create a module called `ng-middle-click`, so you have to inject it on your angular module.

**Using it alone**
```html
<a href="#" ng-middle-click="onMiddleClick($event)">My link</a>
```

**Using with `ng-click`**
```html
<a href="#" ng-click="onClick($event)" ng-middle-click>My link</a>
```
> It will evaluate the same expression of `ng-click`

### Editing the project

Install all the dependencies running the following commands:

```shell
npm install
bower install
```

**Open demo page and build**, just run:
```shell
gulp
```

### License
MIT
