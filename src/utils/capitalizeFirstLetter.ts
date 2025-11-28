export default function capitalizeFirstLetter(word: string): string {
  return word[0].toLocaleUpperCase() + word.slice(1);
}
