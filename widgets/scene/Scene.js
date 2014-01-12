/*global
YAHOO
*/

(function () {
    YAHOO.namespace("dev");
    var dev = YAHOO.dev;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    dev.Scene = function() {
        
        this.onLoad = new Toronto.client.Event("Scene onLoad");
        this.inShot = new Toronto.client.Event("Scene inShot");
        this.onEndReached = new Toronto.client.Event("Scene onEndReached");
        this.onRange = new Toronto.client.Event("Scene onRange");
    
        this.frames = [];
        this.index = 0;
    };

    YAHOO.lang.extend(dev.Scene, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            dev.Scene.superclass.startup.apply(this, arguments);
            
            this.container = this.getContainerElement();
            this.canvas = this.getNamedElement('canvas');
            this.content = this.getNamedElement('content');
            
            this.path = this.getAttribute('path');
            this.extension = this.getAttribute('extension');
            this.framesCount = parseInt(this.getAttribute('frames'));
            this.ranges = this.getXMLContext().getAllSubElements().hasOwnProperty('range') ? this.getXMLContext().getAllSubElements().range : [];
        },

        bind: function (dataContext) {
            dev.Scene.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            this._loadFrames(this.path, this.framesCount);
            if(this.container.getBoundingClientRect().left === 0){
                this.inShot.fireEvent({
                    'left': 0
                });
                this._bindDragListener();
            }
        },
        
        update: function(isMovingLeft){
        
            var left = this.container.getBoundingClientRect().left;

            if((!parseBoolean(isMovingLeft) && left >= 0 && left <= 60) || (parseBoolean(isMovingLeft) && left <= 0 && left >= -60)){
                this.inShot.fireEvent({
                    'left': left
                });
                this._bindDragListener();
            }
        },
        
        _bindDragListener: function(){
        
            var self = this;

            this.container.addEventListener('mousedown', function mousedownHandler(event){

                self.prevMoveEvent = event;

                function mousemoveHandler(event){

                    var isMovingLeft = (self.prevMoveEvent.pageX - event.pageX) < 0;
                    if(isMovingLeft && self.index === 0 || !isMovingLeft && self.index === self.frames.length-1){
                        if(self.prevMoveEvent.type === 'mousedown'){
                            self.container.removeEventListener('mousedown', mousedownHandler, false);
                            self.onEndReached.fireEvent();
                            YAHOO.util.Dom.removeClass(self.container, 'active');
                        }
                        self.container.removeEventListener('mousemove', mousemoveHandler, false);
                    }
                    else{
                        self.canvas.getContext("2d").drawImage(self.frames[(self.index += isMovingLeft ? -1 : 1)].canvas, 0, 0, window.innerWidth, window.innerHeight);
                        self.prevMoveEvent = event;
                        
                        for(var i = 0;i < self.ranges.length;i++){
                            var start = parseInt(self.ranges[i].getAttribute('start')) === self.index;
                            var end = parseInt(self.ranges[i].getAttribute('end')) === self.index;
                            if(start || end){
                                self.onRange.fireEvent({
                                    'name': self.ranges[i].getAttribute('name'),
                                    'inRange': start && !isMovingLeft || end && isMovingLeft
                                });
                            }
                        }
                    }
                }

                self.container.addEventListener('mousemove', mousemoveHandler, false);

                self.container.addEventListener('mouseup', function mouseupHandler(){
                    self.container.style.backgroundImage = 'url(' + self.frames[self.index].src + ')';
                    self.container.removeEventListener('mousemove', mousemoveHandler, false);
                    self.container.removeEventListener('mouseup', mouseupHandler, false);
                }, false);
            }, false);
            YAHOO.util.Dom.addClass(self.container, 'active');
        },
        
        _loadFrames: function(path, framesCount){
        
            path = path.replace(/\/?$/, '/');
            var self = this;
            
            (function load(i){
                var num = '000'.substring(0, '000'.length - (i+'').length) + i;

                var frame = new Image();
                frame.src = path+num+'.'+self.extension;
                var buffer = document.createElement('canvas');
                buffer.width = window.innerWidth;
                buffer.height = window.innerHeight;

                frame.addEventListener('load', function(){

                    buffer.getContext("2d").drawImage(frame, 0, 0, window.innerWidth, window.innerHeight);
                    self.frames.push({'canvas':buffer, 'src': frame.src});

                    if(i < framesCount){
                        load(++i);
                    }
                    else{
                        self.container.style.backgroundSize = '100% 100%';
                        self.container.style.backgroundImage = 'url(' + self.frames[self.index].src + ')';
                        self.onLoad.fireEvent();
                    }
                }, false);
            })(0);
        }
    });
})();

