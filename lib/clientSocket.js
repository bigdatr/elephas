var clientSocket = function clientSocket(spark) {
    return {
    	// spark: spark,
    	id: spark.id,
    	on: spark.on,
    	dispatch: function(action) {
    		spark.write(action);
    	}
    };
};

module.exports = clientSocket;
