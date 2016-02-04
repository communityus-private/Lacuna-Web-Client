'use strict';

var Reflux = require('reflux');

var ReactTooltip = require('react-tooltip');

var ChatActions = require('js/actions/menu/chat');
var MapActions = require('js/actions/menu/map');
var MenuActions = require('js/actions/menu');
var SessionActions = require('js/actions/session');
var StatusActions = require('js/actions/status');
var TickerActions = require('js/actions/ticker');
var UserActions = require('js/actions/user');
var WindowManagerActions = require('js/actions/menu/windowManager');

var server = require('js/server');

var UserStore = Reflux.createStore({
    listenables: UserActions,

    onSignIn: function() {
        MenuActions.show();
        TickerActions.start();
        ChatActions.show();

        console.log('Firing up the planet view');
        MapActions.changePlanet(YAHOO.lacuna.Game.EmpireData.home_planet_id);
    },

    onSignOut: function() {
        server.call({
            module: 'empire',
            method: 'logout',
            params: [],
            success: function() {
                // Here be the traditional code to reset the game...
                YAHOO.lacuna.Game.Reset();
                YAHOO.lacuna.MapPlanet.Reset();
                YAHOO.lacuna.Game.DoLogin();

                // Let the React stuff know what happened.
                SessionActions.clear();
                StatusActions.clear();
                MenuActions.hide();
                TickerActions.stop();
                ChatActions.hide();
                WindowManagerActions.hideAllWindows();

                // Hide all our tooltips
                ReactTooltip.hide();
            }
        });
    }
});

module.exports = UserStore;
