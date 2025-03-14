<?php

  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");

  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $postedData = file_get_contents('php://input');
    $decoded = json_decode($postedData, true);
    $type = $decoded['type'];

    if ($type === 'signup') {
      $name = $decoded['name'];
      $email = $decoded['email'];
      $phone = $decoded['phone'];
      $pwd = $decoded['pwd'];
      $sql = "
        SELECT *
        FROM users
        WHERE
          name = :name OR
          email = :email OR
          phone = :phone
      ";
      $data = DBConnection($sql, [':name' => $name, ':email' => $email, ':phone' => $phone]);
      if (!empty($data)) {
        foreach ($data as $user) {
          if ($user['name'] === $name) {
            echo json_encode(['msg' => 'nameErr']);
            exit;
          } else if ($user['email'] === $email) {
            echo json_encode(['msg' => 'emailErr']);
            exit;
          } else if ($user['phone'] === $phone) {
            echo json_encode(['msg' => 'phoneErr']);
            exit;
          }
        }
      }
      $addNewUser = "
        INSERT INTO
          users (id, name, email, pwd, phone, role)
        VALUES
          (NULL, :name, :email, :pwd, :phone, 'usr');
      ";
      DBConnection($addNewUser,
        [
          ':name' => $name,
          ':email' => $email,
          ':pwd' => $pwd,
          ':phone' => $phone
        ]
      );
      echo json_encode(['msg' => 'userAdded']);
    } else if ($type === 'login') {
      $name = $decoded['name'];
      $pwd = $decoded['pwd'];
      $sql = "
        SELECT
          *
        FROM
          users
        WHERE
          :name = name
      ";
      echo json_encode(DBConnection($sql, ['name' => $name]));
    } else if ($type === 'contact') {
      $name = $decoded['name'];
      $user = $decoded['user'];
      $phone = $decoded['phone'];
      $msg = $decoded['msg'];
      $subj = $decoded['subj'];
      $date = date('Y-m-d H:i:s');
      $getInfos = "
          SELECT
            name, phone, email
          FROM
            users
          WHERE
            name = :user
      ";
      $data = DBConnection($getInfos, [':user' => $user]);
      if (!empty($data)) {
          $userData = $data[0];
          $username = $userData['name'];
          $userphone = $userData['phone'];
          $email = $userData['email'];
          echo json_encode($userData);
      }
      $sql = "
          INSERT INTO
            contacts (id, name, user_name, phone, user_phone, email, msg, subj, date)
          VALUES
            (NULL, :name, :user_name, :phone, :user_phone, :email, :msg, :subj, :date)
      ";
      DBConnection($sql, [
          ':name' => $name,
          ':user_name' => $username,
          ':phone' => $phone,
          ':user_phone' => $userphone,
          ':email' => $email,
          ':msg' => $msg,
          ':subj' => $subj,
          ':date' => $date
      ]);
    } else if ($type === 'uploadTemps') {
      if (!isset($decoded['img'])) {
        echo json_encode(["error" => "No image received"]);
        exit;
      }
      $img = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $decoded['img']));

      if (!$img) {
        echo json_encode(["error" => "Invalid image"]);
        exit;
      }
      $sql = "
        INSERT INTO templates (id, img, img_for)
        VALUES (NULL, :img, 'shirts')
      ";

      DBConnection($sql, [':img' => $img]);

      echo json_encode(["success" => "Image uploaded successfully"]);
    } else if ($type === 'getMsgs') {
      $sql = "
        SELECT
          *
        FROM
          contacts
      ";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'getLinks') {
      $sql = "
        SELECT
          link, element
        FROM 
          `social_media_links`
      ";
      echo json_encode(DBConnection($sql));
    } else {
      echo json_encode($decoded);
    }
  }

  function DBConnection($sql, $bindings=[]) {
    $host = "localhost";
    $dbname = "zoksh_store";
    $username = "root";
    $password = "";

    try {
      $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
      $stmt = $db->prepare($sql);
      
      foreach ($bindings as $placeholder => $value)
        $stmt->bindValue($placeholder, $value);
      
      $stmt->execute();
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $data;

    } catch (PDOException $e) {
      return json_encode(["error" => $e->getMessage()]);
    }
  }
  function generateToken($userId, $role) {
    $secretKey = "hJkiJGesu#k8%19snf!asd&me";
    $issuedAt = time();
    $expireAt = $issuedAt + (30 * 24 * 60 * 60);

    $payload = [
      "iat" => $issuedAt,
      "exp" => $expireAt,
      "user_id" => $userId,
      "role" => $role
    ];

    $token = JWT::encode($payload, $secretKey, 'HS256');
    setcookie("auth_token", $token, $expireAt, "/", "", true, true);

    return $token;
  }
