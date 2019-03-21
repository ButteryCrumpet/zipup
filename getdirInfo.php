<?php

header("Access-Control-Allow-Origin: *");

if (isset($argv[1])) {
    $_GET = [];
    $_GET["dir"] = $argv[1];
}

if (!isset($_GET["dir"])) {
    http_response_code(400);
    echo json_encode([
        "code" => 400,
        "error" => "dir must be set"
    ]);
    die();
}

$info = new SplFileInfo($_GET["dir"]);

if (!$info->isDir()) {
    http_response_code(404);
    echo json_encode([
        "code" => 404,
        "error" => "Directory '" . $_GET["dir"] . "' does not exists"
    ]);
    die();
}

$iter = new DirectoryIterator($info->getRealPath());

$result = [];
$result["name"] = $iter->getRealPath();
$result["size"] = $iter->getSize();
$result["files"] = [];
$result["dirs"] = [];
foreach ($iter as $file) {
    if ($file->isDot()) {
        continue;
    }
    if ($file->isFile()) {
        $result["files"][] = [$file->getRealPath(), $file->getSize()];
    }
    if ($file->isDir()) {
        $result["dirs"][] = [$file->getRealPath(), $file->getSize()];
    }
}

echo json_encode($result);