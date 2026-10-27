export function getAvailabilityMinutes(time: Date): number {
    return time.getUTCHours() * 60 + time.getUTCMinutes();
}