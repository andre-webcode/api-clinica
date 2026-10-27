export function calculateAppointmentEnd(
    startAt: Date,
    durationMinutes: number,
): Date {
    return new Date(startAt.getTime() + durationMinutes * 60_000);
}