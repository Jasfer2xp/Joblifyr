<?php

if(!defined('SECURE_ACCESS')) {
    die('Direct access not permitted');
}

$envPath = __DIR__ . '/../.env'; 

if(!file_exists($envPath)) {
    die(".env file not found");
}

$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach($lines as $line){
    if(strpos(trim($line), '#') === 0) continue;

    if(strpos($line, '=') !== false){
        list($name, $value) = explode('=', $line, 2);

        $name = trim($name);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        $_ENV[$name] = $value;
        putenv($name . '=' . $value);
    }
}

?>