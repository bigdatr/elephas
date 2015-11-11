export default function clientSocket(spark) {
    return {
    	spark: spark,
    	id: spark.id,
    	dispatch(action) {
    		spark.write(action);
    	}
    };
}