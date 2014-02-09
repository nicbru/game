package qmuportal.xmlcommands;

import java.util.UUID;

import com.aviarc.core.state.State;
import com.aviarc.framework.xml.command.AbstractXMLCommand;

public class GenerateUuid extends AbstractXMLCommand {
    private static final long serialVersionUID = 0L;
    
    public GenerateUuid() {}

    @Override
    public void doInitialize(InitializationContext ctx) {}

    @Override
    public void run(State s) {
        String uuid = UUID.randomUUID().toString();
        s.getExecutionState().setReturnValue(uuid);
    }
}
