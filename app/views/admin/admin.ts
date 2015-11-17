///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
'use strict';
var astro;

angular.module('brainstormer.admin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/admin.html',
    controller: 'AdminCtrl'
  });
}])
.controller('AdminCtrl', ['$scope','$location','$route','firebase', function($scope, $location, $rootScope, firebase) {
    var adminDataRef = firebase.admin;
    var storyDataRef = firebase.stories;
    $scope.stories = new Array();
    $scope.adminStatus = null;
    $scope.commandStory = {action: "hideStats"};
    var storyDict = {};
    function submitData(logMessage: string) {
        $scope.adminStatus.log = new Date().toUTCString() + ": "+logMessage;
        adminDataRef.set($scope.adminStatus);
    }

    adminDataRef.on('value', function(dataSnapshot) {
        $scope.adminStatus = dataSnapshot.val();
        if ($scope.adminStatus === null) {
            $scope.adminStatus = {
                locked: true,
                header: "Please wait..",
                message: "Please wait, this session hasn't started yet"
            };
            submitData("Set initial admin object");
        }

    });
    $scope.lockBoard = function() {
        $scope.adminStatus.locked = true;
        submitData("Locked board");
    };

    $scope.unlockBoard = function() {
        $scope.adminStatus.locked = false;
        submitData("Unlocked board");
    };

    $scope.updateHeaderAndMessage = function() {
        submitData("Updated header ("+$scope.adminStatus.header+") and message ("+$scope.adminStatus.message+")");
    };
    $scope.showStats = function() {
        $scope.commandStory= {action: "showStats"};
        console.log("Setting action to: "+$scope.commandStory.action);
        firebase.stats.set($scope.commandStory);
    }
    $scope.hideStats = function() {
        $scope.commandStory = {action: "hideStats"};
        console.log("Setting action to: "+$scope.commandStory.action);
        firebase.stats.set($scope.commandStory);
    }

    $scope.iFrame = function() {
        $scope.commandStory.action = "iFrame";
        $scope.commandStory.url = $scope.url;
        console.log("Setting action to: "+$scope.commandStory.action);
        firebase.stats.set($scope.commandStory);
    }
    $scope.page = function() {
        $scope.commandStory.action = "page";
        $scope.commandStory.url = $scope.url;
        console.log("Setting action to: "+$scope.commandStory.action);
        firebase.stats.set($scope.commandStory);
    }
    storyDataRef.on('child_added', function(snapshot) {
        var newStory = snapshot.val();
        if ("action" in newStory) {
            $scope.commandStory = newStory;
            console.log("Received commandStory: "+newStory.action);
        } else {
            $scope.stories.push(newStory);
            storyDict[newStory.storyID] = newStory;
            updateScope($scope);
        }
    });
    $scope.sortedStories = function() {
        return sortedStories($scope.stories);
    }
    storyDataRef.on('child_changed', function(snapshot) {
        var newStory = snapshot.val();
        if ("action" in newStory) {
            $scope.commandStory = newStory;
        } else {
            for (var i=0;i<$scope.stories.length;i++) {
                var story = $scope.stories[i];
                if (story.storyID === newStory.storyID) {
                    story.summary = newStory.summary;
                    story.story = newStory.story;
                    story.powerful = newStory.powerful;
                    story.interesting = newStory.interesting;
                    story.name = newStory.name;
                    story.imageURL = newStory.imageURL;
                    story.deleteMode = false;
                }
            }
            console.log("Updated "+newStory.name+", summary: "+newStory.summary+", story: "+newStory.story);
        }
        updateScope($scope);
      });
      $scope.delete = function(card) {
          card.deleteMode = true;
      }
      $scope.actuallyDelete = function(card) {
            var storyToDelete = null;
            var storyIndex = -1;
            for (var i=0;i<$scope.stories.length;i++) {
                var story = $scope.stories[i];
                if (story.storyID === card.storyID) {
                    storyToDelete = story;
                    storyIndex = i;
                    break;
                }
            }
            if (storyToDelete !== null) {
                var storyRef = new Firebase(firebase.storyURL+storyToDelete.storyID);
                storyRef.remove(function(error) {
                    if (error) {
                        console.log('Remove failed');
                    } else {
                        console.log('Remove succeeded');
                        card.deleteMode = false;
                        $scope.stories.splice(storyIndex,1);
                        updateScope($scope);
                    }
                });
            }
      }
}]);