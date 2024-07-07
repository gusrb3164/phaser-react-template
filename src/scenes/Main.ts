import {Unit} from '../classes/Unit';
import {VIEW_SIZE} from '../constants/config';

export class Main extends Phaser.Scene {
  myCastle: Phaser.GameObjects.Image;
  enemyCastle: Phaser.GameObjects.Image;
  enemies: Phaser.Physics.Arcade.Sprite[] = [];
  allys: Phaser.Physics.Arcade.Sprite[] = [];

  preload() {
    this.load.image('tile', 'assets/tile.png');
    this.load.image('castle', 'assets/castle.png');
    this.load.spritesheet('unit', 'assets/unit-walk.png', {frameWidth: 732, frameHeight: 733});
    this.load.spritesheet('unit-die', 'assets/unit-die.png', {frameWidth: 732, frameHeight: 733});
    this.load.spritesheet('unit-attack', 'assets/unit-attack.png', {frameWidth: 732, frameHeight: 733});
  }

  create() {
    this.anims.create({
      key: 'unit-walk-anim',
      frames: this.anims.generateFrameNumbers('unit', {start: 0, end: 15}),
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: 'unit-attack-anim',
      frames: this.anims.generateFrameNumbers('unit-attack', {start: 0, end: 15}),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: 'unit-die-anim',
      frames: this.anims.generateFrameNumbers('unit-die', {start: 0, end: 15}),
      frameRate: 15,
      repeat: 0,
    });

    const tileSize = 40;
    for (let y = 0; y < VIEW_SIZE.y; y += tileSize) {
      for (let x = 0; x < VIEW_SIZE.x; x += tileSize) {
        this.add.image(x, y, 'tile').setOrigin(0);
      }
    }

    this.addMyCastle();
    this.addEnemyCastle();
    this.enemies = [
      this.spawn(this.enemyCastle, 'enemy'),
      this.spawn(this.enemyCastle, 'enemy'),
      this.spawn(this.enemyCastle, 'enemy'),
    ];
  }

  removeUnit(unit: Unit) {
    if (unit.type === 'ally') {
      this.allys = this.allys.filter(ally => ally !== unit);
    } else {
      this.enemies = this.enemies.filter(enemy => enemy !== unit);
    }
  }

  spawn(spot: {x: number; y: number}, type: 'ally' | 'enemy') {
    const random = Phaser.Math.Between(0, 200);

    const unit = new Unit(this, spot.x + random, spot.y + random, 'unit', type);

    return unit;
  }

  addMyCastle() {
    this.myCastle = this.add
      .image(100, VIEW_SIZE.y / 2 - 40, 'castle')
      .setScale(0.1)
      .setOrigin(0);
    this.myCastle.setInteractive();
    this.myCastle.on('pointerdown', () => {
      this.allys.push(this.spawn(this.myCastle, 'ally'));
    });
  }

  addEnemyCastle() {
    this.enemyCastle = this.add
      .image(650, VIEW_SIZE.y / 2 - 40, 'castle')
      .setScale(0.1)
      .setOrigin(0);
  }

  update(time: number, delta: number) {
    this.enemies.forEach(enemy => {
      enemy.update(time, delta, this.allys);
    });

    this.allys.forEach(ally => {
      ally.update(time, delta, this.enemies);
    });
  }
}
