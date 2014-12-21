var fluxData = require('flux-data');
var fdMysql = require('flux-data-mysql');

function HTTPFluxAPI_TokenPreProcess(ctx, cbs){
    if(ctx.request.query && ctx.request.query.token){
        //here we need to validate the token
    }else{
        //here we need to load the default public token
    }
}

HTTPFluxAPI_TokenPreProcess.flux_pipe = {
    name: 'FluxHTTPAPI : TokenPreProcess',
    description: 'Preprocess the request based on a supplied API Token',
    configs:[]
};

module.exports = HTTPFluxAPI_TokenPreProcess;