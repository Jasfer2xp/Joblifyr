<?php
  require_once __DIR__ . '/../config/config.php';
  session_start();

  $email = $_GET['email'] ?? $_SESSION['pending_verify_email'] ?? '';
  $error = $_GET['status'] ?? null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email — Joblifyr Security</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #FAF9F5;
            color: #0A0F1D;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        header {
            height: 80px;
            padding: 0 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #E2E8F0;
        }
        .logo {
            font-weight: 800;
            font-size: 22px;
            text-decoration: none;
            color: #0A0F1D;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .logo span {
            width: 32px;
            height: 32px;
            background: #0A0F1D;
            color: white;
            border-radius: 10px;
            display: grid;
            place-items: center;
            font-size: 16px;
        }
        main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        }
        .card {
            background: #ffffff;
            width: 100%;
            max-width: 440px;
            padding: 40px;
            border-radius: 24px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
            text-align: center;
        }
        .icon-badge {
            width: 56px;
            height: 56px;
            background-color: #F4F3FF;
            color: #4F52E6;
            border-radius: 16px;
            display: grid;
            place-items: center;
            margin: 0 auto 20px auto;
            font-size: 24px;
        }
        h1 { font-size: 24px; font-weight: 800; margin: 0 0 8px 0; }
        p { color: #64748B; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5; }
        .email-highlight { color: #0A0F1D; font-weight: 700; }
        .error-box {
            background: #FEF2F2;
            border: 1px solid #FCA5A5;
            color: #991B1B;
            padding: 12px;
            border-radius: 12px;
            font-size: 13px;
            margin-bottom: 20px;
        }
        .code-input-group {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 24px;
        }
        .code-input-group input {
            width: 100%;
            height: 54px;
            text-align: center;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 8px;
            border: 1px solid #CBD5E1;
            background: #FAF9F5;
            border-radius: 12px;
            outline: none;
            transition: all 0.2s;
        }
        .code-input-group input:focus {
            border-color: #4F52E6;
            background: #ffffff;
            box-shadow: 0 0 0 4px rgba(79, 82, 230, 0.15);
        }
        .btn-submit {
            width: 100%;
            background-color: #4F52E6;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-submit:hover { background-color: #4345D9; }
        .resend { margin-top: 20px; font-size: 13px; color: #64748B; }
        .resend a { color: #4F52E6; text-decoration: none; font-weight: 700; }
        .resend a:hover { text-decoration: underline; }
    </style>
</head>
<body>

<header>
    <a href="../index.php" class="logo">
        <span>J</span> Joblifyr
    </a>
</header>

<main>
    <div class="card">
        <div class="icon-badge">✉️</div>
        <h1>Check your email</h1>
        <p>We sent a 6-digit security verification code to <br><span class="email-highlight"><?= htmlspecialchars($email) ?></span></p>

        <?php if ($error): ?>
            <div class="error-box"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form action="../backend/process_verification.php" method="POST">
            <input type="hidden" name="email" value="<?= htmlspecialchars($email) ?>">
            
            <div class="code-input-group">
                <input type="text" name="verification_code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" autocomplete="one-time-code" required autofocus>
            </div>

            <button type="submit" class="btn-submit">Verify Account &rarr;</button>
        </form>

        <div class="resend">
            Didn't receive the code? <a href="../auth/register.php">Try registering again</a>
        </div>
    </div>
</main>

</body>
</html>
