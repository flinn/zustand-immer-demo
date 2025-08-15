import { IFlag } from "./types";

export interface LDUser {
  key: string;
  name?: string;
  email?: string;
  anonymous?: boolean;
  custom?: { [key: string]: any };
}

export interface ILDClient {
  init: (config: any) => void;
  identify: (user: LDUser) => void;
  on: (event: string, callback: (user: LDUser) => void) => void;
  getFlag: (flagName: string) => IFlag;
}

class LDClient implements ILDClient {
  private config: any = null;
  private user: LDUser | null = null;
  private eventCallbacks: Map<string, ((user: LDUser) => void)[]> = new Map();
  private flags: Map<string, IFlag> = new Map();

  constructor() {
    // Initialize with some mock flags for testing
    this.flags.set('feature-flag-1', { name: 'feature-flag-1', value: true });
    this.flags.set('feature-flag-2', { name: 'feature-flag-2', value: false });
    this.flags.set('config-value', { name: 'config-value', value: 'production' });
    this.flags.set('numeric-setting', { name: 'numeric-setting', value: 42 });
  }

  static init(config?: any): LDClient {
    const client = new LDClient();
    client.init(config);
    return client;
  }

  init(config: any): void {
    this.config = config;
    console.log('[MockLDClient] Initialized with config:', config);
  }

  identify(user: LDUser): void {
    this.user = user;
    console.log('[MockLDClient] Identified user:', user);
    // Trigger 'ready' event callbacks if any are registered
    this.triggerEvent('ready', user);
  }

  on(event: string, callback: (user: LDUser) => void): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
    console.log(`[MockLDClient] Registered callback for event: ${event}`);
  }

  getFlag(flagName: string): IFlag {
    const flag = this.flags.get(flagName);
    if (flag) {
      console.log(`[MockLDClient] Retrieved flag ${flagName}:`, flag);
      return flag;
    }

    // Return a default flag if not found
    const defaultFlag: IFlag = { name: flagName, value: null };
    console.log(`[MockLDClient] Flag ${flagName} not found, returning default:`, defaultFlag);
    return defaultFlag;
  }

  // Helper methods for testing
  public setFlag(flagName: string, value: boolean | number | string | null): void {
    this.flags.set(flagName, { name: flagName, value });
    console.log(`[MockLDClient] Set flag ${flagName} to:`, value);
  }

  public removeFlag(flagName: string): void {
    this.flags.delete(flagName);
    console.log(`[MockLDClient] Removed flag: ${flagName}`);
  }

  public triggerEvent(event: string, user: LDUser): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(user);
        } catch (error) {
          console.error(`[MockLDClient] Error in ${event} callback:`, error);
        }
      });
    }
  }

  public getAllFlags(): Map<string, IFlag> {
    return new Map(this.flags);
  }
}

export { LDClient };