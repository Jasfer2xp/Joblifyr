<?php
define('SECURE_ACCESS', true);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/User.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.php");
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

try {
    $userModel = new User($pdo);
    $user = $userModel->login($email, $password);

    // Save authenticated session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
    $_SESSION['is_logged_in'] = true;

    // Redirect to homepage / dashboard
    header("Location: ../index.php?status=login_success");
    exit;

} catch (Exception $e) {
    error_log("Login Exception: " . $e->getMessage());
    header("Location: login.php?status=" . urlencode($e->getMessage()));
    exit;
}
