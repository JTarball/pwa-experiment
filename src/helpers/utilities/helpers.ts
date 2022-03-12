export const truncate = (str: string, length: int = 20) => {
    if (str == null) {
        return "";
    }
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
};
