/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.LandingMethod = function() {
        
    };

    YAHOO.lang.extend(game.LandingMethod, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            game.LandingMethod.superclass.startup.apply(this, arguments);
        },

        bind: function (dataContext) {
            game.LandingMethod.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            
        }
    });
})();
