import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Node;

import com.aviarc.core.dataset.Dataset;
import com.aviarc.core.dataset.NoSuchDatasetException;
import com.aviarc.core.util.StringUtils;
import com.aviarc.framework.toronto.screen.CompiledWidget;
import com.aviarc.framework.toronto.screen.RenderedNode;
import com.aviarc.framework.toronto.screen.ScreenRenderingContext;
import com.aviarc.framework.toronto.widget.DefaultDefinitionFile;
import com.aviarc.framework.toronto.widget.DefaultRenderedNodeFactory;
import com.aviarc.framework.toronto.widget.DefaultRenderedWidgetImpl;
import com.aviarc.framework.xml.compilation.ResolvedElementAttribute;
import com.aviarc.framework.xml.compilation.ResolvedElementContext;
 
public class If implements DefaultRenderedNodeFactory {   
    private DefaultDefinitionFile _definition;
    
    private static final long serialVersionUID = 0L;
 
    /*
     * (non-Javadoc)
     * @see com.aviarc.framework.toronto.widget.DefaultRenderedNodeFactory#initialize(com.aviarc.framework.toronto.widget.DefaultDefinitionFile)
     */
    public void initialize(DefaultDefinitionFile definitionFile) {
        // Store the definition - our rendered node class requires it as it derives from DefaultRenderedNodeImpl
        this._definition = definitionFile;
    }
    
    public class ChildFreeRenderedNode extends DefaultRenderedWidgetImpl implements RenderedNode {
        
        public ChildFreeRenderedNode(final ResolvedElementContext<CompiledWidget> resolvedContext,
                                    final ScreenRenderingContext renderingContext, 
                                    final DefaultDefinitionFile definition) {
            super(resolvedContext, renderingContext, definition, false);
            
        }
        
        // Condition is false, don't provide any of this widgets children to the framework
        // This method is used by the framework to get any of the children's required datasets and JS
        public List<RenderedNode> getChildren() {
            return new ArrayList<RenderedNode>();
        }
    
        // Condition is false, don't render any of this widgets children
        public Node createXHTML(XHTMLCreationContext context) {
            return context.getCurrentDocument().createDocumentFragment();
        }
    }
    
    public class FamilyRenderedNode extends DefaultRenderedWidgetImpl implements RenderedNode {
        
        public FamilyRenderedNode(final ResolvedElementContext<CompiledWidget> resolvedContext,
                                  final ScreenRenderingContext renderingContext, 
                                  final DefaultDefinitionFile definition) {
            super(resolvedContext, renderingContext, definition, true);
            
        }
    
        // Condition is true, recursively render all of this widgets children, inside a 
        // doc fragment ( no need to wrap another div around it )
        public Node createXHTML(XHTMLCreationContext context) {
            Node frag = context.getCurrentDocument().createDocumentFragment();
            
            Node child;
            for (RenderedNode node : getChildren()) {
                child = node.createXHTML(context);
                if (child != null) {
                    frag.appendChild(child);
                }
            }
            return frag;
        }
    }
 
    /*
     * (non-Javadoc)
     * @see com.aviarc.framework.toronto.widget.RenderedNodeFactory#createRenderedNode(com.aviarc.framework.xml.compilation.ResolvedElementContext, com.aviarc.framework.toronto.screen.ScreenRenderingContext)
     */
    public RenderedNode createRenderedNode(ResolvedElementContext<CompiledWidget> elementContext, ScreenRenderingContext renderingContext) {
    	
    	String test = elementContext.getAttribute("test").getResolvedValue();
    	String value1 = elementContext.getAttribute("value1").getResolvedValue();
    	String value2 = elementContext.getAttribute("value2").getResolvedValue();
    	//ResolvedElementAttribute rConvert = elementContext.getAttribute("convert");
    	//String convert = "";
    	//if (rConvert != null) {
    	//	convert = rConvert.getResolvedValue();
    	//}
       
    	boolean render = false;
    	Dataset ds;
    	
    	switch (Tests.value(test)) {
	    	case EQUALS:
	    		render = StringUtils.equal(value1, value2); 
	    		break;
	    	case NOTEQUALS:
	    		render = !StringUtils.equal(value1, value2);
	    		break;
	    	case DATASETEXISTS:
	    		/*Dodgy expection handling...*/
	    		try {
	    			ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
	    			render = true;
	    		} catch (NoSuchDatasetException e) {
	    			render = false;
	    		}
	    		
	    		break;
	    	case NOTDATASETEXISTS:
	    		/*Dodgy expection handling...*/
	    		try {
	    			ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
	    			render = false;
	    		} catch (NoSuchDatasetException e) {
	    			render = true;
	    		}
	    		break;
	    	case DATASETEMPTY:
	    		ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
	    		render = ds.getRowCount() == 0;
	    		break;
	    	case NOTDATASETEMPTY:
	    		ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
	    		render = ds.getRowCount() != 0;
	    		break;
            case DATASETINDEXEQUALS:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getCurrentRowIndex() == Integer.parseInt(value2);
                break;
            case DATASETINDEXNOTEQUALS:    
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getCurrentRowIndex() != Integer.parseInt(value2);
                break;
            case DATASETINDEXLESSTHAN:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getCurrentRowIndex() < Integer.parseInt(value2);
                break;
            case DATASETINDEXGREATERTHAN:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getCurrentRowIndex() > Integer.parseInt(value2);
                break;
            case DATASETNOTLASTROW:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getCurrentRowIndex() < (ds.getRowCount()-1);
                break;
            case DATASETROWCOUNTGREATERTHAN:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getRowCount() > Integer.parseInt(value2);
                break;
            case DATASETROWCOUNTLESSTHAN:
            	ds = renderingContext.getCurrentState().getApplicationState().getDatasetStack().findDataset(value1);
            	render = ds.getRowCount() < Integer.parseInt(value2);
                break;
	    	case LESSTHAN:
	    		break;
	    	case GREATERTHAN:
	    		break;
    	}
    	
        if (render) {
            return new FamilyRenderedNode(elementContext, renderingContext, _definition);
        }
        return new ChildFreeRenderedNode(elementContext, renderingContext, _definition);
    }
    
    public enum Tests {
    	EQUALS ("equals"),
    	NOTEQUALS ("not-equals"),
    	DATASETEXISTS ("dataset-exists"),
    	NOTDATASETEXISTS ("not-dataset-exists"),
    	DATASETEMPTY ("dataset-empty"),
    	NOTDATASETEMPTY ("not-dataset-empty"),
        DATASETINDEXEQUALS ("dataset-index-equals"),
        DATASETINDEXNOTEQUALS ("dataset-index-not-equals"),
        DATASETINDEXLESSTHAN ("dataset-index-less-than"),
        DATASETINDEXGREATERTHAN ("dataset-index-greater-than"),
        DATASETNOTLASTROW ("dataset-not-last-row"),
        DATASETROWCOUNTGREATERTHAN ("dataset-row-count-greater-than"),
        DATASETROWCOUNTLESSTHAN ("dataset-row-count-less-than"),
    	LESSTHAN ("less-than"),
    	GREATERTHAN ("greater-than");
    	
    	Tests(String name) {
    		this.name = name;
    	}
    	
    	private final String name;
    	
    	private static Tests value(String test) {
    		for (Tests t: Tests.values()) {
    			if (t.name.equals(test)){
    				return t;
    			}
    		}
    		return Tests.EQUALS;
    	}
    }
 
    
}

