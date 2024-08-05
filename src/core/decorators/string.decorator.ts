import { Transform } from 'class-transformer';

export function TrimString() {
    return Transform(({ value }) => (value && typeof value == 'string' ? value.trim() : value));
}

export function ParseToBoolean() {
    return Transform(({ value }) => (String(value).toLowerCase() === 'true' ? true : false));
}

export function ParseToInteger(isArray: boolean = false) {
    if (isArray) {
        return Transform(({ value }) => (value && value.length ? value.map((val: any) => parseInt(val)) : value));
    }
    return Transform(({ value }) => (value && typeof value == 'number' ? Number(value) : parseInt(value)));
}
