/*global
YAHOO
*/

(function () {
    YAHOO.namespace("dev");
    var dev = YAHOO.dev;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    dev.Scene = function() {
        
        this.onLoad = new Toronto.client.Event("Scene onLoad");
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
            
            this.ranges = [];
            var ranges = this.getXMLContext().getAllSubElements().hasOwnProperty('range') ? this.getXMLContext().getAllSubElements().range : [];
            for(var i = 0;i < ranges.length;i++){
                this.ranges.push(new Range(ranges[i].getAttribute('name'), ranges[i].getAttribute('start'), ranges[i].getAttribute('end')));
            }

            this.threshold = parseInt(this.getAttribute('threshold'));
            this.current = 0;
        },

        bind: function (dataContext) {
            dev.Scene.superclass.bind.apply(this, arguments);
        },

        refresh: function () {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            this._loadFrames(this.path, this.framesCount);
        },
        
        bindDragListener: function(){
        
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
                    else if(self.current++ === self.threshold){
                        self.canvas.getContext("2d").drawImage(self.frames[(self.index += isMovingLeft ? -1 : 1)].canvas, 0, 0, window.innerWidth, window.innerHeight);
                        self.prevMoveEvent = event;
                        
                        for(var i = 0;i < self.ranges.length;i++){
                            var start = parseInt(self.ranges[i].getStart()) === self.index;
                            var end = parseInt(self.ranges[i].getEnd()) === self.index;
                            if(start || end){
                                self.onRange.fireEvent({
                                    'name': self.ranges[i].getName(),
                                    'inRange': start && !isMovingLeft || end && isMovingLeft
                                });
                            }
                        }
                        self.current = 0;
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
        },
        
        registerRange: function(name, start, end){
            this.ranges.push(new Range(name, start, end));
        }
    });
    
    function Range(name, start, end){
        this.name = name;
        this.start = start;
        this.end = end;
    }
    Range.prototype = {
        constructor: Range,
        
        getName: function(){
            return this.name;
        },
        
        getStart: function(){
            return this.start;
        },
        
        getEnd: function(){
            return this.end;
        }
    };
})();

