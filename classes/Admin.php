<?php

    class Admin{

        public $id;
        public $email;
        public $username;
        public $password;

        private $db;

        public function __construct($pdo) {
            $this->db = $pdo;
        }

        
    }




?>