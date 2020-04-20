import Quercia from './quercia'

export default class Logger {
  private quercia: Quercia

  constructor(quercia: Quercia) {
    this.quercia = quercia
  }

  public log(from: string, ...extra: any[]) {
    console.log(`[${from}]`, ...extra)
  }

  public debug(from: string, ...extra: any[]) {
    if (!this.quercia.flags.debug) {
      return
    }

    this.log(from, ...extra)
  }

  public error(from: string, ...extra: any[]) {
    this.log(from, ...extra)
  }

  public fatal(from: string, ...extra: any[]) {
    this.log(from, ...extra)
    this.quercia.exit(1)
  }
}
