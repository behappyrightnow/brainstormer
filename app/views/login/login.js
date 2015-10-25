///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var astro;
angular.module('brainstormer.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        });
    }])
    .controller('LoginCtrl', ['$scope', '$location', '$route', function ($scope, $location, $rootScope) {
        $scope.submitStory = function (username, story) {
            console.log("Receieved " + username + ", " + story);
            var myDataRef = new Firebase('https://pn7jcaj0hcs.firebaseio-demo.com/');
            myDataRef.push({ name: username, story: story });
            $scope.showAllStories();
        };
        $scope.showAllStories = function () {
            $location.path("/stories");
        };
    }]);
//# sourceMappingURL=login.js.map