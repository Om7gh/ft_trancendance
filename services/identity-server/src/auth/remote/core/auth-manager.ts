import { PkceParams } from '../types/pkce.js'
import AStrategy from './base-strategy.js'

class Registry {
  private readonly strategies = new Map<string, AStrategy>()
  private static _instance?: Registry

  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new Registry()
    }
    return this._instance
  }

  register(strategy: AStrategy): void {
    if (this.strategies.has(strategy.name)) {
      throw new Error(`Strategy "${strategy.name}" is already registered`)
    }
    this.strategies.set(strategy.name, strategy)
  }

  use(provider: string): AStrategy {
    const strategy = this.strategies.get(provider)
    if (!strategy) {
      throw new Error(`Strategy "${provider}" not found`)
    }
    return strategy
  }

  getAuthUrl(provider: string, pkce: PkceParams): string {
    return this.use(provider).generateAuthUrl(pkce)
  }

  has(provider: string): boolean {
    return this.strategies.has(provider)
  }
}

export abstract class AuthManager {
  private static readonly registry = Registry.getInstance()

  public static use(provider: string): AStrategy {
    if (!this.registry.has(provider)) {
      throw new Error(`AuthManager: unsupported provider: ${provider}`)
    }
    return this.registry.use(provider)
  }

  public static getAuthUrl(provider: string, pkce: PkceParams): string {
    return this.use(provider).generateAuthUrl(pkce)
  }

  public static register(strategy: AStrategy): void {
    this.registry.register(strategy)
  }

  public static isSupported(provider: string): boolean {
    return this.registry.has(provider)
  }
}
