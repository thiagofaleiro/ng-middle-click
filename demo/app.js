(function() {
  'use strict';

  var app = angular.module('demo', []);

  app.controller('Main', ['$scope', function($scope) {
    $scope.onClick = function($e){
      var url = $e.target.dataset.href;
      $e.target.href = url + '/search?q=' + $scope.searchQuery;
    };
  }]);
}());
