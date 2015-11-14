///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
'use strict';
var astro;
angular.module('brainstormer.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        });
    }])
    .controller('LoginCtrl', ['$scope', '$location', '$route', 'firebase', function ($scope, $location, $rootScope, firebase) {
        var myDataRef = firebase.stories;
        $scope.stories = {};
        $scope.storiesLoaded = false;
        $scope.imageURL = firebase.imageURL;
        $scope.username = firebase.username;
        $scope.summary = "";
        $scope.story = "";
        $scope.googleauth = function () {
            console.log("Proceeding to authenticate with Google");
            myDataRef.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                }
                else {
                    console.log("Authenticated successfully with payload:", authData);
                    firebase.imageURL = authData.google.profileImageURL;
                    $scope.imageURL = firebase.imageURL;
                    $scope.username = authData.google.displayName;
                    console.log("firebase.imageURL = " + firebase.imageURL);
                    updateScope($scope);
                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        };
        $scope.submitStory = function (username, summary, story) {
            console.log("Receieved " + username + ", " + story);
            var data = $scope.stories;
            var storyID = firebase.generateID();
            data[storyID] = {
                sessionID: firebase.sessionID,
                storyID: storyID,
                name: username,
                summary: summary,
                story: story,
                interesting: 0,
                powerful: 0,
                imageURL: firebase.imageURL
            };
            firebase.username = username;
            $scope.username = firebase.username;
            myDataRef.set(data);
            $location.path("/stories");
        };
        //for (var i=0;i<20;i++) {
        //        var millisecondsToWait = 500;
        //        setTimeout(function(num) {
        //            $scope.submitStory("someone"+num,"something","here's a nice story");
        //        }, millisecondsToWait*i,i);
        //    }
        $scope.cancel = function () {
            $location.path("/stories");
        };
        myDataRef.on('value', function (dataSnapshot) {
            $scope.stories = dataSnapshot.val();
            if ($scope.stories === null) {
                $scope.stories = [];
            }
            $scope.storiesLoaded = true;
            updateScope($scope);
        });
    }]);
//# sourceMappingURL=login.js.map