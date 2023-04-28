export type ObjectRecord<T extends object> = Record<keyof T, T[keyof T]>;
