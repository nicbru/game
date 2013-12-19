/*global
YAHOO
*/

(function () {
    YAHOO.namespace("dev");
    var dev = YAHOO.dev;
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    
    var $ = YAHOO.JQUERY_2_0_3_application;

    dev.Kinetic = function() {
        this.onMove = new Toronto.client.Event("Kinetic onMove");
    };

    YAHOO.lang.extend(dev.Kinetic, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            dev.Kinetic.superclass.startup.apply(this, arguments);
            
            this.container = this.getContainerElement();
            this.xAxis = parseBoolean(this.getAttribute('x-axis'));
            this.yAxis = parseBoolean(this.getAttribute('y-axis'));
            
            $.kinetic.callMethods.update = function(settings, options){
                for(var p in options){
                    if(settings.hasOwnProperty(p)){
                        settings[p] = options[p];
                    }
                }
            };
        },

        bind: function (dataContext) {
            dev.Kinetic.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            var self = this;
            $(this.container).kinetic({
                'x': this.xAxis,
                'y': this.yAxis,
                'moved': function(event){
                    if(self.xAxis || self.yAxis){
                        self.onMove.fireEvent({
                            'left': event.scrollLeft,
                            'top': event.scrollTop,
                            'isMovingLeft': $(self.container).hasClass('kinetic-moving-left') || $(self.container).hasClass('kinetic-decelerating-left'),
                            'isMovingUp': $(self.container).hasClass('kinetic-moving-up') || $(self.container).hasClass('kinetic-decelerating-up')
                        });
                    }
                }
            });
        },
        
        adjustScrollLeft: function(adjustment){
            $(this.container).stop().animate({scrollLeft: (this.container.scrollLeft + parseInt(adjustment))}, 200);
        },
        
        setX: function(x){
            this.xAxis = parseBoolean(x);
            $(this.container).kinetic('update', {'x': this.xAxis});
        },
        
        setY: function(y){
            this.yAxis = parseBoolean(y);
            $(this.container).kinetic('update', {'y': this.yAxis});
        }
    });
})();

