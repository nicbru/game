/*global
YAHOO
*/

(function () {
    YAHOO.namespace("game");
    var game = YAHOO.game;
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    game.GetNamespacedWidgetName = function () {
    };

    YAHOO.lang.extend(game.GetNamespacedWidgetName, Toronto.framework.DefaultActionImpl, {
        run: function (state) {
            
            var widgetName = this.getAttribute('widget', state);
            var namespaces = Toronto.internal.GlobalState.getWidgetTree().getAllNamespaceNames();
            
            for(var j = 0;j < namespaces.length;j++){

                var widgetNode = Toronto.findWidget(namespaces[j]+':'+widgetName);
                
                if(!YAHOO.lang.isNull(widgetNode) && !YAHOO.lang.isUndefined(widgetNode)){
                    state.getExecutionState().setReturnValue(widgetNode.getWidgetID());
                    // the first one we find
                    break;
                }
            }
        }
    });
})();
