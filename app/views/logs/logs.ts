///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
'use strict';
var astro;

angular.module('brainstormer.logs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/logs', {
    templateUrl: 'views/logs/logs.html',
    controller: 'LogsCtrl'
  });
}])
.controller('LogsCtrl', ['$scope','$location','$route','firebase', function($scope, $location, $rootScope, firebase) {
    var logRef = firebase.log;
    $scope.logs = [];
    logRef.on('value', function(snapshot) {
        var log = snapshot.val();
        $scope.logs.push(log);
        updateScope($scope);
    });
    logRef.on('child_changed', function(snapshot) {
        var log = snapshot.val();
        $scope.logs.push(log);
        updateScope($scope);
    });
}]);