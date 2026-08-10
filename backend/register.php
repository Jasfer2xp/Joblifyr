<?php
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../classes/User.php';
    require_once __DIR__ . '/send_email.php';

    session_start();

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
        
        // Generate 6-digit verification code & save to pending_verifications table
        $code = $user->createPendingVerification($data);

        // Send 6-digit code to real email via PHPMailer & Gmail SMTP
        $mailSent = sendVerificationCodeEmail($data['email'], $data['first_name'], $code);

        if (!$mailSent) {
            throw new Exception("Failed to send verification email. Please ensure your email address is valid.");
        }

        // Store pending email in session for verification screen
        $_SESSION['pending_verify_email'] = $data['email'];

        // Redirect to 6-digit code verification page
        header("Location: ../auth/verify.php?email=" . urlencode($data['email']));
        exit;

    } catch (Exception $e) {
        error_log($e->getMessage());

        header("Location: ../auth/register.php?status=" . urlencode($e->getMessage()));
        exit;
    }
?>