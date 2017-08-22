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

  var moduleName = 'ng-middle-click';
  var appAttr = document.documentElement.attributes['ng-app'] ||
                document.body.attributes['ng-app'];

  // Using existing angular app global module or setting a new one called 'ng-middle-click'
  var app = (appAttr) ? angular.module(appAttr.value) : angular.module('ng-middle-click', []);

  // Creating directive
  app.directive('ngMiddleClick', ngMiddleClick);
}());
