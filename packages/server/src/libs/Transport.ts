interface TransportValue {
  time: number;
  value: number
}

export class Transport {
  readonly maps: number[] = []
  readonly values: TransportValue[] = []

  constructor(readonly id: number) {
    if (id === 1) {
      this.maps.push(104, 167, 176, 27)
      this.values.push(...[
        { time: 0, value: 0 },
        { time: 5, value: 0 },
        { time: 20, value: 1 },
        { time: 5, value: 1 },
        { time: 20, value: 2 },
        { time: 5, value: 2 },
        { time: 20, value: 3 },
        { time: 5, value: 3 },
        { time: 20, value: 2 },
        { time: 5, value: 2 },
        { time: 20, value: 1 },
        { time: 5, value: 1 },
        { time: 20, value: 0 }
      ])
    }
  }
}