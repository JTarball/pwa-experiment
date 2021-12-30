export const truncate = (str: string, length: int = 20) => {
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
};
