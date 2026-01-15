<?php

    class User {

        private PDO $db;

        public function __construct($pdo) {
            $this->db = $pdo;
        }

        public function register(array $data): bool {

            if (
                empty($data['email']) ||
                empty($data['first_name']) ||
                empty($data['last_name']) ||
                empty($data['password'])
            ) {
                throw new Exception("All fields are required");
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email");
            }

            if (strlen($data['password']) < 8) {
                throw new Exception("Password must be at least 8 characters");
            }

            $check = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$data['email']]);

            if ($check->fetch()) {
                throw new Exception("Email already registered");
            }

            $stmt = $this->db->prepare("
                INSERT INTO users (email, first_name, last_name, password) 
                VALUES (?, ?, ?, ?)
            ");

            return $stmt->execute([
                $data['email'],
                $data['first_name'],
                $data['last_name'],
                password_hash($data['password'], PASSWORD_DEFAULT)
            ]);
        }
    }

?>