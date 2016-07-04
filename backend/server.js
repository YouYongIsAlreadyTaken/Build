var userDevice = require('../../../infrastructure/userDevice/userDevice.js'),
    restful = require('../../../node-restful'),
    readme = require('./hot/readme.json'),
    express = require('express'),
    model = require('./mongoose/model.js'),
    appSettings = require('../../../infrastructure/appSettings/service.js')('build');

var build = restful.model(
    model.collection
).methods(['get', 
    {
        before: function (req, res ,next) {
            if(req.params){
                model.model.findOne({_id:req.params.id},function (err, doc) {
                    res.removingBundle = doc;
                    next();
                }); 
            }else{
                next();
            }
        },
        method: 'delete',
        after: userDevice.sse.infoOthers('build',appSettings.isUserEnabled)
    },
    {
        method: 'put',
        after: userDevice.sse.infoOthers('build',appSettings.isUserEnabled)
    },
    {
        method: 'post',
        after: userDevice.sse.infoOthers('build',appSettings.isUserEnabled)
    }]).route('upsert', 'post', function (req, res) {
        var item = req.body;
        model.model.findOneAndUpdate({ build_name: item.build_name }, item, { upsert: true, new: true }, function (err, doc) {
            if (err) {
                res.status(400).json({ message: 'failed to upsert', error: err });
            } else {
                userDevice.sse.send(function (client) {
                    return appSettings.isUserEnabled(client);
                }, {
                        application: 'build',
                        type: 'upserted',
                        data: doc
                    });
                res.send(doc);
            }
        });
    })
    .route('categories', 'get', function (req, res) {
        model.model.distinct('category').exec(function (err, categories) {
             if (err) {
                res.status(400).json({ message: 'failed to get categories', error: err });
            } else {
                res.send(categories);
            }
        });
    })
    .route('readme', 'get', function (req, res) {
        res.send(readme);
    })
    .route('frontend', 'get', express.static(path.join(__dirname, '../frontend/dist')))
    ;
    
    
module.exports = { models: [build,appSettings], hot: ['hot/readme.json'] };