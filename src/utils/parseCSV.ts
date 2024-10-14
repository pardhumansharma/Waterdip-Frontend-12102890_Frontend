const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj: any, header: string, index: number) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
};

export default parseCSV;
