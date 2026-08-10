<?php
namespace PHPMailer\PHPMailer;

use Exception as BaseException;

class Exception extends BaseException
{
    public function errorMessage()
    {
        return '<strong>' . htmlspecialchars($this->getMessage(), ENT_COMPAT | ENT_HTML5, 'UTF-8') . "</strong><br />\n";
    }
}
