///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
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
            $scope.$apply();
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
                    tile.powerful = newStory.powerful;
                    tile.interesting = newStory.interesting;
                    tile.name = newStory.name;
                    tile.imageURL = newStory.imageURL;
                }
            }
            console.log("Updated " + newStory.name + ", summary: " + newStory.summary + ", story: " + newStory.story);
            if (newStory.sessionID !== $scope.sessionID) {
            }
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
        function updateCardVote(card) {
            var storyCardRef = new Firebase(firebase.appURL + card.storyID);
            var story = stories[card.storyID];
            story.interesting = card.interesting;
            story.powerful = card.powerful;
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