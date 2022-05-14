import Binary from "../network/Binary";

export default class SkinColor {
  static nbSlot = 10;

  static exportBinaryColor(binary: Binary, skinColor: number[]) {
    for (let i = 0; i < SkinColor.nbSlot; i++) {
      binary.bitWriteUnsignedInt(8, skinColor[i]);
    }
  }

  static readBinaryColor(binary: Binary): number[] {
    const colors: number[] = [];
    for (let i = 0; i < SkinColor.nbSlot; i++) {
      colors.push(binary.bitReadUnsignedInt(8));
    }
    return colors;
  }
}
