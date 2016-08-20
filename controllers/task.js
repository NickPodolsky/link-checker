var E               = require('events');
var Events          = new E.EventEmitter();
var Promise         = require('bluebird');
var HttpQuery       = Promise.promisifyAll(require('needle'));
var LinkExtractor   = require('../workers/link-extractor');
var BLC             = require('broken-link-checker');


var controller = function(MongoDB){
    var actions = {};

    //
    // Create new task and run exectution
    //
    actions.run = function(request, response){
        var siteUrl = request.body.url.trim();

        var task = new MongoDB.task({requestedSiteUrl: siteUrl});
        task.save()                                                 // create new task in db
            .then(function(){                                       // send response with task id
                return response.send(task.id);
            })
            .then(function(){                                       // get site body
                return HttpQuery.getAsync(task.requestedSiteUrl, {
                    follow_max         : 5,                         // follow up to five redirects
                    rejectUnauthorized : true                       // verify SSL certificate
                });
            })
            .then(function(response){                               // save body and destination url to db
                var destinationSiteUrl = response.socket._httpMessage.agent.protocol + '//' + response.socket._host;    // site url after protocol detecting and redirects
                return MongoDB.task.findOneAndUpdate({_id: task.id},
                    {
                        destinationSiteUrl: destinationSiteUrl,
                        pageBody:           response.body
                    }, {new: true})
                    .then(function(updatedTask){task = updatedTask;});
            })
            .then(function(){                                       // extract url's from page
                var extractor = new LinkExtractor(task.destinationSiteUrl, task.pageBody);
                return extractor.extract();
            })
            .then(function(links){                                  // put links to DB
                return MongoDB.task.findOneAndUpdate( {_id: task.id},
                    {
                        links: links,
                        result: {total: links.length, checked: 0, broken: 0}
                    },
                    {new: true})
                    .then(function(updatedTask){task = updatedTask;});
            })
            .then(function(){
                var urlChecker = new BLC.UrlChecker({}, {
                    link: processCheckResult,
                    end: function(){}
                });

                task.links.forEach(function(link, index){
                    urlChecker.enqueue(link.url, '', {taskId: task._id, linkIndex: index});
                },this);


                console.log('Task ' + task._id + ' added to queue');
            });
    };

    var processCheckResult = function(result, data){
        //console.log(result);
        var httpCode = (result.http.response !== null) ? result.http.response.statusCode : null;
        console.log(httpCode);
        var linkField = {};
            linkField["links."+data.linkIndex+".httpCode"]  = httpCode;
            linkField["links."+data.linkIndex+".broken"]    = result.broken;
        var resultField = {"result.checked": 1, "result.broken": (result.broken) ? 1 : 0};

        return MongoDB.task.findOneAndUpdate( {_id: data.taskId},
            {
                $set: linkField,
                $inc: resultField
            },
            {new: true})
            .catch(function(e){console.log(e);});
    };


    return {
        events: Events,
        run: actions.run
    };


};

module.exports = controller;