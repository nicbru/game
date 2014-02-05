package game.xmlcommands;

import com.aviarc.core.dataset.Dataset;
import com.aviarc.core.runtimevalues.DatasetRuntimeValue;
import com.aviarc.core.runtimevalues.RuntimeValue;
import com.aviarc.core.state.State;
import com.aviarc.framework.xml.command.AbstractXMLCommand;

public class GetParentDatasetName extends AbstractXMLCommand {
    private static final long serialVersionUID = 0L;
    
    private RuntimeValue<Dataset> _dataset;

    @Override
    public void doInitialize(InitializationContext ctx) {
    	_dataset = new DatasetRuntimeValue(ctx.getElementContext().getAttribute("dataset").getRuntimeValue());
    }

    @Override
    public void run(State s) {
    	
    	Dataset dataset = _dataset.getValue(s);
    	Dataset parent = dataset.getParentDataset();
    	
    	if(parent != null){
    		s.getExecutionState().setReturnValue(parent.getName());
    	}
    }
}