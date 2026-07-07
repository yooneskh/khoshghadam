import { consola } from 'consola';


const httpLog = consola.withTag('http');
const taskLog = consola.withTag('task');


const BASE_SIZE = 6;
const STATUS_SIZE = 3;

const columnWidths = {
  method: 7,
  path: 40,
  size: BASE_SIZE,
  status: STATUS_SIZE,
  elapsed: 8,
  date: 24,
  sizeToken: BASE_SIZE + 4,
  note: (BASE_SIZE + 4) * 2 + STATUS_SIZE + 2,
};


export type LogFields = {
  method?: string;
  path?: string;
  requestSize?: number | string;
  responseSize?: number | string;
  status?: number | string;
  elapsed?: number;
  date?: Date | string;
  taskName?: string;
  payload?: unknown;
  note?: string;
};


export function writeLog(fields: LogFields): void {
  if (fields.taskName !== undefined) {
    taskLog.info(formatTaskLine(fields));
  }
  else {
    httpLog.info(formatHttpLine(fields));
  }
}


function formatHttpLine(fields: LogFields): string {

  const columns = [
    pad(fields.method ?? '', columnWidths.method),
    fit(fields.path ?? '', columnWidths.path),
  ];


  if (fields.note !== undefined) {
    columns.push(fit(fields.note, columnWidths.note));
  }
  else {
    columns.push('requestSize' in fields ? `req=${pad(formatSize(fields.requestSize), columnWidths.size, 'right')}` : pad('', columnWidths.sizeToken));
    columns.push(pad(fields.status ?? '', columnWidths.status, 'right'));
    columns.push(`res=${pad(formatSize(fields.responseSize), columnWidths.size, 'right')}`);
  }


  columns.push(pad(formatElapsed(fields.elapsed), columnWidths.elapsed, 'right'));
  columns.push(formatDate(fields.date));


  return columns.join(' ');

}

function formatTaskLine(fields: LogFields): string {
  return [
    pad('TASK', columnWidths.method),
    fit(fields.taskName ?? '', columnWidths.path),
    fit(formatPayload(fields.payload), columnWidths.note),
    pad(formatElapsed(fields.elapsed), columnWidths.elapsed, 'right'),
    formatDate(fields.date),
  ].join(' ');
}

function pad(value: string | number, width: number, align: 'left' | 'right' = 'left'): string {
  const text = String(value);
  return align === 'right' ? text.padStart(width) : text.padEnd(width);
}

function fit(value: string | number, width: number): string {

  const text = String(value);

  if (text.length <= width) {
    return text.padEnd(width);
  }


  const head = Math.floor((width - 1) / 2);
  const tail = width - 1 - head;


  return `${text.slice(0, head)}…${text.slice(text.length - tail)}`;

}

function formatSize(bytes: number | string | undefined): string {

  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return '-';
  }


  const units = ['K', 'M', 'G', 'T'];

  let value = bytes / 1024;
  let unit = 0;


  while (unit < units.length - 1 && Number(value.toFixed(2)) >= 10) {
    value /= 1024;
    unit++;
  }


  return `${value.toFixed(2)}${units[unit]}B`;

}

function formatElapsed(elapsed: number | undefined): string {

  if (elapsed === undefined) {
    return '';
  }


  const steps: Array<[string, number]> = [
    ['ms', 1000],
    ['s ', 60],
    ['m ', 60],
    ['h ', 24],
    ['d ', Infinity],
  ];

  let value = elapsed;
  let unit = 'd ';


  for (const [label, limit] of steps) {

    if (Number(value.toFixed(2)) < limit) {
      unit = label;
      break;
    }

    value /= limit;

  }


  return `${value.toFixed(2).padStart(6)}${unit}`;

}

function formatDate(date: Date | string | undefined): string {
  const iso = date instanceof Date ? date.toISOString() : date ?? new Date().toISOString();
  return pad(iso, columnWidths.date);
}

function formatPayload(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? {});
  }
  catch {
    return '[unserializable]';
  }
}
