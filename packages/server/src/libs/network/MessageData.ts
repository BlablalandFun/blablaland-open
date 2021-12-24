export class MessageData extends Array {
  constructor (private readonly delimiter: number) {
    super()
  }

  isFinished (): boolean {
    return this.length === 0 || !this.includes(this.delimiter)
  }

  next (): number[] | null {
    const delimiterIndex = this.indexOf(this.delimiter)
    if (delimiterIndex !== -1) {
      return this.splice(0, delimiterIndex + 1)
    }
    return null
  }
}