export class BaseModel {
  public constructor(partial: Partial<BaseModel>) {
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.deletedAt = partial.deletedAt;
  }

  public createdAt: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
}
