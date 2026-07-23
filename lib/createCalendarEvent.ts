import { invitationContent } from './invitationContent';

const escapeIcs = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * Folds a content line to the 75-octet limit RFC 5545 asks for. Arabic is multi-byte,
 * so the split has to be measured in UTF-8 bytes, not characters.
 */
const fold = (line: string) => {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // continuation lines start with a space, so they carry one byte less of payload
    if (bytes + size > (out.length === 0 ? 75 : 74)) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  if (current) out.push(current);
  return out.join('\r\n ');
};

export function buildInvitationIcs(): string {
  const { calendar } = invitationContent;
  const stamp = calendar.startUtc;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kayla//Graduation Invitation//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kayla-graduation-2026@invitation`,
    `DTSTAMP:${stamp}`,
    // stored in UTC: 19:00–22:00 Asia/Hebron on 15 Aug 2026 (UTC+3 that date)
    `DTSTART:${calendar.startUtc}`,
    `DTEND:${calendar.endUtc}`,
    `SUMMARY:${escapeIcs(calendar.title)}`,
    `LOCATION:${escapeIcs(calendar.location)}`,
    `DESCRIPTION:${escapeIcs(calendar.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(fold).join('\r\n') + '\r\n';
}

/** Downloads the event as an .ics file. Returns false if the browser blocked it. */
export function downloadInvitationIcs(): boolean {
  try {
    const blob = new Blob([buildInvitationIcs()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kayla-graduation.ics';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // give Safari a moment to consume the blob before revoking
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch {
    return false;
  }
}
