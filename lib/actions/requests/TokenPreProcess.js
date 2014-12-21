function HTTPFluxAPI_TokenPreProcess(ctx, cbs){
    if(!ctx.request.query){
        ctx.request.query = {};
    }

    if(!ctx.request.query.token){
        ctx.request.query.token = 'PUBLIC';
    }

    if(ctx.request.query && ctx.request.query.token){
        //here we need to validate the token
        ctx.store.read(ctx.models.tokens, {where:{token: ctx.request.query.token, deleted_at: null}}, {
            success: function(res){
                if(res && res.length==1){
                    delete ctx.request.query.token;
                    ctx.token = res[0];
                }

                if(cbs.success){
                    cbs.success(ctx);
                }
            },
            error: function(err){
                if(cbs && cbs.error){
                    cbs.error(err);
                }
            }
        });
    }else{
        //here we need to load the default public token
        console.log('NO TOKEN');
        if(cbs.success){
            cbs.success(ctx);
        }
    }
}

HTTPFluxAPI_TokenPreProcess.flux_pipe = {
    name: 'FluxHTTPAPI : TokenPreProcess',
    description: 'Preprocess the request based on a supplied API Token',
    configs:[]
};

module.exports = HTTPFluxAPI_TokenPreProcess;