<?php
function loadEnv($path = __DIR__ . '/../.env') {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (trim($line)[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = array_map('trim', explode('=', $line, 2));
        $value = trim($value, '"\'');
        $_ENV[$name] = $value;
    }
}
loadEnv();

function env($key, $default = null) {
    return $_ENV[$key] ?? $default;
}