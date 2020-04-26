import * as kleur from 'kleur'

import Quercia from './quercia'

const isSupported =
  process.platform !== 'win32' ||
  process.env.CI ||
  process.env.TERM === 'xterm-256color'

interface Symbols {
  info: string
  success: string
  warning: string
  error: string
  debug?: string
}

const main: Symbols = {
  info: 'ℹ',
  success: '✔',
  warning: '⚠',
  error: '✖'
}

const fallbacks: Symbols = {
  info: 'i',
  success: '√',
  warning: '‼',
  error: '×'
}

const colors: { [K in keyof Symbols]: keyof kleur.Kleur } = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red'
}

export default class Logger {
  private quercia: Quercia
  public symbols = isSupported ? main : fallbacks
  public colors = colors

  constructor(quercia: Quercia) {
    this.quercia = quercia
  }

  private print(level: keyof Symbols, from: string, ...extra: any[]) {
    if (level === 'debug') {
      if (this.quercia.flags.debug) {
        console.log('** DEBUG **', `[${from}]`, extra)
      }
      return
    }

    // print `from` during debug mode
    console.log(
      kleur[this.colors[level]](
        `${this.symbols[level]} ${level}${
          this.quercia.flags.debug ? `(${from})` : ''
        }`
      ),
      ...extra
    )
  }

  public debug(from: string, ...extra: any[]) {
    if (!this.quercia.flags.debug) {
      return
    }

    this.print('debug', from, ...extra)
  }

  public info(from: string, ...extra: any[]) {
    this.print('info', from, ...extra)
  }

  public success(from: string, ...extra: any[]) {
    this.print('success', from, ...extra)
  }

  public warning(from: string, ...extra: any[]) {
    this.print('warning', from, ...extra)
  }

  public error(from: string, ...extra: any[]) {
    this.print('error', from, ...extra)
    this.quercia.exit(1)
  }
}
