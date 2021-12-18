export class LimitedInteger {

  readonly #initialValue: number;

  constructor (
    private value: number,
    private readonly max: number,
  ) {
    this.#initialValue = value;
  }

  public increment(): number {
    if (this.value + 1 > this.max) {
      this.value = this.#initialValue;
      return this.value;
    }
    return ++this.value;
  }
}