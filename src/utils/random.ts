export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Give an array of type T[]
 * @returns a random element of type T of that array
 */
export function getRandomElement<T>(arr: T[]): T {
    return arr[getRandomInt(0, arr.length)];
}
