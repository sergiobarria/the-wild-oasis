/** The caller's local calendar date as an ISO 'YYYY-MM-DD' string -- deliberately NOT
 *  `date.toISOString().slice(0, 10)`, which is the UTC date and can be a day off from the
 *  user's actual local "today" in the evening in any UTC-negative timezone. */
export function todayIsoDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
