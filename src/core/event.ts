import { EventEmitter } from "node:events";
import { NEXT, RubigrafEvents } from "../symbols";
import { isPlainPayload, next } from "../helper";
import type { AnyFn, DropLast, RubigrafPayload } from "../types";

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
  ): this;
  // add overload for Error (sync-only) and generic overload for other events
  public override on(
    event: typeof RubigrafEvents.Error,
    listener: (err: Error | string | unknown, logger: any) => void
  ): this;
  public override on<K extends Exclude<keyof RubigrafEvents.Map, typeof RubigrafEvents.Error>>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => any
  ): this;

  // single implementation
  public override on(event: any, listener: AnyFn): this {
    // runtime guard: Error listeners must be synchronous functions
    if (event === RubigrafEvents.Error) {
      // async functions have constructor name "AsyncFunction"
      if (listener && listener.constructor && listener.constructor.name === "AsyncFunction") {
        throw new TypeError(
          "Error event listeners must be synchronous (do not use async functions/async arrow)."
        );
      }
    }

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
   * Emit an event synchronously (fires before → main → after listeners).
   *
   * @param event The event name
   * @param args The event arguments
   * 
   * @deprecated It is no more updated/supported as of `v1.3.0`, If you are using
   * method of this class please consider using {@link Event.emitSync this.emitSync}.
   */
  public override emit<K extends keyof RubigrafEvents.Map>(
    event: K,
    ...args: RubigrafEvents.Map[K]
  ): boolean {
    if (event === RubigrafEvents.Error) {
      for (const fn of new Set(this.listeners(event))) {
        try {
          (fn as AnyFn)(...(args as any));
        } catch (err) {}
      }
      return true;
    }

    const callSync = (listeners?: Set<Function>): boolean => {
      if (!listeners) return true;
      for (const fn of listeners) {
        const result = fn(...args);
        if (result !== NEXT) return false;
      }
      return true;
    };

    if (!callSync(this.before.get(event))) return false;
    if (!callSync(new Set(this.listeners(event)))) return false;

    this.after
      .get(event)
      ?.forEach((fn) => fn(...(args.slice(0) as DropLast<RubigrafEvents.Map[K]>)));

    return true;
  }

  /**
   * Emit an event synchronously (fires before → main → after listeners).
   *
   * @param event The event name
   * @param args The event arguments
   */
  public emitSync<K extends keyof RubigrafEvents.Map>(
    event: K,
    ...args: RubigrafEvents.Map[K]
  ): void {
    if (!this.callListenersSync(this.before.get(event), args)) return;
    if (!this.callListenersSync(new Set(this.listeners(event)) as Set<AnyFn>, args)) return;

    const payloadIndex = args.findIndex((a, i) => i > 0 && isPlainPayload(a));
    const hasPayload = payloadIndex !== -1;
    const payload: Record<string, any> = hasPayload
      ? (args[payloadIndex] as Record<string, any>)
      : {};
    const coreArgs = (
      hasPayload ? args.slice(0, payloadIndex).concat(args.slice(payloadIndex + 1)) : args
    ) as any[];

    for (const fn of this.after.get(event) ?? []) {
      const arity = typeof fn === "function" ? fn.length : 0;
      if (arity >= coreArgs.length + 1) {
        const result: any = (fn as AnyFn)(...coreArgs, payload);
        if (result instanceof Promise) void result;
      } else {
        const result: any = (fn as AnyFn)(...coreArgs);
        if (result instanceof Promise) void result;
      }
    }
  }

  /**
   * Emit an event asynchronously (fires before → main → after listeners).
   *
   * @param event The event name
   * @param args The event arguments
   */
  public async emitAsync<K extends keyof RubigrafEvents.Map>(
    event: K,
    ...args: RubigrafEvents.Map[K]
  ): Promise<void> {
    if (event === RubigrafEvents.Error) {
      this.emitSync(event, ...(args as any));
      return;
    }

    if (!(await this.callListeners(this.before.get(event), args))) return;
    if (!(await this.callListeners(new Set(this.listeners(event)) as Set<AnyFn>, args))) return;

    const payloadIndex = args.findIndex((a, i) => i > 0 && isPlainPayload(a));
    const hasPayload = payloadIndex !== -1;
    const payload: Record<string, any> = hasPayload
      ? (args[payloadIndex] as Record<string, any>)
      : {};
    const coreArgs = (
      hasPayload ? args.slice(0, payloadIndex).concat(args.slice(payloadIndex + 1)) : args
    ) as any[];

    for (const fn of this.after.get(event) ?? []) {
      const arity = typeof fn === "function" ? fn.length : 0;
      try {
        if (arity >= coreArgs.length + 1) {
          const result: any = fn(...coreArgs, payload);
          if (result instanceof Promise) await result;
        } else {
          const result: any = fn(...coreArgs);
          if (result instanceof Promise) await result;
        }
      } catch (err) {
        this.emitSync(RubigrafEvents.Error as any, err);
      }
    }
  }

  /**
   * Helper to call listeners with next().
   * Supports both sync and async.
   *
   * @param listeners The set of listeners
   * @param args The event arguments
   * @returns `false` if chain aborted, `true` otherwise
   */
  private async callListeners(listeners: Set<AnyFn> | undefined, args: any[]): Promise<boolean> {
    if (!listeners) return true;

    const payloadIndex = args.findIndex((a, i) => i > 0 && isPlainPayload(a));
    const hasPayload = payloadIndex !== -1;
    const payload: RubigrafPayload = hasPayload ? args[payloadIndex] : {};
    const coreArgs = hasPayload
      ? args.slice(0, payloadIndex).concat(args.slice(payloadIndex + 1))
      : args;

    for (const fn of listeners) {
      const arity = typeof fn === "function" ? fn.length : 0;
      try {
        let result: any;

        if (arity === coreArgs.length + 1) {
          result = fn(...coreArgs, () => NEXT);
        } else if (arity >= coreArgs.length + 2) {
          result = fn(...coreArgs, payload, () => NEXT);
        } else {
          result = fn(...coreArgs);
        }

        if (result instanceof Promise) result = await result;

        if (arity >= coreArgs.length + 1) {
          if (result !== NEXT) return false;
        }
      } catch (err) {
        throw err;
      }
    }

    return true;
  }

  private callListenersSync(listeners?: Set<AnyFn>, args: any[] = []): boolean {
    if (!listeners) return true;

    const payloadIndex = args.findIndex((a, i) => i > 0 && isPlainPayload(a));
    const hasPayload = payloadIndex !== -1;
    const payload: Record<string, any> = hasPayload ? args[payloadIndex] : {};
    const coreArgs = hasPayload
      ? args.slice(0, payloadIndex).concat(args.slice(payloadIndex + 1))
      : args;

    for (const fn of listeners) {
      const arity = typeof fn === "function" ? fn.length : 0;
      let result: any;
      try {
        if (arity === coreArgs.length + 1) {
          result = (fn as AnyFn)(...coreArgs, () => NEXT);
        } else if (arity >= coreArgs.length + 2) {
          result = (fn as AnyFn)(...coreArgs, payload, () => NEXT);
        } else {
          result = (fn as AnyFn)(...coreArgs);
        }

        if (result instanceof Promise) return false;

        if (arity >= coreArgs.length + 1) {
          if (result !== NEXT) return false;
        }
      } catch (err) {
        throw err;
      }
    }

    return true;
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
    this.before.clear();
    this.installed.clear();
    this.after.clear();
    return this;
  }

  /**
   * Register a callback that runs **before** event listeners.
   *
   * @note `Error` event is excluded from this hook as of `v1.3.0`.
   */
  public onBefore<K extends RubigrafEvents.NonErrorEvents>(
    event: K,
    listener: (...args: RubigrafEvents.Map[K]) => void
  ): this {
    if (event === (RubigrafEvents.Error as unknown as K)) {
      throw new TypeError("onBefore cannot be used with the Error event");
    }

    if (!this.before.has(event)) this.before.set(event, new Set());
    this.before.get(event)!.add(listener as any);
    return this;
  }

  /**
   * Register a callback that runs **after** event listeners.
   *
   * @note `Error` event is excluded from this hook as of `v1.3.0`.
   */
  public onAfter<K extends RubigrafEvents.NonErrorEvents>(
    event: K,
    listener: (...args: DropLast<RubigrafEvents.Map[K]>) => void
  ): this {
    if (event === (RubigrafEvents.Error as unknown as K)) {
      throw new TypeError("onAfter cannot be used with the Error event");
    }

    if (!this.after.has(event)) this.after.set(event, new Set());
    this.after.get(event)!.add(listener as any);
    return this;
  }

  /**
   * Check if there are no listeners (including before/after).
   */
  public isEmpty(): boolean {
    return this.eventNames().length === 0 && this.before.size === 0 && this.after.size === 0;
  }
}

export default Event;
