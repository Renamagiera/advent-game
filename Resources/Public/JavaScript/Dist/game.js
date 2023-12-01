class Game extends Phaser.Scene{
    VELOCITY = 100;
    MOUSE_WIDTH;
    MOUSE_HEIGHT;
    MOUSE_SCALE_HIT_BOX = 1;
    DEFAULT_PIVOT_Y = 1;

    constructor() {
        super();
        this.gameWidth = config.width;
        this.gameHeight = config.height;
        this.mouseSpriteHeight = 205;
        this.mouseSpriteWidth = 300;
        this.mouseScale = .2;
        this.mouseScaledHeight = this.mouseSpriteHeight * this.mouseScale;
        this.mouseScaledWidth = this.mouseSpriteWidth * this.mouseScale;
        this.blockHeight = 125;
        this.blockScale = .2;
        this.blockScaledHeight = this.blockHeight * this.blockScale;
        this.spaceToWall = this.mouseScaledWidth * .6;
        this.levelGround = this.gameHeight - this.percentageHeight(20);
        this.levelOne = this.levelGround - this.mouseScaledHeight;
        this.levelTwo = this.levelOne - this.mouseScaledHeight*1.4 - this.blockScaledHeight;
        this.levelThree = this.levelTwo - this.mouseScaledHeight*1.4 - this.blockScaledHeight;
        this.levelFour = this.levelThree - this.mouseScaledHeight*1.4 - this.blockScaledHeight;
        this.levelFive = this.levelFour - this.mouseScaledHeight*1.4 - this.blockScaledHeight;
    }

    percentageHeight(percent) {return (this.gameHeight / 100) * percent;}
    spaceToPlatform() {return this.mouseScaledHeight*1.4 - this.blockScaledHeight;}

    preload()
    {
        this.load.image("sky", "fileadmin/assets/sky.jpg");
        this.load.image('very_small_block', 'fileadmin/assets/block.png');
        this.load.image('small_block', 'fileadmin/assets/small_block.png');
        this.load.image('middle_block', 'fileadmin/assets/middle_block.png');
        this.load.image('ground', 'fileadmin/assets/filledGround.png');
        this.load.image('left', 'fileadmin/assets/left.png');
        this.load.image('jump', 'fileadmin/assets/jump.png');
        this.load.image('right', 'fileadmin/assets/right.png');
        this.load.spritesheet('cheese', 'fileadmin/assets/cheese.png', {
            frameWidth: 450,
            frameHeight: 380
        });
        this.load.spritesheet('mouse3', 'fileadmin/assets/mouse_color_6_fr.png', {
            frameWidth: this.mouseSpriteWidth,
            frameHeight: this.mouseSpriteHeight
        });
        this.load.spritesheet('star', 'fileadmin/assets/star.png', {
            frameWidth: 130,
            frameHeight: 150
        });
    }

    create()
    {
        // add sky
        this.sky = this.add.image(200, 200, 'sky').setScale(.5);

        // add star
        this.star = this.physics.add.sprite(this.gameWidth / 2, 500, "star");
        this.star
            .setCollideWorldBounds(true)
            .setScale(.2);
        this.anims.create({
            key: "star_rotation",
            frames: this.anims.generateFrameNumbers("star", { start: 0, end: 11}),
            frameRate: 7,
            repeat: -1
        });
        this.star.play("star_rotation");

        // add player
        this.mouse = this.physics.add.sprite(100, 300, 'mouse3');
        this.MOUSE_WIDTH = this.mouse.getBounds().width;
        this.MOUSE_HEIGHT = this.mouse.getBounds().height;
        this.mouse.body.velocity.x = this.VELOCITY;
        this.mouse
            .setCollideWorldBounds(true)
            .setScale(this.mouseScale)
            .setOrigin(0, 0);

        // set hitBox a little smaller in x-axe
        //this.mouse.setSize(this.MOUSE_WIDTH * this.MOUSE_SCALE_HIT_BOX, this.MOUSE_HEIGHT);
        this.anims.create({
            key: "mouse_walk",
            frames: this.anims.generateFrameNumbers("mouse3", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.mouse.play("mouse_walk");
        //this.mouse.body.setGravityY(300)

        // add ground
        this.ground = this.add.image(
            this.gameWidth / 2,
            this.levelGround,
            "ground")
            .setScale(.7)
            .setOrigin(.5, 0);

        // add platforms
        this.physics.world.enable(this.ground, Phaser.Physics.Arcade.STATIC_BODY);
        this.platforms = this.physics.add.staticGroup();

        this.createPlatform(this.gameWidth - this.spaceToWall, this.levelOne, "right");
        this.createPlatform(this.spaceToWall, this.levelTwo, "left");
        this.createPlatform(this.gameWidth - this.spaceToWall, this.levelThree, "right");
        this.createPlatform(this.spaceToWall, this.levelFour, "left");
        this.createPlatform(this.gameWidth - this.spaceToWall, this.levelFive, "right");

        // add cheese
        this.cheese = this.physics.add.sprite(this.gameWidth - this.spaceToWall, this.levelFive - this.blockScaledHeight, "cheese");
        this.cheese
            .setCollideWorldBounds(true)
            .setScale(.1)
            .setOrigin(1, this.DEFAULT_PIVOT_Y)
            .refreshBody();

        // add button left
        this.add.image(
            this.gameWidth / 5,
            this.gameHeight - (this.gameHeight / 10),
            'left')
            .setScale(.25)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityDirectionMouse("left");
            });
        // add button right
        this.add.image(
            this.gameWidth - (this.gameWidth / 5),
            this.gameHeight - (this.gameHeight / 10),
            'right')
            .setScale(.25)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityDirectionMouse("right");
            });
        // add button middle
        this.add.image(
            this.gameWidth / 2,
            this.gameHeight - (this.gameHeight / 10),
            'jump')
            .setScale(.25)
            .setInteractive()
            .on('pointerdown', () => {
                this.jump();
            });

        // collider
        this.physics.add.collider(this.mouse, this.ground);
        this.physics.add.collider(this.mouse, this.platforms, () => {
            if (this.mouse.body.touching.left) this.mouse.setVelocityX(this.VELOCITY);
            else if (this.mouse.body.touching.right) this.mouse.setVelocityX(-this.VELOCITY);
        }, null, this);
        this.physics.add.collider(this.star, this.ground);
        this.physics.add.collider(this.star, this.platforms);
        this.physics.add.collider(this.cheese, this.ground);
        this.physics.add.collider(this.cheese, this.platforms);
    }

    update() {
        // things are happening constantly
        // check if mouse is colliding world bounds, change velocity. Add hit box offset
        let hit_box_offset = ((this.MOUSE_WIDTH - (this.MOUSE_WIDTH*this.MOUSE_SCALE_HIT_BOX)) / 2) * this.mouseScale;

        // pivot point left
        if (this.mouse.x <= 0 - hit_box_offset) this.mouse.setVelocityX(this.VELOCITY);
        if (this.mouse.x >= (this.gameWidth - this.MOUSE_WIDTH * this.mouseScale) + hit_box_offset) this.mouse.setVelocityX(-this.VELOCITY);

/*        // pivot point right
        if (this.mouse.x <= this.MOUSE_WIDTH * this.mouseScale - hit_box_offset) this.mouse.setVelocityX(this.VELOCITY);
        if (this.mouse.x >= this.gameWidth + hit_box_offset) this.mouse.setVelocityX(-this.VELOCITY);*/

        // check mouse velocity x and flip, if she is running to the left
        if (this.mouse.body.velocity.x > 0) this.mouse.setFlipX(false);
        else if (this.mouse.body.velocity.x < 0) this.mouse.setFlipX(true);
    }

    jump() {
        if (this.mouse.body.touching.down) this.mouse.setVelocityY(-350);
    }

    setVelocityDirectionMouse(value) {
        value === "left" ? this.mouse.setVelocityX(-this.VELOCITY) : this.mouse.setVelocityX(this.VELOCITY);
    }

    createPlatform(x, y, pivot, block="small_block") {
        let pivotX;
        pivot === "left" ? pivotX = 0 : pivotX = 1;
            this.platforms.create(
            x,
            y,
            block)
            .setScale(this.blockScale)
            .refreshBody()
            .setOrigin(pivotX, this.DEFAULT_PIVOT_Y)
            .refreshBody();
    }

}



