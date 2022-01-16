export class LimitedInteger {
  readonly #initialValue: number;

  constructor(private _value: number, private readonly max: number) {
    this.#initialValue = _value;
  }

  public get value(): number {
    return this._value;
  }

  public increment(): number {
    if (this._value + 1 > this.max) {
      this._value = this.#initialValue;
      return this._value;
    }
    return ++this._value;
  }
}
