/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.LandingSite = function() {
        this.onBindDragListener = new Toronto.client.Event();
        this.onEndReached = new Toronto.client.Event();
        this.onChange = new Toronto.client.Event();
        this.onUpdate = new Toronto.client.Event();
    };

    YAHOO.lang.extend(game.LandingSite, Toronto.framework.DefaultTemplateWidgetImpl, {
        startup: function (widgetContext) {
            game.LandingSite.superclass.startup.apply(this, arguments);
        },

        bind: function (dataContext) {
            game.LandingSite.superclass.bind.apply(this, arguments);
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
        },
        
        bindDragListener: function(value1, value2, value3, value4){
        
            this.onBindDragListener.fireEvent({
                'value1': value1,
                'value2': value2,
                'value3': value3,
                'value4': value4
            });
        },
        
        endReached: function(value1, value2, value3, value4){
        
            this.onEndReached.fireEvent({
                'value1': value1,
                'value2': value2,
                'value3': value3,
                'value4': value4
            });
        }
    });
})();
