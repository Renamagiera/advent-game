class Game extends Phaser.Scene{

    // idea: set static y-coordinates, where blocks can be added easy, like levels
    /***
     * level fin
     * level 1 blocks
     * level 0 blocks
     * ***/

    GAME_WIDTH = window.innerWidth;
    GAME_HEIGHT = window.innerHeight;
    SHIFT_DOWN_FILLER = 50;
    FILLER_HEIGHT;
    FILLER_TOP_Y;
    VELOCITY = 100;
    BLOCK_SCALE = .2;
    MOUSE_WIDTH;
    MOUSE_HEIGHT;
    MOUSE_SCALE_BODY = .2;
    MOUSE_SCALE_HIT_BOX = 1;
    constructor() {
        super();
    }

    preload ()
    {


        this.load.image("sky", "fileadmin/assets/sky.jpg");
        this.load.image('very_small_block', 'fileadmin/assets/block.png');
        this.load.image('small_block', 'fileadmin/assets/small_block.png');
        this.load.image('middle_block', 'fileadmin/assets/middle_block.png');
        this.load.image('ground', 'fileadmin/assets/filledGround.png');
        this.load.image('left', 'fileadmin/assets/left.png');
        this.load.image('jump', 'fileadmin/assets/jump.png');
        this.load.image('right', 'fileadmin/assets/right.png');
        this.load.spritesheet('mouse3', 'fileadmin/assets/mouse_color_6_fr.png', {
            frameWidth: 300,
            frameHeight: 205
        });
    }

    create()
    {
        // help functions / debug / variables
        const percentage = (percent) => {return (this.GAME_WIDTH / 100) * percent;}
        this.physics.world.debugDraw = true;
        let small_block_width = this.textures.get("small_block").getSourceImage().width*this.BLOCK_SCALE;
        let small_block_height = this.textures.get("small_block").getSourceImage().height*this.BLOCK_SCALE;
        let middle_block_width = this.textures.get("middle_block").getSourceImage().width*this.BLOCK_SCALE;
        let middle_block_height = this.textures.get("middle_block").getSourceImage().height*this.BLOCK_SCALE;

        // add sky
        this.sky = this.add.image(200, 200, 'sky').setScale(.5);

        // add player
        this.mouse = this.physics.add.sprite(100, 300, 'mouse3');
        this.MOUSE_WIDTH = this.mouse.getBounds().width;
        this.MOUSE_HEIGHT = this.mouse.getBounds().height;
        this.mouse.body.velocity.x = this.VELOCITY;
        this.mouse
            .setCollideWorldBounds(true)
            .setScale(this.MOUSE_SCALE_BODY)
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
        let hitBoxShape = new Phaser.Geom.Rectangle(0, 0, 100, 100); // Beispiel: Rechteckform
        this.mouse.setInteractive(hitBoxShape, Phaser.Geom.Rectangle.Contains);

        // add platform
        this.ground = this.add.image(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT + this.SHIFT_DOWN_FILLER,
            "ground")
            .setScale(.8);
        this.physics.world.enable(this.ground, Phaser.Physics.Arcade.STATIC_BODY);
        this.platforms = this.physics.add.staticGroup();
        this.FILLER_HEIGHT = this.ground.getBounds().height;
        this.FILLER_TOP_Y = this.GAME_HEIGHT - this.FILLER_HEIGHT / 2 + this.SHIFT_DOWN_FILLER
        this.LEVEL1_Y = this.FILLER_TOP_Y - percentage(15);
        this.LEVEL2_Y = this.FILLER_TOP_Y - percentage(30) - small_block_height;
        this.LEVEL3_Y = this.FILLER_TOP_Y - percentage(45) - small_block_height*2;
        this.LEVEL4_Y = this.FILLER_TOP_Y - percentage(60) - small_block_height*3;

        this.createPlatform(this.GAME_WIDTH - percentage(10), this.LEVEL1_Y);
        console.log(this.GAME_WIDTH - percentage(10));
        this.createPlatform(small_block_width + percentage(10), this.LEVEL2_Y);
        this.createPlatform(this.GAME_WIDTH - percentage(10), this.LEVEL3_Y);
        this.createPlatform(small_block_width + percentage(10), this.LEVEL4_Y);

        // add button left
        this.add.image(
            this.GAME_WIDTH / 5,
            this.GAME_HEIGHT - (this.GAME_HEIGHT / 10),
            'left')
            .setScale(.25)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityDirectionMouse("left");
            });
        // add button right
        this.add.image(
            this.GAME_WIDTH - (this.GAME_WIDTH / 5),
            this.GAME_HEIGHT - (this.GAME_HEIGHT / 10),
            'right')
            .setScale(.25)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityDirectionMouse("right");
            });
        // add button middle
        this.add.image(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT - (this.GAME_HEIGHT / 10),
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
    }

    update() {
        // things are happening constantly
        // check if mouse is colliding world bounds, change velocity. Add hit box offset
        let hit_box_offset = ((this.MOUSE_WIDTH - (this.MOUSE_WIDTH*this.MOUSE_SCALE_HIT_BOX)) / 2) * this.MOUSE_SCALE_BODY;

        // pivot point left
        if (this.mouse.x <= 0 - hit_box_offset) this.mouse.setVelocityX(this.VELOCITY);
        if (this.mouse.x >= (this.GAME_WIDTH - this.MOUSE_WIDTH * this.MOUSE_SCALE_BODY) + hit_box_offset) this.mouse.setVelocityX(-this.VELOCITY);

/*        // pivot point right
        if (this.mouse.x <= this.MOUSE_WIDTH * this.MOUSE_SCALE_BODY - hit_box_offset) this.mouse.setVelocityX(this.VELOCITY);
        if (this.mouse.x >= this.GAME_WIDTH + hit_box_offset) this.mouse.setVelocityX(-this.VELOCITY);*/

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

    createPlatform(x, y, block="small_block") {
        this.platforms.create(
            x,
            y,
            block)
            .setScale(this.BLOCK_SCALE)
            .setOrigin(1, 1)
            .refreshBody();
    }

}



