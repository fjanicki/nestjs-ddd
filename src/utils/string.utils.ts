export class StringUtils {
  /**
   * Removes all blanks from the string.
   * @param string The edited string
   */
  static removeBlanks(string: string): string {
    return string?.replace(/\s/g, '');
  }

  /**
   * Removes all non-alphanumerical values from the given string
   * @param string The new string without special characters
   */
  static removeSpecialCharacters(string: string): string {
    return string?.replace(/[^\w\s]/gi, '');
  }
}
