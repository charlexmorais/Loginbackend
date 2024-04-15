export interface InterfaceCrud<DTO> {
  getAll(): Promise<DTO[]>;
  find(id1: string, id2: string): Promise<DTO | null>;
  create(payload: DTO): Promise<DTO>;
  update(id: string, payload: DTO): Promise<DTO>;
  delete(id: string): Promise<void>;
}

