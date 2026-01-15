<?php

    require_once 'env.php';

    $base_url = $_ENV['APP_URL'] ?? 'http://localhost/Startup/';

    $db_config = [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'name' => $_ENV['DB_NAME'] ?? 'job',
        'user' => $_ENV['DB_USER'] ?? 'root',
        'pass' => $_ENV['DB_PASS'] ?? '',
    ];

?>