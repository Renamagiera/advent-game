/*!
 * Advent Game v1.0.0 (https://www.bht-berlin.de/)
 * Copyright 2017-2023 Renate
 * Licensed under the GPL-2.0-or-later license
 */

const innerWidthCalc = () => {
    return innerWidth >= 500 ? 500 : innerWidth;
};

const innerHeightCalc = () => {
    return innerHeight >= 800 ? 800 : innerHeight;
};

const config = {
    type: Phaser.CANVAS,
    width: innerWidthCalc(),
    height: innerHeightCalc(),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true
        }
    },
    scene: [Game]
};

let game = new Phaser.Game(config);


