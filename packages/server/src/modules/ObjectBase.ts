import { ObjectHandlerOptions } from "../types/user.js";

export interface ObjectBase {
  objectId: number | number[];

  /**
   * Permet de s'occuper des packets reçus
   */
  handle(options: ObjectHandlerOptions): Promise<boolean>;
}
