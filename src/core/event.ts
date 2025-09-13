import { EventEmitter } from "node:events";
import { RubigrafEvents } from "../symbols";

/**
 * Generic typed Event class built on top of Node.js {@link EventEmitter}.
 *
 * Features:
 * - Type-safe listener signatures (via {@link RubigrafEvents.Map})
 * - Installer/uninstaller hooks for lazy resource management
 * - Before/after hooks for fine-grained control
 * - Full cleanup with `uninstallAll()`
 *
 * Inspired by {@link https://github.com/bdsx/bdsx BDSX} Event system.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class Event extends EventEmitter {
  private installed = new Map<keyof RubigrafEvents.Map, Set<(...args: any[]) => void>>();
  private before = new Map<keyof RubigrafEvents.Map, Set<(...args: any[]) => void>>();
  private after = new Map<keyof RubigrafEvents.Map, Set<(...args: any[]) => void>>();

  /**
   * Register a listener for an event.
   *
   * @param event The event name
   * @param listener The listener callback
   */
  public override on<K extends keyof RubigrafEvents.Map>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => void
  ): this {
    if (!this.installed.has(event)) {
      this.installed.set(event, new Set());
    }
    this.installed.get(event)!.add(listener);
    return super.on(event, listener);
  }

  /**
   * Remove a listener from an event.
   *
   * @param event The event name
   * @param listener The listener callback
   */
  public override off<K extends keyof RubigrafEvents.Map>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => void
  ): this {
    this.installed.get(event)?.delete(listener);
    return super.off(event, listener);
  }

  /**
   * Emit an event (fires before → main → after listeners).
   *
   * @param event The event name
   * @param args The event arguments
   */
  public override emit<K extends keyof RubigrafEvents.Map>(
    event: K,
    ...args: RubigrafEvents.Map[K]
  ): boolean {
    // fire "before" hooks
    this.before.get(event)?.forEach(fn => fn(...args));

    const result = super.emit(event, ...args);

    // fire "after" hooks
    this.after.get(event)?.forEach(fn => fn(...args));

    return result;
  }

  /**
   * Install a handler lazily.
   *
   * @param event The event name
   * @param installer Factory that creates the handler
   */
  public install<K extends keyof RubigrafEvents.Map>(
    event: K,
    installer: RubigrafEvents.BotEventInstaller<this, K>
  ): this {
    const handler = installer(this);
    this.on(event, handler);
    return this;
  }

  /**
   * Uninstall all handlers for a given event.
   *
   * @param event The event name
   */
  public uninstall<K extends keyof RubigrafEvents.Map>(event: K): this {
    const listeners = this.installed.get(event);
    if (listeners) {
      for (const l of listeners) {
        this.off(event, l as any);
      }
      this.installed.delete(event);
    }
    return this;
  }

  /**
   * Remove all installed handlers (full cleanup).
   */
  public uninstallAll(): this {
    for (const [event, listeners] of this.installed.entries()) {
      for (const l of listeners) {
        this.off(event, l as any);
      }
    }
    this.installed.clear();
    return this;
  }

  /**
   * Register a callback that runs **before** event listeners.
   */
  public onBefore<K extends keyof RubigrafEvents.Map>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => void
  ): this {
    if (!this.before.has(event)) {
      this.before.set(event, new Set());
    }
    this.before.get(event)!.add(listener);
    return this;
  }

  /**
   * Register a callback that runs **after** event listeners.
   */
  public onAfter<K extends keyof RubigrafEvents.Map>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => void
  ): this {
    if (!this.after.has(event)) {
      this.after.set(event, new Set());
    }
    this.after.get(event)!.add(listener);
    return this;
  }

  /**
   * Check if there are no listeners (including before/after).
   */
  public isEmpty(): boolean {
    return (
      this.eventNames().length === 0 &&
      this.before.size === 0 &&
      this.after.size === 0
    );
  }
}

export default Event;
