/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.NavigationSystem = function() {
        
    };

    YAHOO.lang.extend(game.NavigationSystem, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            game.NavigationSystem.superclass.startup.apply(this, arguments);
        },

        bind: function (dataContext) {
            game.NavigationSystem.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            
        }
    });
})();
