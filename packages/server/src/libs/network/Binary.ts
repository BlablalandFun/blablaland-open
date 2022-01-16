import GP from "../GP.js";

const powList = (i: number): number => 2 ** i;

export default class Binary extends Array {
  bitPosition = 0;
  bitLength = 0;

  static Rshift(param1: number, param2: number): number {
    return Math.floor(param1 / powList(param2));
  }

  static Lshift(param1: number, param2: number): number {
    return param1 * powList(param2);
  }

  bitReadString(): string {
    let str = "";
    const strLen = this.bitReadUnsignedInt(16);
    for (let i = 0; i < strLen; i++) {
      let charCode = this.bitReadUnsignedInt(8);
      if (charCode === 255) {
        charCode = 8364;
      }
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  bitReadBoolean(): boolean {
    if (this.bitPosition === this.bitLength) {
      return false;
    }
    const bitFloor = Math.floor(this.bitPosition / 8);
    const bitPos = this.bitPosition % 8;
    this.bitPosition++;
    return ((this[bitFloor] >> (7 - bitPos)) & 1) === 1;
  }

  bitReadUnsignedInt(bits: number): number {
    if (this.bitPosition + bits > this.bitLength) {
      this.bitPosition = this.bitLength;
      return 0;
    }
    let value = 0;
    let loc3 = bits;
    while (loc3 > 0) {
      const loc4 = Math.floor(this.bitPosition / 8);
      const loc5 = this.bitPosition % 8;
      const loc6 = 8 - loc5;
      const loc7 = Math.min(loc6, loc3);
      const loc8 = (this[loc4] >> (loc6 - loc7)) & (powList(loc7) - 1);
      value += loc8 * powList(loc3 - loc7);
      loc3 -= loc7;
      this.bitPosition += loc7;
    }
    return value;
  }

  bitReadSignedInt(bits: number): number {
    const positive: boolean = this.bitReadBoolean();
    const value: number = this.bitReadUnsignedInt(bits - 1);
    return positive ? value : -value;
  }

  bitReadBinaryData() {
    const value: number = this.bitReadUnsignedInt(16);
    return this.bitReadBinary(value);
  }

  bitReadBinary(bits: number) {
    const res = new Binary();
    const bitPos = this.bitPosition;
    while (this.bitPosition - bitPos < bits) {
      if (this.bitPosition === this.bitLength) {
        return res;
      }
      const loc5 = Math.min(8, bits - this.bitPosition + bitPos);
      const val = this.bitReadUnsignedInt(loc5);
      res.bitWriteUnsignedInt(loc5, val);
    }
    return res;
  }

  bitWriteString(str: string): this {
    const size = Math.min(str.length, powList(16) - 1);
    this.bitWriteUnsignedInt(16, size);
    for (let i = 0; i < size; i++) {
      let loc4 = str.charCodeAt(i);
      if (loc4 === 8364) {
        loc4 = 255;
      }
      this.bitWriteUnsignedInt(8, loc4);
    }
    return this;
  }

  bitWriteSignedInt(bits: number, value: number): this {
    this.bitWriteBoolean(value >= 0);
    this.bitWriteUnsignedInt(bits - 1, Math.abs(value));
    return this;
  }

  bitWriteUnsignedInt(bits: number, value: number): this {
    value = Math.min(powList(bits) - 1, value);
    let loc3 = bits;
    while (loc3 > 0) {
      const loc4 = this.bitLength % 8;
      if (loc4 === 0) {
        this.push(0);
      }
      const loc5 = 8 - loc4;
      const loc6 = Math.min(loc5, loc3);
      const loc7 = Binary.Rshift(value, Number(loc3 - loc6));
      this[this.length - 1] += loc7 * powList(loc5 - loc6);
      value -= loc7 * powList(loc3 - loc6);
      loc3 -= loc6;
      this.bitLength += loc6;
    }
    return this;
  }

  bitWriteBoolean(value: boolean): this {
    const loc2: number = this.bitLength % 8;
    if (loc2 === 0) {
      this.push(0);
    }
    if (value) {
      this[this.length - 1] += powList(7 - loc2);
    }
    this.bitLength++;
    return this;
  }

  bitWriteBinaryData(binary: Binary | undefined): this {
    if (!binary) {
      binary = new Binary();
    }
    const loc2 = Math.min(binary.bitLength, powList(16) - 1);
    this.bitWriteUnsignedInt(16, loc2);
    this.bitWriteBinary(binary);
    return this;
  }

  bitWriteBinary(binary: Binary | undefined): this {
    if (!binary) {
      binary = new Binary();
    }
    binary.bitPosition = 0;
    let binarySize = binary.bitLength;
    while (binarySize) {
      const loc3 = Math.min(8, binarySize);
      const loc4 = binary.bitReadUnsignedInt(loc3);
      this.bitWriteUnsignedInt(loc3, loc4);
      binarySize -= loc3;
    }
    return this;
  }

  read(buffer: number[]): this {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 1) {
        i++;
        this.push(buffer[i] === 2 ? 1 : 0);
      } else {
        this.push(buffer[i]);
      }
    }
    this.bitLength = this.length * 8;
    return this;
  }

  export(): number[] {
    const buffer: number[] = [];
    this.forEach((byte) => {
      if (byte === 0 || byte === 1) {
        buffer.push(1, byte === 0 ? 3 : 2);
      } else {
        buffer.push(byte);
      }
    });
    return buffer;
  }
}

export class SocketMessage extends Binary {
  packetType?: number;
  packetSubType?: number;
  constructor(packetType?: number, packetSubType?: number) {
    super();
    if (packetType !== undefined && packetSubType !== undefined) {
      this.packetType = packetType;
      this.packetSubType = packetSubType;
      this.bitWriteUnsignedInt(GP.BIT_TYPE, packetType);
      this.bitWriteUnsignedInt(GP.BIT_STYPE, packetSubType);
    }
  }

  duplicate(): SocketMessage {
    const loc = new SocketMessage();
    loc.push(...this);
    loc.bitLength = this.bitLength;
    loc.bitPosition = this.bitPosition;
    return loc;
  }

  readMessage(buffer: number[]) {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 1) {
        i++;
        this.push(buffer[i] === 2 ? 1 : 0);
      } else {
        this.push(buffer[i]);
      }
    }
    this.bitLength = this.length * 8;
    return this;
  }

  exportMessage() {
    const buffer: number[] = [];
    this.forEach((byte) => {
      if (byte === 0 || byte === 1) {
        buffer.push(1, byte === 0 ? 3 : 2);
      } else {
        buffer.push(byte);
      }
    });
    return buffer;
  }
}
