import Quercia from '../quercia'

export default class Build extends Quercia {
  public description =
    'bundle your application to be served from a quercia backend'

  public async run() {
    await super.run()

    //console.log(this.parsedFlags)
  }
}
