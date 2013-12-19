package dev.widgets;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.aviarc.core.dataset.DatasetFieldName;
import com.aviarc.core.dataset.DatasetStack;
import com.aviarc.core.datatype.AviarcBoolean;
import com.aviarc.framework.toronto.screen.CompiledWidget;
import com.aviarc.framework.toronto.screen.RenderedNode;
import com.aviarc.framework.toronto.screen.ScreenRenderingContext;
import com.aviarc.framework.toronto.util.CssUtils;
import com.aviarc.framework.toronto.widget.DefaultDefinitionFile;
import com.aviarc.framework.toronto.widget.DefaultRenderedNodeFactory;
import com.aviarc.framework.toronto.widget.DefaultRenderedWidgetImpl;
import com.aviarc.framework.xml.compilation.ResolvedElementContext;

public class Scene implements DefaultRenderedNodeFactory {

	private static final long serialVersionUID = 1L;
	private DefaultDefinitionFile _definition;

    public void initialize(DefaultDefinitionFile definitionFile) {
        this._definition = definitionFile;
    }
 
    public RenderedNode createRenderedNode(ResolvedElementContext<CompiledWidget> elementContext, ScreenRenderingContext renderingContext) {
        return new SceneImpl(elementContext, renderingContext, _definition);
    }
 
    public static class SceneImpl extends DefaultRenderedWidgetImpl {
    	
    	private String _baseClass;
    	private String _classList;
    	private String _visibleClass;
    	
        public SceneImpl(ResolvedElementContext<CompiledWidget> resolvedContext, ScreenRenderingContext renderingContext, DefaultDefinitionFile definition) {
            super(resolvedContext, renderingContext, definition);
            
            _baseClass = definition.getCssPrefix() + definition.getWidgetName();
            _classList = resolvedContext.hasAttribute("class") ? resolvedContext.getAttribute("class").getResolvedValue() : "";
            _visibleClass = AviarcBoolean.valueOf(resolvedContext.getAttribute("visible").getResolvedValue()).booleanValue() ? "" : " display-none";
        }
 
        @Override
        public Node createXHTML(XHTMLCreationContext context) {
            Element div = context.getCurrentDocument().createElement("DIV");
            div.setAttribute("id", String.format("%1$s:container", getAttributeValue("name")));
            div.setAttribute("class", CssUtils.makeClassString(_baseClass, _classList) + _visibleClass);
            
            Element canvas = context.getCurrentDocument().createElement("CANVAS");
            canvas.setAttribute("id", String.format("%1$s:canvas", getAttributeValue("name")));
            div.appendChild(canvas);
            
            Element content = context.getCurrentDocument().createElement("DIV");
            content.setAttribute("id", String.format("%1$s:content", getAttributeValue("name")));
            for(RenderedNode childNode : this.getChildren()){
            	content.appendChild(childNode.createXHTML(context));
            }
            div.appendChild(content);
            
            return div;
        }
    }
}
