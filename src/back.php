<?php

  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header('Content-Type: application/json');

  require 'vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $postedData = file_get_contents('php://input');
    $decoded = json_decode($postedData, true);
    $type = '';
    
    if (isset($decoded['type']))
      $type = $decoded['type'];

    else
      $type = $_POST['type'];
    
    if ($type === 'signup') {
      $name = $decoded['name'];
      $email = $decoded['email'];
      $phone = $decoded['phone'];
      $pwd = $decoded['pwd'];
      $sql = "
        SELECT *
        FROM users
        WHERE name = :name OR email = :email OR phone = :phone
      ";
      $data = DBConnection($sql, [
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone
      ]);
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
      $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);
      $userPayload = [
        'name' => $name,
        'role' => 'usr'
      ];
      $token = generateToken($userPayload);
      $addNewUser = "
        INSERT INTO users (id, name, email, pwd, phone, role)
        VALUES (NULL, :name, :email, :pwd, :phone, 'usr')
      ";
      DBConnection($addNewUser, [
        ':name' => $name,
        ':email' => $email,
        ':pwd' => $hashedPwd,
        ':phone' => $phone,
      ]);
      echo json_encode(['msg' => 'userAdded', 'token' => $token, 'pwd' => $hashedPwd]);
    } else if ($type === 'login') {
      $name = $decoded['name'];
      $pwd = $decoded['pwd'];
      $sql = "SELECT * FROM users WHERE name = :name";
      $res = DBConnection($sql, ['name' => $name]);

      if (!empty($res)) {
        $storedHash = $res[0]['pwd'];
        $val = password_verify($pwd, $storedHash);

        if ($val) {
          $user = [
            'name' => $res[0]['name'],
            'role' => $res[0]['role']
          ];
          $token = generateToken($user);

          echo json_encode([
            'msg' => 'loginSuccess',
            'token' => $token,
            'role' => $res[0]['role']
          ]);
        } else {
          echo json_encode(['msg' => 'invPwd']);
        }
      } else {
        echo json_encode(['msg' => 'invUsr']);
      }
    } else if ($type === 'contact') {
      $name = $decoded['user'];
      $phone = $decoded['phone'];
      $msg = $decoded['msg'];
      $subj = $decoded['subj'];
      $date = date('Y-m-d H:i:s');
      $sql = "
        INSERT INTO
          contacts (id, name, phone, msg, subj, date)
        VALUES
          (NULL, :name, :phone, :msg, :subj, :date)
      ";
      DBConnection($sql, [
        ':name' => $name,
        ':phone' => $phone,
        ':msg' => $msg,
        ':subj' => $subj,
        ':date' => $date
      ]);
      echo json_encode(['msg' => 'sent']);
    } else if ($type === 'getMsgs') {
      $sql = "
        SELECT
          *
        FROM
          contacts
      ";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'getOrders') {
      $sql = "SELECT * FROM orders";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'updateStatus') {
      $id = $decoded['id'];
      $status = $decoded['status'];
      $sql = "UPDATE `orders` SET `order_status` = :status WHERE `orders`.`order_id` = :id;";
      DBConnection($sql, [
        ':id' => $id,
        ':status' => $status
      ]);
      echo json_encode(['id' => $id, 'stat' => $status]);
    } else if ($type === 'checkToken') {
      $token = $decoded['token'];
      $tokenStat = tokenValidation($token);
      echo json_encode($tokenStat);
    } else if ($type === 'getAllUsers') {
      $sql = "
        SELECT
          id, name, phone, role, email
        FROM
          users
      ";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'upload') {
      $productName = $_POST['productName'] ?? '';
      $price = $_POST['price'] ?? '';
      $info = $_POST['info'] ?? '';
      $pType = $_POST['pType'] ?? '';
      $sql1 = "
        INSERT INTO templates (id, img, name, price, infos, product_type)
        VALUES (NULL, :img, :name, :price, :infos, :product_type)
      ";
      $sql2 = "
        INSERT INTO imgs (id, temp_id, img)
        VALUES (NULL, :temp_id, :img)
      ";
      $uploadDir = __DIR__ . '/upload/';
      if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
      }
      $templateFile = $_FILES['template'] ?? null;
      $templatePath = '';
      if ($templateFile && $templateFile['error'] === 0) {
        $templateName = uniqid('template_') . '_' . basename($templateFile['name']);
        $templatePath = 'upload/' . $templateName;
        move_uploaded_file($templateFile['tmp_name'], $uploadDir . $templateName);
      }
      $imagePaths = [];
      if (isset($_FILES['images'])) {
        foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
          if ($_FILES['images']['error'][$index] === 0) {
            $imageName = uniqid('img_') . '_' . basename($_FILES['images']['name'][$index]);
            $fullPath = $uploadDir . $imageName;
            move_uploaded_file($tmpName, $fullPath);
            $imagePaths[] = 'upload/' . $imageName;
          }
        }
      }
      try {
        $db = new PDO("mysql:host=localhost;dbname=zoksh_store", "root", "");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $db->prepare($sql1);
        $stmt->execute([
          ':img' => $templatePath,
          ':name' => $productName,
          ':price' => $price,
          ':infos' => $info,
          ':product_type' => $pType
        ]);
        $templateId = $db->lastInsertId();
      } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
      }
      foreach ($imagePaths as $imgPath) {
        DBConnection($sql2, [
          ':temp_id' => $templateId,
          ':img' => $imgPath
        ]);
      }
      echo json_encode(['msg' => 'uploaded']);
    } else if ($type === 'updateRole') {
      $id = $decoded['id'];
      $role = $decoded['newRole'];
      $sql = "UPDATE `users` SET `role` = :role WHERE `users`.`id` = :id";
      DBConnection($sql, [
        ':role' => $role,
        ':id' => $id
      ]);
    } else if ($type === 'getProducts') {
      $templates = DBConnection("SELECT id, img, name, price, infos, product_type FROM templates");
      $images = DBConnection("SELECT temp_id, img FROM imgs");
      foreach ($templates as &$template) {
        $template['temp'] = $template['img'];
        unset($template['img']);
        $matchedImgs = array_filter($images, function ($img) use ($template) {
          return $img['temp_id'] == $template['id'];
        });
        $template['imgs'] = array_values(array_map(function ($img) {
          return $img['img'];
        }, $matchedImgs));
      }
      echo json_encode($templates);
    } else if ($type === 'createOrder') {
      $product_id = $decoded['product_id'];
      $product_name = $decoded['product_name'];
      $price = $decoded['price'];
      $quantity = $decoded['quantity'];
      $client_name = $decoded['client_name'];
      $phone = $decoded['phone'];
      $gov = $decoded['gov'];
      $area = $decoded['area'];
      $location = $decoded['location'];
      $sql = "
        INSERT INTO orders (
          order_id, product_id,
          product_name, price,
          order_status, client_name, client_phone,
          location, gov, area, quantity
        ) VALUES (
          NULL, :product_id, :product_name,
          :price, 'pending',
          :client_name, :client_phone,
          :location, :gov, :area, :quantity
        )
      ";
      DBConnection($sql, [
        ':product_id' => $product_id,
        ':product_name' => $product_name,
        ':price' => $price,
        ':client_name' => $client_name,
        ':client_phone' => $phone,
        ':location' => $location,
        ':gov' => $gov,
        ':area' => $area,
        ':quantity' => $quantity
      ]);
      echo json_encode(['msg' => 'ordered']);
    } else if ($type === 'remvoeProduct') { 
      foreach ($decoded['data'] as $product) {
        $id = $product['id'];
        $temp = $product['temp'];
        $imgs = $product['imgs'];
    
        $sql1 = "DELETE FROM templates WHERE id = :id";
        $sql2 = "DELETE FROM imgs WHERE temp_id = :id";
    
        DBConnection($sql1, [':id' => $id]);
        DBConnection($sql2, [':id' => $id]);
    
        unlink("./$temp");
        foreach ($imgs as $img) {
          unlink("./$img");
        }
      }
      echo json_encode(['msg' => 'removed']);
    } else if ($type === 'editUpdate') {
      $id = $decoded['id'];
      $name = $decoded['name'];
      $price = $decoded['price'];
      $infos = $decoded['infos'];
      $sql = "
        UPDATE templates
        SET name = :name, price = :price, infos = :infos
        WHERE id = :id
      ";
      DBConnection($sql, [
        ':id' => $id,
        ':name' => $name,
        ':price' => $price,
        ':infos' => $infos
      ]);
      echo json_encode(['msg' => 'updated']);
    } else if ($type === 'getTypes') {
      $sql = "SELECT * FROM products_types";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'addCategory') {
      $name = $_POST['name'];
      $img = $_FILES['temp'];
      $currDir = __DIR__ . '/upload/';
      $uniqueName = "category_" . uniqid() . ".jpg";
      $filePath = $currDir . $uniqueName;
      $file = "./upload/" . $uniqueName;
      $sql = "
        INSERT INTO
        products_types (id, name, temp)
        VALUES (NULL, :name, :temp)
      ";
      if (!file_exists($currDir)) mkdir($currDir, 0777, true);

      move_uploaded_file($img['tmp_name'], $filePath);
      DBConnection($sql, [':name' => $name, ':temp' => $file]);

      echo json_encode(['msg' => 'added']);
    } else if ($type === 'cateDel') {
      $id = $decoded['id'];
      $sql1 = "SELECT name, temp FROM products_types WHERE id = :id";
      $sql2 = "DELETE FROM products_types WHERE id = :id";
      $sql3 = "SELECT id, img FROM templates WHERE product_type = :type";
      $sql4 = "DELETE FROM templates WHERE product_type = :type";
      $sql5 = "DELETE FROM imgs WHERE temp_id = :temp_id";
      $sql6 = "SELECT img FROM imgs WHERE temp_id = :temp_id";
      $result = DBConnection($sql1, [':id' => $id]);
      $productType = $result[0]['name'] ?? null;
      $categoryTempImg = $result[0]['temp'] ?? null;
      $basePath = realpath(__DIR__ . "/upload/");
      $templates = '';

      if (!$basePath)
        die(json_encode(['error' => 'Uploads directory not found']));

      if ($categoryTempImg) {
        $categoryImgPath = $basePath . '/' . basename($categoryTempImg);
        if (file_exists($categoryImgPath)) {
          unlink($categoryImgPath);
        }
      }

      if ($productType) {
        DBConnection($sql2, [':id' => $id]);
        $templates = DBConnection($sql3, [':type' => $productType]);
        DBConnection($sql4, [':type' => $productType]);

        foreach ($templates as $template) {
          $tempId = $template['id'];
          $imgs = DBConnection($sql6, [':temp_id' => $tempId]);
          unlink($template['img']);

          foreach ($imgs as $img) {
            $imgPath = $img['img'];
            $fullImgPath = $basePath . '/' . basename($imgPath);
            if (file_exists($fullImgPath)) {
              unlink($fullImgPath);
            }
          }
          DBConnection($sql5, [':temp_id' => $tempId]);
        }
      }
      echo json_encode(['msg' => 'deleted']);
    } else {
      echo json_encode($decoded);
    }
  }
  function DBConnection($sql, $bindings=[]) {
    $host = "zoksh.rf.gd";
    $dbname = "if0_38811111_zoksh_store";
    $username = "if0_38811111";
    $password = "DU9OhrTVWyOY";

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
  function generateToken($user, $secret_key = 'LMa@^A1&QN5Q@$mHKLShP&ktYrYkZRHV', $expiry_time = 3600) {
    $issuedAt = time();
    $expiration_time = ($issuedAt + $expiry_time) *24 * 30;

    $payload = [
      'iat' => $issuedAt,
      'exp' => $expiration_time,
      'data' => [
        'username' => $user['name'],
        'role' => $user['role']
      ]
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
  }
  function tokenValidation($token, $secret_key='LMa@^A1&QN5Q@$mHKLShP&ktYrYkZRHV') {
    try {
      $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
  
      return [
        'msg' => 'validToken',
        'username' => $decoded->data->username,
        'role' => $decoded->data->role
      ];
    } catch (Exception $e) {
      return ['msg' => 'invalidToken', 'error' => $e->getMessage()];
    }
  }
