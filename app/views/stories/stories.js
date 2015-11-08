///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
///<reference path="../../app.ts"/>
'use strict';
var astro;
angular.module('brainstormer.stories', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/stories', {
            templateUrl: 'views/stories/stories.html',
            controller: 'StoriesCtrl'
        });
    }])
    .controller('StoriesCtrl', ['$scope', '$location', '$route', 'firebase', function ($scope, $location, $rootScope, firebase) {
        var myDataRef = firebase.app;
        var sessionID = firebase.sessionID;
        $scope.sessionID = sessionID;
        var stories = {};
        var myScope = $scope;
        $scope.lastVotedCard = null;
        $scope.googleauth = function (card) {
            console.log("Proceeding to authenticate with Google");
            myDataRef.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                }
                else {
                    console.log("Authenticated successfully with payload:", authData);
                    card.imageURL = authData.google.profileImageURL;
                    $scope.updateStory(card);
                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        };
        $scope.updateStory = function (card) {
            card.mode = "updated";
            var data = stories;
            var storyID = card.storyID;
            data[storyID] = {
                sessionID: sessionID,
                storyID: storyID,
                name: card.name,
                summary: card.summary,
                story: card.story,
                interesting: card.interesting,
                powerful: card.powerful,
                imageURL: card.imageURL
            };
            myDataRef.set(data);
            $scope.$apply();
        };
        $scope.addNewStory = function () {
            $location.path("/login");
            updateScope($scope);
        };
        $scope.tiles = [];
        var myScope = $scope;
        myDataRef.on('child_added', function (snapshot) {
            var newStory = snapshot.val();
            newStory.interestingSelected = false;
            newStory.powerfulSelected = false;
            newStory.selected = false;
            stories[newStory.storyID] = {
                sessionID: newStory.sessionID,
                storyID: newStory.storyID,
                name: newStory.name,
                summary: newStory.summary,
                story: newStory.story,
                interesting: newStory.interesting,
                powerful: newStory.powerful,
                interestingSelected: newStory.interestingSelected,
                powerfulSelected: newStory.powerfulSelected,
                imageURL: newStory.imageURL,
                mode: "add"
            };
            $scope.tiles.push(newStory);
            console.log("Pushed " + newStory.name + ", " + newStory.story);
            if (newStory.sessionID !== $scope.sessionID) {
                updateScope($scope);
            }
        });
        myDataRef.on('child_removed', function (snapshot) {
            var delStory = snapshot.val();
            var newTiles = new Array();
            for (var i = 0; i < $scope.tiles.length; i++) {
                var tile = $scope.tiles[i];
                if (delStory.storyID !== tile.storyID) {
                    newTiles.push(tile);
                }
            }
            $scope.tiles = newTiles;
            updateScope($scope);
        });
        myDataRef.on('child_changed', function (snapshot) {
            var newStory = snapshot.val();
            if ($scope.lastVotedCard !== null && $scope.lastVotedCard.storyID === newStory.storyID) {
                if ($scope.lastVotedCard.interesting === newStory.interesting &&
                    $scope.lastVotedCard.powerful === newStory.powerful) {
                    return;
                }
            }
            for (var i = 0; i < $scope.tiles.length; i++) {
                var tile = $scope.tiles[i];
                if (tile.storyID === newStory.storyID) {
                    tile.summary = newStory.summary;
                    tile.story = newStory.story;
                    tile.powerful = newStory.powerful;
                    tile.interesting = newStory.interesting;
                    tile.name = newStory.name;
                    tile.imageURL = newStory.imageURL;
                }
            }
            console.log("Updated " + newStory.name + ", summary: " + newStory.summary + ", story: " + newStory.story);
            updateScope($scope);
        });
        $scope.popover = function () {
            console.log("popup");
        };
        $scope.makeInteresting = function (card) {
            card.interestingSelected = !card.interestingSelected;
            if (card.interestingSelected) {
                card.interesting++;
            }
            else {
                card.interesting--;
            }
            if (card.powerfulSelected === true) {
                card.powerfulSelected = false;
                card.powerful--;
            }
            console.log("makeInteresting(): interesting: " + card.interesting + ", powerful: " + card.powerful);
            updateCardVote(card);
        };
        $scope.makePowerful = function (card) {
            card.powerfulSelected = !card.powerfulSelected;
            if (card.powerfulSelected) {
                card.powerful++;
            }
            else {
                card.powerful--;
            }
            if (card.interestingSelected === true) {
                card.interestingSelected = false;
                card.interesting--;
            }
            console.log("makePowerful(): interesting: " + card.interesting + ", powerful: " + card.powerful);
            updateCardVote(card);
        };
        $scope.select = function (card) {
            if (card.mode === "edit") {
                return;
            }
            console.log("Edit()");
            card.selected = !card.selected;
            if (card.sessionID === $scope.sessionID && card.mode !== "updated") {
                console.log("Matched");
                card.mode = "edit";
            }
            else {
                card.mode = "focus";
                $scope.card = card;
            }
        };
        $scope.photoClicked = function (card) {
            console.log("Clicked photo on card " + card.name);
            if (card.sessionID === $scope.sessionID) {
                card.mode = "changeImage";
            }
        };
        function updateCardVote(card) {
            var storyCardRef = new Firebase(firebase.appURL + card.storyID);
            var story = stories[card.storyID];
            story.interesting = card.interesting;
            story.powerful = card.powerful;
            $scope.lastVotedCard = card;
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
//# sourceMappingURL=stories.js.map