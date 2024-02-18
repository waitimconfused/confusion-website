<?php
	header('Content-Type: application/json');
	$dir = './projects/view/';
	$files = array_diff(scandir($dir), array('.', '..'));
	echo json_encode($files);
?>
