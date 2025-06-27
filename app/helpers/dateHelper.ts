export default function dateHelper({
    addDay,
    subDay,
    setDate,
    dateAsText
}: {
    addDay?: number,
    subDay? :number
    setDate?: string | Date | number,
    dateAsText? : boolean
} = {}) {
    const date = new Date(setDate || new Date());
    date.setHours(0,0,0,0);

    if(addDay) {
        date.setDate(date.getDate() + addDay);
    }
    
    if(subDay) {
        date.setDate(date.getDate() - subDay);
    }

    if(dateAsText) {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }

    return date.getTime();
}