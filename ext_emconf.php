<?php

/**
 * Extension Manager/Repository config file for ext "advent_game".
 */
$EM_CONF[$_EXTKEY] = [
    'title' => 'Advent Game',
    'description' => '',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '12.4.0-12.4.99',
            'fluid_styled_content' => '12.4.0-12.4.99',
            'rte_ckeditor' => '12.4.0-12.4.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'Privat\\AdventGame\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Renate',
    'author_email' => 'Renate.Magiera.u@gmail.com',
    'author_company' => 'Privat',
    'version' => '1.0.0',
];
