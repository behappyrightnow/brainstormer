///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var astro;

angular.module('brainstormer.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });
}])
.controller('LoginCtrl', ['$scope','$location','$route','firebase', function($scope, $location, $rootScope, firebase) {
    var myDataRef = firebase.app;
    $scope.stories = {};
    $scope.storiesLoaded = false;
    $scope.googleauth = function() {
        myDataRef.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        });
    }
    $scope.submitStory = function(username, summary, story) {
        console.log("Receieved "+username+", "+story);
        var data = $scope.stories;
        var storyID = firebase.generateID();
        data[storyID] = {
                sessionID: firebase.sessionID,
                storyID: storyID,
                name: username,
                summary: summary,
                story: story,
                votes: 0
            };
        $scope.username = username;
        myDataRef.set(data);
        $location.path("/stories");
    }
    myDataRef.on('value', function(dataSnapshot) {
        $scope.stories = dataSnapshot.val();
        $scope.storiesLoaded = true;
        $scope.$apply();
    });


}]);

