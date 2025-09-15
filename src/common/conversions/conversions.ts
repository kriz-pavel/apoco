export function convertIdToPokedexIdString(id: number): string {
  return id.toString().padStart(3, '0');
}

export function convertTextToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function convertGramsToKilogramsString(grams: number): string {
  return `${grams / 1000}kg`;
}

export function convertCmToMetrsString(cm: number): string {
  return `${cm / 100}m`;
}
