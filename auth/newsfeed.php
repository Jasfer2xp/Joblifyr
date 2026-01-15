<?php

    session_start();

    if (!isset($_SESSION['user_id'])) {
        header("Location: ../auth/login.php");
        exit;
    }

    include '../includes/header.php';
?>

<main>
    <h1>Newsfeed</h1>
</main>