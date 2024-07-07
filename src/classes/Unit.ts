import {TIME_TO_MILLI} from '../constants/time';
import {HealthBar} from './HealthBar';

export class Unit extends Phaser.Physics.Arcade.Sprite {
  speed: number = 50;
  attackRange: number = 100;
  attackDamage: number = 10;
  attackSpeed: number = 1;
  lastAttackTime: number = 0;
  isAttacking: boolean = false;
  type: 'ally' | 'enemy';
  healthBar: HealthBar;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: 'ally' | 'enemy') {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.setDisplaySize(100, 100);
    this.setData('health', 100);
    this.type = type;
    this.healthBar = new HealthBar(scene, x - 15, y - 60, 50, 10);

    this.play('unit-walk-anim');
  }
  private getClosestEnemy(
    enemies: Phaser.Physics.Arcade.Sprite[],
  ): {enemy: Phaser.Physics.Arcade.Sprite; distance: number} | null {
    let closestEnemy: Phaser.Physics.Arcade.Sprite | null = null;
    let closestDistance = Infinity;

    enemies.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    });

    if (closestEnemy === null) return null;

    return {enemy: closestEnemy, distance: closestDistance};
  }

  private moveToTarget(enemy: Phaser.Physics.Arcade.Sprite): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;
    this.setVelocity(velocityX, velocityY);
    if (velocityX < 0) {
      this.setFlipX(true);
      this.setRotation(angle + Math.PI);
    } else {
      this.setFlipX(false);
      this.setRotation(angle);
    }
  }

  private updateHealthBar(): void {
    this.healthBar.updateHealth(this.getData('health'));
    this.healthBar.setPosition(this.x - 15, this.y - 60);
  }

  update(time: number, delta: number, enemies: Phaser.Physics.Arcade.Sprite[]): void {
    this.updateHealthBar();
    if (this.getData('health') <= 0) {
      this.die();
      return;
    }

    const closestEnemyInfo = this.getClosestEnemy(enemies);
    if (!closestEnemyInfo) return;

    if (closestEnemyInfo.distance < this.attackRange) {
      if (!this.isAttacking) {
        this.moveStop();
        this.isAttacking = true;
      }
      this.attack(closestEnemyInfo.enemy, time);
    } else {
      if (this.isAttacking) {
        this.isAttacking = false;
      }
      this.moveToTarget(closestEnemyInfo.enemy);
    }
  }

  private moveStop(): void {
    this.setVelocity(0, 0);
  }

  private die(): void {
    this.scene.removeUnit(this);
    this.play('unit-die-anim').on('animationcomplete', () => {
      this.destroy();
      this.healthBar.destroy();
    });
  }

  private attack(enemy: Phaser.Physics.Arcade.Sprite, time: number): void {
    if (time - this.lastAttackTime < this.attackSpeed * TIME_TO_MILLI.SECOND) return;

    this.play('unit-attack-anim');
    this.lastAttackTime = time;
    enemy.setData('health', enemy.getData('health') - this.attackDamage);
  }
}
