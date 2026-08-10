<?php
if (!defined('SECURE_ACCESS')) {
    define('SECURE_ACCESS', true);
}

require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../includes/phpmailer/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Send email using PHPMailer and Gmail SMTP with App Password
 */
function sendJoblifyrEmail($toEmail, $toName, $subject, $htmlContent) {
    $mail = new PHPMailer(true);

    try {
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        
        // Gmail SMTP Server Settings
        $mail->Host       = 'smtp.gmail.com';
        $mail->Port       = 587;
        $mail->SMTPAuth   = true;
        $mail->Username   = 'joblifyr@gmail.com';
        $mail->Password   = 'kciegydmtecxogjo'; // Google App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        // SSL stream options to ensure connection succeeds across all servers
        $mail->smtpConnect([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        // Sender & Recipient
        $mail->setFrom('joblifyr@gmail.com', 'Joblifyr Platform');
        $mail->addAddress($toEmail, $toName);

        // Content
        $mail->Subject = $subject;
        $mail->Body    = $htmlContent;

        $sent = $mail->send();
        return $sent;
    } catch (Exception $e) {
        error_log("PHPMailer Send Error: " . $e->getMessage() . " | Info: " . $mail->ErrorInfo);
        return false;
    }
}

/**
 * Send 6-digit security verification code to user's real email address
 */
function sendVerificationCodeEmail($toEmail, $userName, $code) {
    $subject = "Your 6-Digit Joblifyr Verification Code: {$code}";
    $formattedCode = substr($code, 0, 3) . ' ' . substr($code, 3, 3);

    $htmlBody = "
    <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; padding: 30px; max-width: 550px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; text-align: center;'>
        <div style='display: inline-block; width: 48px; height: 48px; background-color: #4F52E6; border-radius: 12px; line-height: 48px; color: #ffffff; font-weight: bold; font-size: 24px; margin-bottom: 20px;'>J</div>
        <h2 style='color: #0A0F1D; font-size: 24px; margin: 0 0 10px 0;'>Verify Your Email Address</h2>
        <p style='color: #64748b; font-size: 14px; margin-bottom: 25px;'>Hello {$userName}, please use the 6-digit security code below to complete your Joblifyr account creation.</p>
        
        <div style='background-color: #F4F3FF; border: 1px border-indigo-200; border-radius: 16px; padding: 20px; margin: 20px 0;'>
            <span style='font-family: monospace, Courier; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #4F52E6;'>{$formattedCode}</span>
        </div>
        
        <p style='color: #94a3b8; font-size: 12px; margin-top: 25px;'>This code expires in 15 minutes. If you did not create a Joblifyr account, please ignore this email and your address will be automatically removed.</p>
        <hr style='border: none; border-top: 1px solid #f1f5f9; margin: 25px 0 15px 0;'>
        <p style='font-size: 11px; color: #cbd5e1;'>© 2026 Joblifyr Inc. Built for ambitious teams.</p>
    </div>
    ";

    return sendJoblifyrEmail($toEmail, $userName, $subject, $htmlBody);
}
