<?php
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../classes/User.php';
    require_once __DIR__ . '/send_email.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header("Location: ../auth/register.php");
        exit;
    }

    $data = [
        'first_name' => trim($_POST['first_name'] ?? ''),
        'last_name'  => trim($_POST['last_name'] ?? ''),
        'email'      => trim($_POST['email'] ?? ''),
        'password'   => $_POST['password'] ?? ''
    ];

    try {
        $user = new User($pdo);
        $user->register($data);

        // Send real welcome verification email via PHPMailer & Gmail App Password
        sendWelcomeEmail($data['email'], $data['first_name']);

        header("Location: ../auth/login.php?status=success&registered=" . urlencode($data['email']));
        exit;

    } catch (Exception $e) {
        error_log($e->getMessage());

        header("Location: ../auth/register.php?status=" . urlencode($e->getMessage()));
        exit;
    }
?>