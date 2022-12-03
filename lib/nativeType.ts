export default function toNativeType(value:any) {
    const n = Number(value);
    if (!isNaN(n)) {
        return n;
    }

    const bool = value.toLowerCase();
    if (bool === 'true') {
        return true;
    } else if (bool === 'false') {
        return false;
    }

    return value;
}