export class HealthBar {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private value: number;
  private width: number;
  private height: number;
  private bar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.value = 100;
    this.width = width;
    this.height = height;
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.draw();
    scene.add.existing(this.bar);
  }

  destroy() {
    this.bar.destroy();
  }

  draw() {
    this.bar.clear();

    // 배경
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, this.width, this.height);

    // 체력
    this.bar.fillStyle(0x00ff00);
    this.bar.fillRect(this.x + 2, this.y + 2, (this.width - 4) * (this.value / 100), this.height - 4);
  }

  updateHealth(value: number) {
    this.value = value < 0 ? 0 : value;
    this.draw();
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw();
  }
}
