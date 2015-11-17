///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
///<reference path="../login/story.ts"/>
'use strict';
var astro;
angular.module('brainstormer.stories', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stories', {
    templateUrl: 'views/stories/stories.html',
    controller: 'StoriesCtrl'
  });
}])
.controller('StoriesCtrl', ['$scope','$location','$route','firebase', function($scope, $location, $rootScope, firebase) {
    var myDataRef = firebase.stories;
    var sessionID = firebase.sessionID;
    $scope.sessionID = sessionID;
    var stories = {};
    var myScope = $scope;
    $scope.lastVotedCard = null;
    $scope.showStats = false;
    $scope.googleauth = function(card: ServedStory) {
        if (card.sessionID === $scope.sessionID) {
            console.log("Proceeding to authenticate with Google");
            myDataRef.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    card.imageURL = authData.google.profileImageURL;
                    card.name = authData.google.displayName;
                    card.updateFn(card);
                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        }
    };

    $scope.addNewStory = function() {
        $location.path("/login");
        updateScope($scope);
    }

    $scope.sortedStories = function() {
        var answer = new Array();
        for (var i=0;i<$scope.tiles.length;i++) {
            var tile = $scope.tiles[i];
            answer.push(tile);
        }
        answer.sort(function(story1, story2) {
            return (story2.powerful*100-story1.powerful*100)+(story2.interesting-story1.interesting);
        })
        return answer;
    }
    $scope.tiles = [];
    var myScope = $scope;
    var updateFn: UpdateFunction = function(story: ServedStory) {
        var storyCardRef = new Firebase(firebase.storyURL + story.storyID);
        storyCardRef.set(story.toJSON());
    }
    var refreshFn: RefreshFunction = function(viewScope) {
        updateScope(viewScope);
    }
    myDataRef.on('child_added', function(snapshot) {
        var newStory = snapshot.val();
        if ("showStats" in newStory) {
            if (newStory.showStats === true) {
                console.log("Received command to show stats");
            } else {
                console.log("Received command to stop showing stats");
            }
            $scope.showStats = newStory.showStats;
            updateScope($scope);
        } else {
            var story:ServedStory = new ServedStory(newStory, firebase, sessionID, updateFn);
            stories[newStory.storyID] = newStory;
            $scope.tiles.push(story);
            console.log("Pushed " + newStory.name + ", " + newStory.text);
            if (newStory.sessionID !== $scope.sessionID) {
                updateScope($scope);
            }
        }
      });
    myDataRef.on('child_removed', function(snapshot) {
        var delStory = snapshot.val();
        var newTiles = new Array();
        for (var i=0;i<$scope.tiles.length;i++) {
            var tile = $scope.tiles[i];
            if (delStory.storyID !== tile.storyID) {
                newTiles.push(tile);
            }
        }
        $scope.tiles = newTiles;
        updateScope($scope);
    });
    myDataRef.on('child_changed', function(snapshot) {
        var newStory = snapshot.val();
        if ("showStats" in newStory) {
            console.log("Stats changed to: "+newStory.showStats);
            $scope.showStats = newStory.showStats;
        } else {
            var newServedStory = new ServedStory(newStory, firebase, sessionID, updateFn);
            newServedStory.findSelfAndUpdate($scope.tiles);
            console.log("Updated "+newStory.name+", summary: "+newStory.summary+", story: "+newStory.text);

        }
        updateScope($scope);
      });

}]);



