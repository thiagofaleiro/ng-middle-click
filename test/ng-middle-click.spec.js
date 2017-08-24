'use strict';

describe('ng-middle-click directive', function () {
  var scope, $compile, $rootScope, element;
  var clickValue = 1;
  var middleClickValue = 2;

  function compileHTML(template) {
    var elm;

    elm = angular.element(template);
    angular.element(document.body).prepend(elm);
    $compile(elm)(scope);
    scope.$digest();

    triggerMiddleClick(elm);
    scope.$digest();

    return elm;
  }

  function createScopeEvents(scope){
    scope.onClick = function($e){
      scope.value = clickValue;
    };
    spyOn(scope, 'onClick').and.callThrough();

    scope.onMiddleClick = function($e){
      scope.value = middleClickValue;
    };
    spyOn(scope, 'onMiddleClick').and.callThrough();
  }

  function triggerMiddleClick(element){
    // Implementing with 'auxclick' OR 'mousedown' to fire the event on
    // browsers like 'PhantomJS' which doesn't implement 'auxclick' event
    var event = ('onauxclick' in document.documentElement) ? 'auxclick' : 'mousedown';
    element.trigger({
      type: event,
      which: 2
    });
  }

  beforeEach(module('ng-middle-click'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;

    createScopeEvents(scope);
  }));

  afterEach(function () {
    if (element) element.remove();
  });

  describe('with ng-click', function(){
    it('should execute ng-click expression', function () {
      element = compileHTML('<a ng-click="onClick($event)" ng-middle-click>Link</a>');

      expect(element.text()).toContain('Link');
      expect(scope.onClick).toHaveBeenCalled();
      expect(scope.value).toBe(clickValue);
    });

    it('should execute it\'s own expression', function () {
      element = compileHTML('<a ng-click="onClick($event)" ng-middle-click="onMiddleClick($event)">Link</a>');

      expect(scope.onClick).not.toHaveBeenCalled();
      expect(scope.onMiddleClick).toHaveBeenCalled();
      expect(scope.value).toBe(middleClickValue);
    });

    it('when disabled shouldn\'t the expression', function () {
      scope.linkDisabled = true;
      element = compileHTML('<a ng-disabled="linkDisabled" ng-click="onClick($event)" ng-middle-click>Link</a>');

      expect(scope.onMiddleClick).not.toHaveBeenCalled();
      expect(scope.value).toBeUndefined();
    });
  });

  describe('without ng-click', function(){
    it('should execute it\'s own expression', function () {

      element = compileHTML('<a ng-middle-click="onMiddleClick($event)">Link</a>');

      expect(scope.onMiddleClick).toHaveBeenCalled();
      expect(scope.value).toBe(middleClickValue);
    });

    it('when disabled shouldn\'t the expression', function () {
      scope.linkDisabled = true;
      element = compileHTML('<a ng-disabled="linkDisabled" ng-middle-click="onMiddleClick($event)">Link</a>');

      expect(scope.onMiddleClick).not.toHaveBeenCalled();
      expect(scope.value).toBeUndefined();
    });
  });
});
