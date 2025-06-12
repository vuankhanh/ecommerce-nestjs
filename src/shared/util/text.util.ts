export class TextUtil {
  static getInitials(name: string): string {
    if (!name) return "";
    const nameParts = name.trim().split(/[^a-zA-Z0-9]+/);
    // Lấy ký tự đầu tiên của mỗi từ và ghép lại
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  }
}