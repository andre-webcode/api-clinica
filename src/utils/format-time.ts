export function formatTime(time: Date): string {
    return time.toISOString().slice(11, 16);
}