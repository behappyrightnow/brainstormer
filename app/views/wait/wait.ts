///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
///<reference path="story.ts"/>
'use strict';
var astro;

angular.module('brainstormer.wait', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wait', {
    templateUrl: 'views/wait/wait.html',
    controller: 'WaitCtrl'
  });
}])
.controller('WaitCtrl', ['$scope','$location','$route','firebase', function($scope, $location, $rootScope, firebase) {
    var adminRef = firebase.admin;
    $scope.adminStatus = null;
    var onValueChange = adminRef.on('value', function(dataSnapshot) {
        console.log("Received admin event");
        $scope.adminStatus = dataSnapshot.val();
        if ($scope.adminStatus === null) {
            $scope.adminStatus = {
                locked: true,
                header: "Please wait..",
                message: "Please wait, this session hasn't started yet"
            };
        } else if ($scope.adminStatus.locked === false) {
            console.log("Unlocked");
            adminRef.off('value', onValueChange);
            $location.path("/login");
        }
        updateScope($scope);
    });
}]);

