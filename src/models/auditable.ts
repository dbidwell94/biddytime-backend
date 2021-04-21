export default abstract class Auditable {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly id: number;

  constructor(id: number, createdAt: Date, updatedAt: Date) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.id = id;
  }
}
