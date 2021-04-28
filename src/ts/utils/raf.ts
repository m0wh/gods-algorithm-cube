class RAF {
  private subscribers: Array<RAFSubscription> = []
  private startTime: number
  private time: number

  constructor () {
    this.startTime = Date.now()
    this.time = this.startTime

    this.update()
  }

  public subscribe (f: (time: number) => void): RAFSubscription {
    const sub = new RAFSubscription(f)
    this.subscribers.push(sub)
    return sub
  }

  public unSubscibe (sub: RAFSubscription): void {
    const index = this.subscribers.indexOf(sub)
    this.subscribers.splice(index)
  }

  private update (): void {
    this.time = Date.now() - this.startTime

    this.subscribers.forEach(sub => {
      sub.execute(this.time)
    })
    requestAnimationFrame(this.update.bind(this))
  }
}

class RAFSubscription {
  private f: (time: number) => void = () => {}
  private isPlaying: boolean = true

  constructor (f) {
    this.f = f
  }

  public play (): void { this.isPlaying = true }
  public pause (): void { this.isPlaying = false }

  public execute (time: number, force: boolean = false): void {
    if (this.isPlaying || force) {
      this.f(time)
    }
  }
}

export default new RAF()
