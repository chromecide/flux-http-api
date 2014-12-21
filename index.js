var fPipes = require(__dirname+'/../flux-pipes/index.js');
fPipes.init();

//additional flux-pipe modules
var fpHTTP = require(__dirname+'/../flux-pipes-http/index.js');
var fpConnect = require(__dirname+'/../flux-pipes-connect/index.js');

var fluxHTTPAPIActions = require(__dirname+'/lib/actions.js');

//initialise Pipe modules
fpHTTP.init(fPipes);
fpConnect.init(fPipes);
fluxHTTPAPIActions.init(fPipes);

//initialise the database conenction
var fData = require(__dirname+'/../flux-data');
var mysqlAdapter = require(__dirname+'/../flux-data-mysql');

fData.stores.registerAdapter('mysql', mysqlAdapter);

var models = {};



fData.stores.registerStore("default", 'mysql', {
    host     : 'localhost',
    user     : 'TokenAPI',
    password : 'TokenAPI',
    database : 'TokenAPI',
    autoconnect: true,
    models: models
},
{
    success: function(ds){
        if(ds){
            ds.loadModelConfig({
                success: function(res){
                    for(var i in res){
                        var m = new fData.model(res[i]);
                        models[res[i].name] = m;
                    }
                    var actionList = fPipes.actions.get();
                    for(var actionName in actionList){
                        console.log(actionName);
                    }
                    //setup the request handler pipe
                    var requestHandler = new fPipes.pipe();
                        requestHandler.use(function(ctx, cbs){
                            ctx.store = ds;
                            ctx.models = models;
                            if(cbs && cbs.success){
                                cbs.success(ctx);
                            }
                        });

                        requestHandler.use('Connect:UseCompression');
                        requestHandler.use('Connect:UseCORS');
                        requestHandler.use('Connect:UseFormidable');
                        requestHandler.use('Connect:UseQS');

                        requestHandler.use('FluxHTTPAPI:Requests:TokenPreProcess');
                        requestHandler.use('FluxHTTPAPI:Users:LoadFromContextToken');
                        requestHandler.use('FluxHTTPAPI:Groups:LoadFromContextUser');
                        requestHandler.use('FluxHTTPAPI:Paths:LoadGroupPathsFromURL');
                        requestHandler.use('FluxHTTPAPI:Paths:ProcessPathActions');
                        // Built in API Endpoints
                        requestHandler.use('FluxHTTPAPI:Users:Search');

                        requestHandler.use(function(ctx, cbs){
                            //if HTTPResponse has not already been set, we need a 404
                            if(!ctx.HTTPResponse){
                                console.log('SETTING 404 HTTPResponse');
                                ctx.response.statusCode = 404;
                                if(ctx.user){
                                    delete(ctx.user.pass_phrase);
                                }
                                ctx.HTTPResponse = {
                                    error: "404",
                                    ctx: {
                                        token: ctx.token,
                                        user: ctx.user,
                                        groups: ctx.groups,
                                        paths: ctx.paths
                                    }
                                };
                            }
                            
                            if(cbs && cbs.success){
                                cbs.success(ctx);
                            }
                        });
                        requestHandler.use(fPipes.actions.pipes.publishTo, {target: 'HTTP:SendResponse:JSON'});

                        fPipes.pipes.register('FluxHTTP:RequestHandler', requestHandler);

                        //publish the server
                        fPipes.pipes.publish('HTTP:Server:CreateAndListen', {
                            port: 8080,
                            request_pipe: 'FluxHTTP:RequestHandler',
                            success: function(ctx){
                                console.log('REQUEST COMPLETE: '+ctx.request.url);
                            },
                            error: function(e){
                                console.log('-------------------------');
                                console.log('API ERROR');
                                console.log('-------------------------');
                                console.log(e);
                            }
                        }, {
                            success: function(ctx){
                                console.log('Server Running');
                            },
                            error: function(e){
                                console.log('-------------------------');
                                console.log('ERROR');
                                console.log('-------------------------');
                                console.log(e);
                            }
                        });
                },
                error: function(){
                    console.log('error');
                    console.log(arguments);
                }
            });
        }
    },
    error: function(err){
        console.log('ERROR CONNECTING TO MYSQL STORE');
        console.log(err);
    }
});