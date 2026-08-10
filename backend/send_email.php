<?php
/**
 * Email Sender Utility for Joblifyr
 * Uses PHPMailer with Gmail SMTP & App Password
 */

require_once __DIR__ . '/../includes/phpmailer/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendJoblifyrEmail($toEmail, $toName, $subject, $htmlContent) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $mail->Port       = getenv('SMTP_PORT') ?: 587;
        $mail->SMTPAuth   = true;
        $mail->Username   = getenv('SMTP_USER') ?: 'joblifyr@gmail.com';
        $mail->Password   = getenv('SMTP_PASS') ?: 'kciegydmtecxogjo';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        // Recipients
        $mail->setFrom('joblifyr@gmail.com', 'Joblifyr Platform');
        $mail->addAddress($toEmail, $toName);

        // Content
        $mail->Subject = $subject;
        $mail->Body    = $htmlContent;

        return $mail->send();
    } catch (Exception $e) {
        error_log("Joblifyr Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

function sendWelcomeEmail($toEmail, $userName) {
    $subject = "Welcome to Joblifyr - Verify Your Account";
    $htmlBody = "
    <div style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;'>
        <h2 style='color: #4F52E6;'>Welcome to Joblifyr, {$userName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now log in using your registered credentials or continue seamlessly with your Google Account using the same email address: <strong>{$toEmail}</strong>.</p>
        <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>
        <p style='font-size: 12px; color: #64748b;'>If you did not request this account, please ignore this email.</p>
    </div>
    ";

    return sendJoblifyrEmail($toEmail, $userName, $subject, $htmlBody);
}
