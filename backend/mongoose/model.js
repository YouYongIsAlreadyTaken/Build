var schemaJSON = require('./schema.json'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema(schemaJSON, { timestamp: {} }),
    collection = 'builds'; 
    model = mongoose.model(collection,schema);

module.exports = {collection:collection,model:model};


