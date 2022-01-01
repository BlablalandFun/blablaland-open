import GP from "../GP.js"
import Binary from "../network/Binary.js"
import SkinColor from "./SkinColor.js"

export default class Walker {

  sex = 0

  jump = 0
  walk = 0
  shiftKey = false
  direction = false
  onFloor = false
  underWater = false
  grimpe = false
  accroche = false
  surfaceBody = 0
  dodo = false

  positionX = 0
  positionY = 0

  speedX = 0
  speedY = 0

  skinColor: number[] = Array(10).fill(0)

  skinId = 7

  exportStateToMessage(binary: Binary) {
    binary.bitWriteSignedInt(2, this.jump)
    binary.bitWriteSignedInt(2, this.walk)
    binary.bitWriteBoolean(this.shiftKey)
    binary.bitWriteBoolean(this.direction)
    binary.bitWriteBoolean(this.onFloor)
    binary.bitWriteBoolean(this.underWater)
    binary.bitWriteBoolean(this.grimpe)
    binary.bitWriteBoolean(this.accroche)

    binary.bitWriteBoolean(true)
    binary.bitWriteSignedInt(21, this.positionX * 100)
    binary.bitWriteSignedInt(21, this.positionY * 100)
    binary.bitWriteUnsignedInt(8, this.surfaceBody)
    binary.bitWriteSignedInt(18, this.speedX)
    binary.bitWriteSignedInt(18, this.speedY)

    binary.bitWriteBoolean(true)
    binary.bitWriteUnsignedInt(GP.BIT_SKIN_ID, this.skinId)
    SkinColor.exportBinaryColor(binary, this.skinColor)
    binary.bitWriteBoolean(this.dodo)

    binary.bitWriteBoolean(false) // fxMemory
  }

  readStateFromMessage(binary: Binary) {
    this.jump = binary.bitReadSignedInt(2)
    this.walk = binary.bitReadSignedInt(2)
    this.shiftKey = binary.bitReadBoolean()
    this.direction = binary.bitReadBoolean()
    this.onFloor = binary.bitReadBoolean()
    this.underWater = binary.bitReadBoolean()
    this.grimpe = binary.bitReadBoolean()
    this.accroche = binary.bitReadBoolean()
    if (binary.bitReadBoolean()) {
      this.positionX = binary.bitReadSignedInt(21) / 100
      this.positionY = binary.bitReadSignedInt(21) / 100
      this.surfaceBody = binary.bitReadUnsignedInt(8)
      this.speedX = binary.bitReadSignedInt(18)
      this.speedY = binary.bitReadSignedInt(18)
    }
    if (binary.bitReadBoolean()) {
      this.skinColor = SkinColor.readBinaryColor(binary)
    }
  }
}