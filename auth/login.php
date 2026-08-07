<?php

define('SECURE_ACCESS', true);

require_once __DIR__ . '/../config/config.php';

session_start();

$csrf_token = generate_csrf_token();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Joblifyr</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $base_url; ?>css/login.css">
</head>
<body>

    <header>
        <div class="header-container">
            <div class="header">
                <div class="logo">
                    <h4>Joblifyr</h4>
                </div>
                <div class="back-home">
                    <a href="<?php echo $base_url; ?>index.php">Back to Home</a>
                </div>
            </div>
        </div>
    </header>

    <div class="login-container">
        <div class="login-box">
            <h1 class="login-title">Login</h1>
            <p class="login-subtitle">Welcome back! Please login to your account.</p>

            <div class="social-login">
                <button class="social-btn google-btn" type="button">
                    <i class="fab fa-google"></i>
                    <span>Continue with Google</span>
                </button>
                <button class="social-btn linkedin-btn" type="button">
                    <i class="fab fa-linkedin-in"></i>
                    <span>Log in with LinkedIn</span>
                </button>
                <button class="social-btn twitter-btn" type="button">
                    <i class="fab fa-x-twitter"></i>
                    <span>Continue with X</span>
                </button>
            </div>

            <div class="divider">
                <span>or</span>
            </div>

            <form class="login-form" method="POST" action="<?php echo $base_url; ?>auth/process_login.php">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email" required>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" placeholder="Enter your password" required>
                </div>

                <div class="form-options">
                    <div class="remember-me">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a href="<?php echo $base_url; ?>auth/forgot_password.php" class="forgot-password">Forgot Password?</a>
                </div>

                <button type="submit" class="btn-login">Login</button>
            </form>

            <div class="signup-link">
                Don't have an account? <a href="<?php echo $base_url; ?>auth/signup.php">Sign up</a>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz4YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>