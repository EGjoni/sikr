<?php

$user = "www-data"; 
$db = "spidr"; 
$con = pg_connect("dbname=$db user=$user")
    or die ("Could not connect to server\n"); 

$query = $_GET["query"];
$username = $_GET["username"];

#check to see if query contains an even number of quotation marks
if (substr_count($query, "\"") %2 == 0 && substr_count($query, "\"") > 0) {
	#if there are an even number of quotation marks, 
	#then explode the string into quoted and unquoted pieces
	$query = str_replace("\" ", "\"", $query);
	$query = str_replace(" \"", "\"", $query);
	$parity = 0;
	
	if ( substr($query, 0, 1) == "\"") {
		$query = substr($query, 1, strlen($query));
		$parity = 1;
	}
	if ( substr($query, strlen($query)-1, strlen($query)) == "\"") {
		$query = substr($query, 0, strlen($query)-1);
	}
	$exploded = explode("\"", $query);
	
	#go through and OR the phrases not in quotes (the even phrases) 
	#and AND the ones in quotes (the odd ones)
	for( $i=0; $i < sizeof($exploded); $i++) {
		
		if($i%2 == 0 + $parity) {
			$exploded[$i] = "(" . str_replace(" ", " | ", $exploded[$i]) . ")";
		} else {
			$exploded[$i] = "(" . str_replace(" ", " & ", $exploded[$i]) . ")";
		}
		if($i < (sizeof($exploded) - 1)) {
			$exploded[$i] = $exploded[$i] . " & ";
		}
	}
	$query = implode($exploded);
} else {
	$query = str_replace(" ", " | ", $query);
}
$result = pg_prepare($con, "get_results", 'select candidates.post_id, candidates.post_link, substr(candidates.post_html, 0, 500), ts_rank(candidates.vec, to_tsquery($1)) as score from (select post_id, post_link, post_html, vec from posts where vec @@ to_tsquery($1) and username = lower($2)) as candidates order by score desc limit 50');
$result = pg_execute($con, "get_results", array($query, $username));

	
echo json_encode(pg_fetch_all($result));
pg_close($con); 

?>


