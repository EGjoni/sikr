<?php 
$starttime=round(microtime(true) * 1000);

$user = "www-data"; 
$db = "spidr"; 

$archiving = "false";
$total_posts =0;
$archived_posts=0;

$con = pg_connect("dbname=$db user=$user")
    or die ("Could not connect to server\n"); 
    
    
$username = $_GET["username"];

$result = pg_prepare($con, "check_status", 'select * from archiving where username = lower($1)');
$result = pg_execute($con, "check_status", array($username));

while ($row = pg_fetch_array($result)) {
	$archiving="true";
	$total_posts=$row[1];	
}

$endtime = round(microtime(true) * 1000);

$getcount = pg_prepare($con, "get_count", 'select * from userstats where username = lower($1)');
$getcount = pg_execute($con, "get_count", array($username));




while ($row = pg_fetch_array($getcount)) {
	$archived_posts=$row[1];	
}


$return=array('archiving'=>$archiving, 'total'=>$total_posts, 'archived'=>$archived_posts);
echo json_encode($return);

pg_close($con); 


?>
