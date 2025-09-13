import { Context, Middleware, Next } from "../types";

export function compose(middlewares: Middleware[]): Middleware {
  return async function composed(ctx: Context, next: Next) {
    let idx = -1;
    async function dispatch(i: number): Promise<void> {
      if (i <= idx) throw new Error("next() called multiple times");
      idx = i;
      const fn = i === middlewares.length ? next : middlewares[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }
    await dispatch(0);
  };
}
