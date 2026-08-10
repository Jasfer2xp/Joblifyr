<?php
namespace PHPMailer\PHPMailer;

class PHPMailer
{
    const CHARSET_ISO88591 = 'iso-8859-1';
    const CHARSET_UTF8 = 'utf-8';
    const CONTENT_TYPE_PLAINTEXT = 'text/plain';
    const CONTENT_TYPE_TEXT_HTML = 'text/html';
    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';

    public $Priority = 3;
    public $CharSet = self::CHARSET_UTF8;
    public $ContentType = self::CONTENT_TYPE_TEXT_HTML;
    public $Encoding = '8bit';
    public $ErrorInfo = '';
    public $From = 'joblifyr@gmail.com';
    public $FromName = 'Joblifyr';
    public $Sender = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';

    public $Host = 'smtp.gmail.com';
    public $Port = 587;
    public $SMTPSecure = self::ENCRYPTION_STARTTLS;
    public $SMTPAuth = true;
    public $Username = 'joblifyr@gmail.com';
    public $Password = 'kciegydmtecxogjo';
    public $Timeout = 30;

    public $Mailer = 'smtp';

    protected $to = [];
    protected $cc = [];
    protected $bcc = [];
    protected $ReplyTo = [];
    protected $smtp;

    public function __construct($exceptions = null)
    {
        $this->smtp = new SMTP();
    }

    public function addAddress($address, $name = '')
    {
        $this->to[] = [$address, $name];
        return true;
    }

    public function setFrom($address, $name = '', $auto = true)
    {
        $this->From = $address;
        $this->FromName = $name;
        return true;
    }

    public function isHTML($ishtml = true)
    {
        if ($ishtml) {
            $this->ContentType = self::CONTENT_TYPE_TEXT_HTML;
        } else {
            $this->ContentType = self::CONTENT_TYPE_PLAINTEXT;
        }
    }

    public function send()
    {
        try {
            if (empty($this->to)) {
                throw new Exception('No recipient addresses specified');
            }

            if ($this->Mailer === 'smtp') {
                return $this->smtpSend();
            }

            return false;
        } catch (Exception $e) {
            $this->ErrorInfo = $e->getMessage();
            return false;
        }
    }

    protected function smtpSend()
    {
        $options = [];
        if ($this->SMTPSecure === self::ENCRYPTION_STARTTLS || $this->SMTPSecure === self::ENCRYPTION_SMTPS) {
            $options = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];
        }

        $prefix = ($this->SMTPSecure === self::ENCRYPTION_SMTPS) ? 'ssl://' : '';
        if (!$this->smtp->connect($prefix . $this->Host, $this->Port, $this->Timeout, $options)) {
            throw new Exception('SMTP connect() failed: ' . json_encode($this->smtp));
        }

        $this->smtp->hello(gethostname() ?: 'localhost');

        if ($this->SMTPSecure === self::ENCRYPTION_STARTTLS) {
            if (!$this->smtp->startTLS()) {
                throw new Exception('STARTTLS failed');
            }
            $this->smtp->hello(gethostname() ?: 'localhost');
        }

        if ($this->SMTPAuth) {
            if (!$this->smtp->authenticate($this->Username, $this->Password)) {
                throw new Exception('SMTP Authentication failed for ' . $this->Username);
            }
        }

        if (!$this->smtp->mail($this->From)) {
            throw new Exception('MAIL FROM failed');
        }

        foreach ($this->to as $toaddr) {
            if (!$this->smtp->recipient($toaddr[0])) {
                throw new Exception('RCPT TO failed for ' . $toaddr[0]);
            }
        }

        $header = "Date: " . date('r') . "\r\n";
        $header .= "To: " . $this->to[0][0] . "\r\n";
        $header .= "From: " . $this->FromName . " <" . $this->From . ">\r\n";
        $header .= "Subject: " . $this->Subject . "\r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-Type: " . $this->ContentType . "; charset=" . $this->CharSet . "\r\n\r\n";

        $body = $header . $this->Body;

        if (!$this->smtp->data($body)) {
            throw new Exception('DATA command failed');
        }

        $this->smtp->quit();
        return true;
    }
}
