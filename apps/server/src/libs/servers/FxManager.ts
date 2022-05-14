import { FxChangeOptions, FxOptions } from "../../types/server";
import Binary from "../network/Binary.js";

export default class FxManager {
  readonly #objectId?: number;
  readonly #fxFileId?: number;

  readonly #fxSid: number;
  readonly #fxId: number;

  readonly #binData = new Binary();

  #options: FxOptions = {};

  constructor(options: FxChangeOptions) {
    this.#objectId = options.object?.objectId;
    this.#fxFileId = options.object?.fxFileId;
    this.#fxSid = options.fxSid;
    this.#binData = options.binData ?? new Binary();
    this.#fxId = options.fxId;
  }

  set options(value: FxOptions) {
    this.#options = value;
  }

  get options() {
    return this.#options;
  }

  get objectId() {
    return this.#objectId;
  }

  get fxFileId() {
    return this.#fxFileId;
  }

  get fxSid() {
    return this.#fxSid;
  }

  get fxId() {
    return this.#fxId;
  }

  get binData() {
    return this.#binData;
  }
}
