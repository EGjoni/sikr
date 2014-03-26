<?php 

$username = $_GET["username"];
$tumblr_info = json_decode(file_get_contents("[PLACE YOUR API KEY HERE]"), true);
$username = escapeshellarg($username);
$status = $tumblr_info["meta"]["status"];
if ($status == "200") {
	exec("bash /[DIRECTORY UNDER WHICH YOU PUT THE ARCHIVE BASH FILE]/archive $username > /dev/null &");
	echo json_encode(array('valid'=>'true'));
} else {
	echo json_encode(array('valid'=>'false'));
}

?>
