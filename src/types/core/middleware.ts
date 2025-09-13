import { Context } from "./context";

type Next = () => Promise<void>;
type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

export { Middleware, Next };
