import { next } from "../../helper";
import { Context } from "./context";

type Next = typeof next;
type MiddlewareNext = () => Promise<void>;
type Middleware = (ctx: Context, next: MiddlewareNext) => Promise<void> | void;

export { Middleware, MiddlewareNext, Next };
