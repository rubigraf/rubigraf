type DropLast<T extends any[]> = T extends [...infer Head, any] ? Head : never;

export type { DropLast };
