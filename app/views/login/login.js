///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var astro;
//var firebaseApp = 'https://pn7jcaj0hcs.firebaseio-demo.com/';
var firebaseApp = 'https://luminous-heat-1750.firebaseio.com/';
angular.module('brainstormer.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        });
    }])
    .controller('LoginCtrl', ['$scope', '$location', '$route', function ($scope, $location, $rootScope) {
        var myDataRef = new Firebase(firebaseApp);
        $scope.votesLeft = 6;
        var sessionID = generateUUID();
        $scope.sessionID = sessionID;
        var stories = {};
        $scope.mode = "add";
        $scope.username = "";
        $scope.summary = "";
        $scope.story = "";
        $scope.storyID = "";
        $scope.votes = "";
        $scope.otherUser = "";
        $scope.card = null;
        $scope.googleauth = function () {
            myDataRef.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                }
                else {
                    console.log("Authenticated successfully with payload:", authData);
                }
            });
        };
        $scope.submitStory = function (username, summary, story) {
            console.log("Receieved " + username + ", " + story);
            var data = stories;
            var storyID = generateUUID();
            data[storyID] = {
                sessionID: sessionID,
                storyID: storyID,
                name: username,
                summary: summary,
                story: story,
                votes: 0
            };
            $scope.sessionID = sessionID;
            $scope.username = username;
            myDataRef.set(data);
            $scope.mode = "stop";
        };
        $scope.updateStory = function (username, summary, story) {
            console.log("Receieved " + username + ", " + story);
            var data = stories;
            var storyID = $scope.storyID;
            data[storyID] = {
                sessionID: sessionID,
                storyID: storyID,
                name: username,
                summary: summary,
                story: story,
                votes: $scope.votes
            };
            $scope.sessionID = sessionID;
            $scope.username = username;
            myDataRef.set(data);
            $scope.summary = "";
            $scope.story = "";
            $scope.mode = "stop";
        };
        $scope.addAnotherStory = function () {
            $scope.summary = "";
            $scope.story = "";
            $scope.mode = "add";
        };
        $scope.tiles = [];
        var myScope = $scope;
        myDataRef.on('child_added', function (snapshot) {
            var newStory = snapshot.val();
            newStory.voted = false;
            newStory.selected = false;
            stories[newStory.storyID] = {
                sessionID: newStory.sessionID,
                storyID: newStory.storyID,
                name: newStory.name,
                summary: newStory.summary,
                story: newStory.story,
                votes: newStory.votes
            };
            $scope.tiles.push(newStory);
            console.log("Pushed " + newStory.name + ", " + newStory.story);
            if (newStory.sessionID !== $scope.sessionID) {
                $scope.$apply();
            }
        });
        myDataRef.on('child_changed', function (snapshot) {
            var newStory = snapshot.val();
            for (var i = 0; i < $scope.tiles.length; i++) {
                var tile = $scope.tiles[i];
                if (tile.storyID === newStory.storyID) {
                    tile.summary = newStory.summary;
                    tile.story = newStory.story;
                }
            }
            console.log("Updated " + newStory.name + ", summary: " + newStory.summary + ", story: " + newStory.story);
            if (newStory.sessionID !== $scope.sessionID) {
                $scope.$apply();
            }
        });
        $scope.popover = function () {
            console.log("popup");
        };
        $scope.vote = function (card) {
            if (card.voted === true) {
                card.voted = false;
                $scope.votesLeft++;
                card.votes--;
                updateCardVote(card);
            }
            else if ($scope.votesLeft > 0) {
                if (card.votes === undefined) {
                    card.votes = 0;
                }
                card.votes++;
                card.voted = true;
                $scope.votesLeft--;
                updateCardVote(card);
                console.log("Voted for " + card.storyID);
            }
            $scope.select(card);
        };
        $scope.select = function (card) {
            console.log("Edit()");
            $scope.summary = card.summary;
            $scope.story = card.story;
            $scope.storyID = card.storyID;
            $scope.votes = card.votes;
            $scope.otherUser = card.name;
            $scope.username = card.name;
            card.selected = !card.selected;
            if (card.sessionID === $scope.sessionID) {
                console.log("Matched");
                $scope.mode = "edit";
            }
            else {
                $scope.mode = "focus";
                $scope.card = card;
            }
        };
        function updateCardVote(card) {
            var storyCardRef = new Firebase(firebaseApp + card.storyID);
            var story = stories[card.storyID];
            story.votes = card.votes;
            storyCardRef.set(story);
        }
    }]);
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
//# sourceMappingURL=login.js.map