var config = {};

//PORT
//(in production mode may be omitted, because app take it from "process.env.PORT")
config.port = 552;

//DB
config.db = {
    mongoConnection: "mongodb://dbuser:dbpassword@server:port/database"
};


module.exports = config;