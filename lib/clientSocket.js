module.exports = function clientSocket(spark) {
    return {
    	// spark: spark,
    	id: spark.id,
    	on: spark.on,
    	dispatch(action) {
    		spark.write(action);
    	}
    };
};
