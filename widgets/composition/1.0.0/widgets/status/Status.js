/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.Status = function() {
        this.onChange = new Toronto.client.Event();
        this.onUpdate = new Toronto.client.Event();
    };

    YAHOO.lang.extend(game.Status, Toronto.framework.DefaultTemplateWidgetImpl, {

        startup: function (widgetContext) {
            game.Status.superclass.startup.apply(this, arguments);
        },

        bind: function (dataContext) {
            game.Status.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            
        },
        
        change: function(value1, value2, value3, value4){
        
            this.onChange.fireEvent({
                'value1': value1,
                'value2': value2,
                'value3': value3,
                'value4': value4
            });
        },
        
        update: function(value1, value2, value3, value4){
        
            this.onUpdate.fireEvent({
                'value1': value1,
                'value2': value2,
                'value3': value3,
                'value4': value4
            });
        }
    });
})();
