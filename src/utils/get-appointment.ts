
const weekdays = {
    Monday: "MONDAY",
    Tuesday: "TUESDAY",
    Wednesday: "WEDNESDAY",
    Thursday: "THURSDAY",
    Friday: "FRIDAY",
    Saturday: "SATURDAY",
    Sunday: "SUNDAY",
} 

export function getAppointmentLocalTime(date: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );

    const weekday = values.weekday as keyof typeof weekdays;
    const hour = Number(values.hour);
    const minute = Number(values.minute);

    return {
        dayOfWeek: weekdays[weekday],
        minutesSinceMidnight: hour * 60 + minute,
    };
}
