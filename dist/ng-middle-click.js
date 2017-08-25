/*!
 * ng-middle-click
 * 
 * Version: 0.0.1 - 2017-09-02T21:04:24.177Z
 * License: MIT
 */


/* globals document, console */
(function() {
  'use strict';

  function ngMiddleClick(){
    var directive = {
      restrict: 'A',
      link: function ngMiddleClickLink(scope, element, attrs){
        var clickExpression = attrs.ngMiddleClick || attrs.ngClick;

        if (clickExpression){
          // Using 'auxclick' cause modern browsers no longer trigger 'click' event for middle button
          // https://w3c.github.io/uievents/#event-type-auxclick
          var event = ('onauxclick' in document.documentElement) ? 'auxclick' : 'mousedown';

          element.on(event, function (e){
            if(e.which === 2){
              // Not sure if the 'preventDefault' will always work when using 'mousedown' event
              if(e.currentTarget.getAttribute('disabled') === 'disabled'){
                return e.preventDefault();
              }

              scope.$eval(clickExpression, { $event: e });
            }
          });
        }
      }
    };
    return directive;
  }

  var app;
  var moduleName = 'ng-middle-click';
  var appAttr = document.documentElement.getAttribute('ng-app') ||
                document.body.getAttribute('ng-app');

  // Using existing angular app global module or setting a new one called 'ng-middle-click'
  try {
    app = angular.module(appAttr);
  } catch (e) {
    app = angular.module('ng-middle-click', []);
  }

  // Creating directive
  app.directive('ngMiddleClick', ngMiddleClick);
}());
