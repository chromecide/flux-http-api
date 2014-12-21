function HTTPFluxAPI_PathLoadGroupPathsFromURL(ctx, cbs){
    if(ctx.user && ctx.user.id){
        var groupIds = [];
        for(var i=0;i<ctx.groups.length;i++){
            groupIds.push(ctx.groups[i].id);
        }

        var queryParams = {
            where: {
                group_id: {
                    eq: groupIds
                },
                deleted_at: null
            }
        };
        
        var requestMethod = ctx.request.method;
        var permString = 'allow_'+requestMethod.toLowerCase();
        queryParams.where[permString] = 1;

        ctx.store.read(ctx.models.group_paths, queryParams, {
            success: function(res){
                if(res.length===0){
                    if(cbs && cbs.success){
                        cbs.success(ctx);
                    }
                }else{
                    var allowedPathIds = [];
                    var pathStrings = [];

                    for(var l=0;l<res.length;l++){
                        allowedPathIds.push(res[l].path_id);
                    }

                    pathStrings.push(ctx.request.pathname); //exact match
                    
                    //trailing slashes
                    if(ctx.request.pathname.substr(ctx.request.pathname.length-1, 1)=='/'){
                        pathStrings.push(ctx.request.pathname.substr(0, ctx.request.pathname.length-1)); //exact match, but without the trailing slash
                    }else{
                        pathStrings.push(ctx.request.pathname+'/'); //exact match, but with a trailing slash
                    }

                    //wildcards
                    if(ctx.request.pathname.indexOf('/')>-1){ //we don't care about the first one
                        var pathParts = ctx.request.pathname.split('/');
                        var joinedPath = '/';
                        if(pathParts[0]==''){ //it was a slash
                            pathParts.shift();
                        }

                        for(var k=0;k<pathParts.length;k++){
                            pathStrings.push(joinedPath+'*');
                            joinedPath+=pathParts[k]+'/';
                        }

                        pathStrings.push(joinedPath+'*');
                    }

                    //load the paths
                    ctx.store.read(ctx.models.paths, {
                        where:{
                            id:{
                                eq: allowedPathIds
                            },
                            path: {
                                eq: pathStrings
                            }
                        }
                    },{
                        success: function(paths){
                            ctx.paths = paths;

                            //load the actions for the paths
                            var pathIds = [];
                            for(var j=0;j<ctx.paths.length;j++){
                                pathIds.push(ctx.paths[j].id);
                            }
                            console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
                            console.log(pathIds);
                            ctx.store.read(ctx.models.path_actions, {where:{path_id: {eq:pathIds}}},{
                                success: function(res){
                                    for(var m=0;m<res.length;m++){
                                        for(var n=0;n<ctx.paths.length;n++){
                                            if(ctx.paths[n].id==res[m].path_id){
                                                if(!ctx.paths[n].path_actions){
                                                    ctx.paths[n].path_actions = [];
                                                }
                                                ctx.paths[n].path_actions.push(res[m]);
                                            }
                                        }
                                    }

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
                        },
                        error: function(e){
                            console.log(e);
                            console.log('COULDNT LOAD PATHS');
                        }
                    });
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

HTTPFluxAPI_PathLoadGroupPathsFromURL.flux_pipe = {
    name: 'FluxHTTPAPI : Path : LoadGroupPathsFromURL',
    description: 'Loads ctx.models.group_paths Records based on the requested URL',
    configs:[]
};

module.exports = HTTPFluxAPI_PathLoadGroupPathsFromURL;