///<reference path="lib/vendorTypeDefinitions/angular.d.ts"/>

'use strict';
angular.module('brainstormer', [
        'ngRoute',
        'brainstormer.login',
        'brainstormer.stories',
        'ui.bootstrap',
        'akoenig.deckgrid'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo:'/login'});
    }]);