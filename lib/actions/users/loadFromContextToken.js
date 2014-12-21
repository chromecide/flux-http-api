function HTTPFluxAPI_UserLoadFromContextToken(ctx, cbs){
    if(ctx.token && ctx.token.user_id){
        ctx.store.read(ctx.models.users, {where:{id: ctx.token.user_id}}, {
            success: function(res){
                if(res && res.length==1){
                    ctx.user = res[0];
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
        if(cbs.success){
            cbs.success(ctx);
        }
    }
}

HTTPFluxAPI_UserLoadFromContextToken.flux_pipe = {
    name: 'FluxHTTPAPI : User : LoadFromToken',
    description: 'Loads the User defined in ctx.token.user_id, if it exists',
    configs:[]
};

module.exports = HTTPFluxAPI_UserLoadFromContextToken;