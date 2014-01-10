/*global
YAHOO
*/

(function () {
    YAHOO.namespace("dev");
    var dev = YAHOO.dev;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    dev.SceneManager = function() {
        
    };

    YAHOO.lang.extend(dev.SceneManager, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            dev.SceneManager.superclass.startup.apply(this, arguments);
            
            this._name = this.getAttribute("name");
            this.kinetic = widgetContext.findWidget(this._name + '-kinetic');
            this.scenes = this.kinetic.getChildWidgets();
        },

        bind: function (dataContext) {
            dev.SceneManager.superclass.bind.apply(this, arguments);
            
            this.kinetic.getWidget()['onMove'].bindHandler(function(eventParameters){
                for(var i = 0;i < this.scenes.length;i++){
                    if(this.scenes[i].hasOwnProperty('update')){
                        this.scenes[i].update(eventParameters.isMovingLeft);
                    }
                }
            }, this);
        
            for(var j = this.scenes.length-1;j >= 0;j--){

                if(this.scenes[j].hasOwnProperty('inShot')){
                    this.scenes[j].getWidget()['inShot'].bindHandler(function(eventParameters){
                        this.kinetic.setX('n');
                        this.kinetic.adjustScrollLeft(eventParameters.left);
                    }, this);
                }
                
                if(this.scenes[j].hasOwnProperty('onEndReached')){
                    this.scenes[j].getWidget()['onEndReached'].bindHandler(function(eventParameters){
                        this.kinetic.setX('y');
                    }, this);
                }
            }
        },

        refresh: function () {
        },
        
        setContentElements: function(contentArr){
            this.contentArr = contentArr;
        },
        
        getContentElements: function(){
            return this.contentArr;
        }
    });
})();
