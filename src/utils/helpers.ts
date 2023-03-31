// A non strict check for null also checks for undefined.
export function isDefined<T>(value: T | undefined | null): value is T {
    return value != null;
}
