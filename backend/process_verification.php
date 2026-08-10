<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/User.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../auth/register.php");
    exit;
}

$email = trim($_POST['email'] ?? $_SESSION['pending_verify_email'] ?? '');
$code = trim($_POST['verification_code'] ?? '');

if (empty($email) || empty($code)) {
    header("Location: ../auth/verify.php?email=" . urlencode($email) . "&status=" . urlencode("Please enter your 6-digit verification code."));
    exit;
}

try {
    $user = new User($pdo);
    $verifiedUser = $user->verifyCode($email, $code);

    // Clear pending email session
    unset($_SESSION['pending_verify_email']);

    // Log user in or redirect to login success
    $_SESSION['user_id'] = $verifiedUser['id'];
    $_SESSION['user_email'] = $verifiedUser['email'];
    $_SESSION['user_name'] = $verifiedUser['first_name'] . ' ' . $verifiedUser['last_name'];

    header("Location: ../auth/login.php?status=verified&email=" . urlencode($verifiedUser['email']));
    exit;

} catch (Exception $e) {
    error_log("Verification Error: " . $e->getMessage());
    header("Location: ../auth/verify.php?email=" . urlencode($email) . "&status=" . urlencode($e->getMessage()));
    exit;
}
