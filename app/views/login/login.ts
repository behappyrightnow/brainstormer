///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
///<reference path="story.ts"/>
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
    var myDataRef = firebase.stories;
    $scope.stories = {};
    $scope.imageURL = firebase.imageURL;
    $scope.username = firebase.username;
    $scope.summary = "";
    $scope.story = "";

    $scope.googleauth = function() {
        console.log("Proceeding to authenticate with Google");
        myDataRef.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            firebase.imageURL = authData.google.profileImageURL;
            $scope.imageURL = firebase.imageURL;
            $scope.username = authData.google.displayName;
            console.log("firebase.imageURL = "+ firebase.imageURL);
            updateScope($scope);
          }
        }, {
          remember: "sessionOnly",
          scope: "email"
        });
    }
    //var onValueChange = myDataRef.on('value', function(dataSnapshot) {
    //    console.log("Received submit story screen event");
    //    $scope.stories = dataSnapshot.val();
    //    if ($scope.stories === null) {
    //        $scope.stories = [];
    //    }
    //    $scope.storiesLoaded = true;
    //    updateScope($scope);
    //});
    $scope.submitStory = function(username, summary, text) {
        var story:Story = new Story(username, summary, text, firebase);
        console.log("Receieved "+username+", "+text);
        var newStoryRef = new Firebase(firebase.storyURL+story.storyID);
        firebase.username = username;
        $scope.username = firebase.username;
        newStoryRef.set(story);
        $location.path("/stories");
    }

    $scope.cancel = function() {
        $location.path("/stories");
    }



}]);

