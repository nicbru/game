/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.EdgeDetectingContainer = function() {
        this.edgeDetected = new Toronto.client.Event();
    };

    YAHOO.lang.extend(game.EdgeDetectingContainer, Toronto.framework.DefaultTemplateWidgetImpl, {

        startup: function (widgetContext) {
            game.EdgeDetectingContainer.superclass.startup.apply(this, arguments);
            this.container = widgetContext.findWidget(this.getAttribute("name")+'-container');
        },

        bind: function (dataContext) {
            game.EdgeDetectingContainer.superclass.bind.apply(this, arguments);
            this.containerElement = this.container.getContainerElement();
        },

        refresh: function () {
        },
        
        update: function(left, top, isMovingLeft, isMovingUp){
        
            var containerLeft = this.containerElement.getBoundingClientRect().left;

            if((!parseBoolean(isMovingLeft) && containerLeft >= 0 && containerLeft <= 60) || (parseBoolean(isMovingLeft) && containerLeft <= 0 && containerLeft >= -60)){
            
                this.edgeDetected.fireEvent({
                    'left': containerLeft
                });
            }
        }
    });
})();
