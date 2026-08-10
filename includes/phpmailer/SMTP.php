<?php
namespace PHPMailer\PHPMailer;

class SMTP
{
    const VERSION = '6.9.1';
    const CRLF = "\r\n";
    const DEFAULT_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const DEBUG_OFF = 0;
    const DEBUG_CLIENT = 1;
    const DEBUG_SERVER = 2;
    const DEBUG_CONNECTION = 3;
    const DEBUG_LOWLEVEL = 4;

    public $do_debug = self::DEBUG_OFF;
    public $Debugoutput = 'echo';
    public $SMTP_PORT = 25;

    protected $smtp_conn;
    protected $error = [];
    protected $helo_rply;
    protected $server_caps;

    public function connect($host, $port = null, $timeout = 30, $options = [])
    {
        $this->error = [];
        if ($this->connected()) {
            $this->error = ['error' => 'Already connected to a server'];
            return false;
        }
        if (empty($port)) {
            $port = self::DEFAULT_PORT;
        }

        $errno = 0;
        $errstr = '';
        $socket_context = stream_context_create($options);
        set_error_handler([$this, 'errorHandler']);
        $this->smtp_conn = @stream_socket_client(
            $host . ':' . $port,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $socket_context
        );
        restore_error_handler();

        if (!is_resource($this->smtp_conn)) {
            $this->error = [
                'error' => 'Failed to connect to server',
                'detail' => $errstr,
                'errno' => $errno,
            ];
            return false;
        }
        stream_set_timeout($this->smtp_conn, $timeout);
        $this->get_lines();
        return true;
    }

    public function startTLS()
    {
        if (!$this->sendCommand('STARTTLS', 'STARTTLS', 220)) {
            return false;
        }
        $crypto_method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
        }
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
        }
        set_error_handler([$this, 'errorHandler']);
        $crypto_ok = stream_socket_enable_crypto($this->smtp_conn, true, $crypto_method);
        restore_error_handler();
        return (bool) $crypto_ok;
    }

    public function authenticate($username, $password, $authtype = null)
    {
        if (!$this->connected()) {
            return false;
        }
        if (empty($authtype)) {
            $authtype = 'LOGIN';
        }

        switch ($authtype) {
            case 'PLAIN':
                if (!$this->sendCommand('AUTH PLAIN', 'AUTH PLAIN', 334)) {
                    return false;
                }
                if (!$this->sendCommand(base64_encode("\0" . $username . "\0" . $password), 'AUTH', 235)) {
                    return false;
                }
                break;
            case 'LOGIN':
            default:
                if (!$this->sendCommand('AUTH LOGIN', 'AUTH LOGIN', 334)) {
                    return false;
                }
                if (!$this->sendCommand(base64_encode($username), 'Username', 334)) {
                    return false;
                }
                if (!$this->sendCommand(base64_encode($password), 'Password', 235)) {
                    return false;
                }
                break;
        }
        return true;
    }

    public function connected()
    {
        if (is_resource($this->smtp_conn)) {
            $sock_status = stream_get_meta_data($this->smtp_conn);
            if ($sock_status['eof']) {
                $this->close();
                return false;
            }
            return true;
        }
        return false;
    }

    public function close()
    {
        $this->error = [];
        $this->server_caps = null;
        $this->helo_rply = null;
        if (is_resource($this->smtp_conn)) {
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
        }
    }

    public function hello($host = '')
    {
        if ($this->sendHello('EHLO', $host)) {
            return true;
        }
        return $this->sendHello('HELO', $host);
    }

    protected function sendHello($hello, $host)
    {
        return $this->sendCommand($hello . ' ' . $host, $hello, 250);
    }

    public function mail($from)
    {
        return $this->sendCommand('MAIL FROM:<' . $from . '>', 'MAIL FROM', 250);
    }

    public function recipient($toaddr)
    {
        return $this->sendCommand('RCPT TO:<' . $toaddr . '>', 'RCPT TO', [250, 251]);
    }

    public function data($msg_data)
    {
        if (!$this->sendCommand('DATA', 'DATA', 354)) {
            return false;
        }
        $msg_data = str_replace(["\r\n", "\r"], "\n", $msg_data);
        $lines = explode("\n", $msg_data);

        foreach ($lines as $line) {
            if (!empty($line) && $line[0] === '.') {
                $line = '.' . $line;
            }
            $this->client_send($line . self::CRLF);
        }

        return $this->sendCommand('.', 'DATA END', 250);
    }

    public function quit($close_on_error = true)
    {
        $e = $this->sendCommand('QUIT', 'QUIT', 221);
        if ($e || $close_on_error) {
            $this->close();
        }
        return $e;
    }

    protected function client_send($data)
    {
        if (is_resource($this->smtp_conn)) {
            return fwrite($this->smtp_conn, $data);
        }
        return 0;
    }

    protected function get_lines()
    {
        $data = '';
        if (!is_resource($this->smtp_conn)) {
            return $data;
        }
        stream_set_timeout($this->smtp_conn, 30);
        while (is_resource($this->smtp_conn) && !feof($this->smtp_conn)) {
            $str = @fgets($this->smtp_conn, 515);
            if ($str === false) {
                break;
            }
            $data .= $str;
            if (isset($str[3]) && $str[3] === ' ') {
                break;
            }
            $info = stream_get_meta_data($this->smtp_conn);
            if ($info['timed_out']) {
                break;
            }
        }
        return $data;
    }

    protected function errorHandler($errno, $errmsg, $errfile = '', $errline = 0)
    {
        $this->error = [
            'error' => 'SMTP error',
            'detail' => $errmsg,
            'errno' => $errno,
        ];
    }

    protected function sendCommand($command, $command_name, $expect)
    {
        if (!$this->connected()) {
            return false;
        }
        $this->client_send($command . self::CRLF);
        $reply = $this->get_lines();
        $code = (int) substr($reply, 0, 3);

        if (is_array($expect)) {
            return in_array($code, $expect, true);
        }
        return $code === $expect;
    }
}
