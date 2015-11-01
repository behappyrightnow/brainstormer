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
        var myDataRef = new Firebase('https://pn7jcaj0hcs.firebaseio-demo.com/');
        $scope.submitStory = function (username, story) {
            console.log("Receieved " + username + ", " + story);
            myDataRef.push({ name: username, story: story });
        };
        $scope.tiles = [];
        var myScope = $scope;
        myDataRef.on('child_added', function (snapshot) {
            var newStory = snapshot.val();
            newStory.flipped = false;
            $scope.tiles.push(newStory);
            console.log("Pushed " + newStory.name + ", " + newStory.story);
            $scope.$apply();
        });
        $scope.popover = function () {
            console.log("popup");
        };
    }]);
//# sourceMappingURL=login.js.map