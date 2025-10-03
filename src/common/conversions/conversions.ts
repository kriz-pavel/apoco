export function convertIdToPokedexIdString(id: number): string {
  if (id < 0) {
    throw new Error('Negative id cannot be converted to pokedex id');
  }
  return id.toString().padStart(3, '0');
}

export function convertTextToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[čšřžďňťéáíúóýů]/g, (char) => {
      return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    })
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function convertGramsToKilogramsString(grams: number): string {
  return `${grams / 1000}kg`;
}

export function convertCmToMetrsString(cm: number): string {
  return `${cm / 100}m`;
}
