function HTTPFluxAPI_GroupLoadFromContextUser(ctx, cbs){
    if(ctx.user && ctx.user.id){
        ctx.store.read(ctx.models.group_users, {where:{user_id: ctx.user.id, deleted_at: null}}, {
            success: function(res){
                var groupIds = [];
                for(var i=0;i<res.length;i++){
                    groupIds.push(res[i].group_id);
                }
                
                ctx.store.read(
                    ctx.models.groups,
                    {
                        where: {
                            id: {
                                eq: groupIds
                            },
                            enabled: 1
                        }
                    },
                    {
                        success: function(groups){
                            ctx.groups = groups;
                            if(cbs && cbs.success){
                                cbs.success(ctx);
                            }
                        },
                        error: function(err){
                            console.log(err);
                        }
                    }
                );
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

HTTPFluxAPI_GroupLoadFromContextUser.flux_pipe = {
    name: 'FluxHTTPAPI : User : LoadFromContextUser',
    description: 'Loads the Groups associated with the user_id in ctx.user.id, if it exists',
    configs:[]
};

module.exports = HTTPFluxAPI_GroupLoadFromContextUser;