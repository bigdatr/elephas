var clientSocket = function clientSocket(spark) {
    return {
    	id: spark.id,
    	on: function(e, cb) {
    		spark.on(e, cb);
    	},
    	dispatch: function(action) {
    		spark.write(action);
    	}
    };
};

module.exports = clientSocket;
