export class MessageData extends Array {
  private readonly delimiter: number

  constructor (delimiter: number) {
    super()
    this.delimiter = delimiter
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