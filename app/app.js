///<reference path="lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var appURL = 'https://luminous-heat-1750.firebaseio.com/';
angular.module('brainstormer', [
    'ngRoute',
    'brainstormer.login',
    'brainstormer.stories',
    'ui.bootstrap',
    'akoenig.deckgrid'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/login' });
    }]).
    constant("firebase", {
    "appURL": appURL,
    "app": new Firebase(appURL),
    "sessionID": generateUUID(),
    "generateID": generateUUID,
    "imageURL": "http://bible.soulsurvivor.com/sites/all/themes/ss_bible/images/anonymous-user-gravatar.png"
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