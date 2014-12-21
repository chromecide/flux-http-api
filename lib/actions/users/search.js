function usersSearch(ctx, cbs){
    ctx.HTTPResponse = [];

    var searchParams = {
        order: 'username ASC'
    };

    for(var fieldName in ctx.request.query){
        if(!searchParams.where){
            searchParams.where = {};
        }
        searchParams.where[fieldName] = ctx.request.query[fieldName];
    }
    
    ctx.store.read(ctx.models.users, searchParams, {
        success: function(res){
            for(var i=0;i<res.length;i++){
                var userObj = res[i];
                delete userObj.pass_phrase;
                ctx.HTTPResponse.push(userObj);
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
}

usersSearch.flux_pipe = {
    name: 'FluxHTTPAPI : Users : Search',
    description: 'Searches the store for users',
    configs:[]
};

module.exports = usersSearch;