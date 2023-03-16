type Branded<T, B, S> = T & { __brand: B; __subbrand: S };

export type UUID<T = any> = Branded<string, { __UUID: never }, T>;
export type CoreUUID = UUID<{ __coreUuid: never }>;
export type JobUUID = UUID<{ __jobUuid: never }>;
export type TaskUUID = UUID<{ __taskUuid: never }>;

// const expectsUUID = (uuid: UUID) => undefined;
// const expectsCoreUUID = (uuid: CoreUUID) => undefined;
// const expectsJobUUID = (uuid: JobUUID) => undefined;

// let guuid = "sdfsf" as UUID;
// expectsUUID(guuid);
// expectsCoreUUID(guuid);
// expectsJobUUID(guuid);

// let xuuid = "sdfsf" as CoreUUID;
// expectsUUID(xuuid);
// expectsCoreUUID(xuuid);
// expectsJobUUID(xuuid);

// let yuuid = "sdfsf" as JobUUID;
// expectsUUID(yuuid);
// expectsCoreUUID(yuuid);
// expectsJobUUID(yuuid);
