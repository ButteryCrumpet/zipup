<?php

class FSDirectory
{
    public $name;
    public $dirs = array();
    public $files = array();

    public function __construct($path)
    {
        $dir = new SplFileInfo($path);

        if (!$dir->isDir()) {
            throw new \InvalidArgumentException("dum");
        }

        $this->name = $dir->getFilename();
        $iter = new DirectoryIterator($dir->getRealPath());

        foreach ($iter as $file) {
            if ($file->isDot()) {
                continue;
            }
            if ($file->isFile()) {
                $this->files[] = $file->getFilename();
            } elseif ($file->isDir()) {
                $this->dirs[] = new FSDirectory($file->getRealPath());
            }
        }
    }

    public function format($depth = 0)
    {
        $prefix = str_repeat("-", $depth + 1);
        echo str_repeat("-", $depth) . $this->name . "\n";
        foreach ($this->dirs as $dir) {
            echo $dir->format($depth + 1);
        }
        foreach ($this->files as $file) {
            echo $prefix . $file . "\n";
        }
    }

    public function formatJson()
    {
        echo json_encode($this);
    }

    public function formatHtml()
    {
        ?>
        <div class="dir">
            <p><?= $this->name ?></p>
            <ul>
                <li class="dir">
                    <?php foreach ($this->dirs as $dir) {
                        echo $dir->formatHtml();
                    }; ?>
                </li>
                <?php foreach ($this->files as $file) : ?>
                <li class="file"><?= $file ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php
    }
}

$fs = new FSDirectory("../");
?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <style>
        ul {
            list-style: none;
            display: none;
        }
        .dir > p {
            color: seagreen;
            border-bottom: solid 1px black;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div>
        <?php $fs->formatHtml(); ?>
    </div>
    <script>
        document.querySelectorAll(".dir")
          .forEach(e => {
            const ul = e.querySelector("ul");
            const p = e.querySelector("p");
            if (p) {
              p.addEventListener("click", _ =>
                ul.style.display = (ul.style.display === "none") ? "block" : "none"
              )
            }
          });

    </script>
</body>
</html>