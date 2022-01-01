class LimitedInteger {

  initialValue: number;

  constructor (
    private value: number,
    private max: number,
  ) {
    this.initialValue = value;
  }

  public increment(): number {
    if (this.value + 1 > this.max) {
      this.value = this.initialValue;
      return this.value;
    }
    return ++this.value;
  }
}

test("limited_integer", () => {
  const limitedInteger = new LimitedInteger(2, 5)
  expect(limitedInteger.increment()).toBe(3)
  expect(limitedInteger.increment()).toBe(4)
  expect(limitedInteger.increment()).toBe(5)
  expect(limitedInteger.increment()).toBe(2)
})

test("limited_integer_zero", () => {
  const limitedInteger = new LimitedInteger(0, 3)
  expect(limitedInteger.increment()).toBe(1)
  expect(limitedInteger.increment()).toBe(2)
  expect(limitedInteger.increment()).toBe(3)
  expect(limitedInteger.increment()).toBe(0)
})

export {}