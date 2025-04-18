// user.repository.interface.ts
export interface IUserRepository {
  create(user: any): Promise<any>;
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  update(id: number, user: any): Promise<any>;
  delete(id: number): Promise<any>;
}
