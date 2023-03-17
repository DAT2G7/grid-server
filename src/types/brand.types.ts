type Branded<T, B, S> = T & { __brand: B; __subbrand: S };

/** Branded string for UUIDs */
// Subbrand hacking doesn't work properly without any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UUID<T = any> = Branded<string, { __UUID: never }, T>;

/** UUID Sub-brand for cores */
export type CoreUUID = UUID<{ __coreUuid: never }>;
/** UUID Sub-brand for jobs */
export type JobUUID = UUID<{ __jobUuid: never }>;
/** UUID Sub-brand for tasks */
export type TaskUUID = UUID<{ __taskUuid: never }>;

// const expectsUUID = (uuid: UUID) => undefined;
// const expectsCoreUUID = (uuid: CoreUUID) => undefined;
// const expectsJobUUID = (uuid: JobUUID) => undefined;

// const guuid = "sdfsf" as UUID;
// expectsUUID(guuid); // Good
// expectsCoreUUID(guuid); // Good
// expectsJobUUID(guuid); // Good

// const xuuid = "sdfsf" as CoreUUID;
// expectsUUID(xuuid); // Good
// expectsCoreUUID(xuuid); // Good
// expectsJobUUID(xuuid); // Bad

// const yuuid = "sdfsf" as JobUUID;
// expectsUUID(yuuid); // Good
// expectsCoreUUID(yuuid); // Bad
// expectsJobUUID(yuuid); // Good
