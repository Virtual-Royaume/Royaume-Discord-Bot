
const LOCALE = "fr-FR";

export function numberParser( number: number ) : string {

    return number.toLocaleString(LOCALE);

}