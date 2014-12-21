module.exports = {
    requests: {
        TokenPreProcess: require(__dirname+'/actions/requests/TokenPreProcess.js')
    },
    users:{
        Search: require(__dirname+'/actions/users/search.js'),
        LoadFromContextToken: require(__dirname+'/actions/users/loadFromContextToken.js')
    },
    groups: {
        LoadFromContextUser: require(__dirname+'/actions/groups/loadFromContextUser.js')
    },
    paths: {
        LoadGroupPathsFromURL: require(__dirname+'/actions/paths/LoadGroupPathsFromURL.js'),
        ProcessPathActions: require(__dirname+'/actions/paths/ProcessPathActions.js')
    },
    init: function(fPipes){
        fPipes.actions.register('FluxHTTPAPI:Requests:TokenPreProcess', this.requests.TokenPreProcess);
        fPipes.actions.register('FluxHTTPAPI:Users:LoadFromContextToken', this.users.LoadFromContextToken);
        fPipes.actions.register('FluxHTTPAPI:Users:Search', this.users.Search);
        fPipes.actions.register('FluxHTTPAPI:Groups:LoadFromContextUser', this.groups.LoadFromContextUser);
        fPipes.actions.register('FluxHTTPAPI:Paths:LoadGroupPathsFromURL', this.paths.LoadGroupPathsFromURL);
        fPipes.actions.register('FluxHTTPAPI:Paths:ProcessPathActions', this.paths.ProcessPathActions);
    }
};