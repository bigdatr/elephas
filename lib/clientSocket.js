export default function clientSocket(spark) {
    return {
    	spark: spark,
    	dispatch(action) {
    		spark.write(action);
    	}
    };
}