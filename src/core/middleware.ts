import { Context, Middleware, MiddlewareNext } from "../types";

/**
 * Compose an array of middleware into a single middleware function.
 *
 * @param middlewares Array of middleware functions.
 * @package rubigraf
 * @since v1.0.0
 */
export function compose(middlewares: Middleware[]): Middleware {
  return async function composed(ctx: Context, next: MiddlewareNext) {
  let idx = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= idx) throw new Error("next() called multiple times");
      idx = i;

      const fn = i < middlewares.length ? middlewares[i] : next;
      if (!fn) return;

      await fn(ctx, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
}
