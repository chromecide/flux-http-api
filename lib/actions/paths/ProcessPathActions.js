

function ProcessPathActions(ctx, cbs){
    var pathPipes = [];
    
    for(var i=0;i<ctx.paths.length;i++){
        var actionList = [];
        if(ctx.paths[i].path_actions){
            for(j=0;j<ctx.paths[i].path_actions.length;j++){
                if(ctx.paths[i].path_actions[j].action_name){
                    actionList.push(ctx.paths[i].path_actions[j].action_name);
                }
            }
        }
        pathPipes.push(compilePipe(ctx, actionList));
    }

    processAndWaitForAll(ctx, pathPipes, {
        success: function(retCtx){
            if(cbs && cbs.success){
                cbs.success(ctx);
            }
        },
        error: function(err){
            if(cbs && cbs.error){
                cbs.error(err);
            }
        }
    });

    if(cbs && cbs.success){
        cbs.success(ctx);
    }
}

    function compilePipe(ctx, actionList, cbs){
        var newPipe = new ctx._fp.pipe();
        for(var i=0;i<actionList.length;i++){
            var nextAction = actionList[i];
            if((typeof nextAction)=='string'){
                newPipe.use(nextAction);
            }else{
                newPipe.use(nextAction.fn, nextAction.cfg);
            }
        }

        return newPipe;
    }

    function processAndWaitForAll(ctx, pipes, cbs){

        var numLaunched = pipes.length;
        var numReturned = 0;
        var errors = [];

        function successReturn(retCtx){
            numReturned++;
            if(numReturned==numLaunched){
                if(cbs.success){
                    cbs.success(ctx);
                }
            }
        }

        function errorReturn(err){
            numReturned++;
            if(numReturned==numLaunched){
                if(cbs.error){
                    cbs.error(ctx);
                }
            }
        }

        for(var i=0;i<pipes.length;i++){
            pipes[i].publish(ctx, {
                success: successReturn,
                error: errorReturn
            });
        }
    }

ProcessPathActions.flux_pipe = {
    name: 'FluxHTTPAPI : Paths : ProcessPathActions',
    description: 'Compiles any ctx.paths into flux-pipes and publishes to them',
    configs:[]
};

module.exports = ProcessPathActions;