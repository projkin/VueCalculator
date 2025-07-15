<?php
// Файл: api/submit-order.php

// --- Настройки для разработки ---
// Разрешаем кросс-доменные запросы (CORS) от любого источника.
// ВАЖНО: Для продакшена замените '*' на домен вашего фронтенда, например, 'https://your-calculator-app.com'
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Если это preflight-запрос (OPTIONS), просто выходим.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// --- Основная логика ---

// Устанавливаем заголовок, что наш ответ будет в формате JSON
header('Content-Type: application/json');

// 1. Проверяем, что это POST-запрос
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Метод не поддерживается. Ожидается POST.']);
    exit();
}

// 2. Получаем сырые данные из тела запроса
$json_data = file_get_contents('php://input');

// 3. Декодируем JSON в ассоциативный массив PHP
// Второй аргумент `true` преобразует объекты JSON в ассоциативные массивы
$data = json_decode($json_data, true);

// 4. Проверяем, что JSON был корректным
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Некорректный JSON в теле запроса.']);
    exit();
}

// 5. (Опционально, но рекомендуется) Валидация данных
// Здесь вы можете проверить, что все необходимые поля присутствуют
if (!isset($data['orderForm']) || !isset($data['cart'])) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Отсутствуют обязательные данные заказа.']);
    exit();
}

// --- Обработка данных ---
// На этом этапе у вас есть все данные в переменной $data
$orderForm = $data['orderForm'];
$cart = $data['cart'];

// Что делать с данными дальше?
// 1. Сохранить в базу данных.
// 2. Отправить email-уведомление менеджеру.
// 3. Отправить SMS-уведомление клиенту.
// 4. Интегрироваться с CRM-системой.

// Для примера, просто запишем их в лог-файл
$log_dir = __DIR__ . '/../log';
if (!is_dir($log_dir)) {
    mkdir($log_dir, 0777, true);
}
$log_file = $log_dir . '/orders.log';
$log_message = "Новый заказ от " . date('Y-m-d H:i:s') . ":\n";
$log_message .= print_r($data, true); // print_r с `true` возвращает строку
file_put_contents($log_file, $log_message);



// --- Отправка успешного ответа ---
http_response_code(200); // 200 OK
echo json_encode([
    'status' => 'success',
    'message' => 'Заказ успешно принят!',
    'received_data' => $data // Можно вернуть принятые данные для отладки
]);

?>