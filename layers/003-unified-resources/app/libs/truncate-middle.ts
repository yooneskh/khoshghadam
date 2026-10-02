
/* responsibility */

// Shortens a long string to a max length
// by replacing its middle with an ellipsis.


export function truncateMiddle(string: string, maxLength = 12): string {
  if (string.length <= maxLength) {
    return string;
  }
  else {
    const middle = Math.floor(maxLength / 2);
    return string.slice(0, middle) + '...' + string.slice(-middle);
  }
}
