///<reference path="lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var appURL = 'https://luminous-heat-1750.firebaseio.com/';
var storyURL = appURL + "stories/";
var adminURL = appURL + "admin/";
var logURL = adminURL + "log/";
angular.module('brainstormer', [
    'ngRoute',
    'brainstormer.logs',
    'brainstormer.wait',
    'brainstormer.login',
    'brainstormer.stories',
    'brainstormer.admin',
    'ui.bootstrap',
    'akoenig.deckgrid'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/wait' });
    }]).
    constant("firebase", {
    "appURL": appURL,
    "storyURL": storyURL,
    "app": new Firebase(appURL),
    "stories": new Firebase(storyURL),
    "log": new Firebase(logURL),
    "admin": new Firebase(adminURL),
    "sessionID": generateUUID(),
    "generateID": generateUUID,
    "username": "",
    "imageURL": "images/silhouette.png"
});
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return Date.now() + uuid;
}
function updateScope($scope) {
    if ($scope.$$phase !== "$apply" && $scope.$$phase !== "$digest") {
        $scope.$apply();
    }
}
//# sourceMappingURL=app.js.map