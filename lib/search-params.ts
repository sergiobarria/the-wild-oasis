/** Next's `searchParams` gives `string | string[] | undefined` per key (repeated query params
 *  become an array) -- this app never needs more than the first value for any param it reads. */
export function firstSearchParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}
