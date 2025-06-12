export class PhoneUtil {
  static formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      return '';
    }
    // Normalize the phone number to start with '0' if it starts with '+84'
    if (phoneNumber.startsWith('+84')) {
      phoneNumber = '0' + phoneNumber.slice(3);
    }

    if (phoneNumber.startsWith('84')) {
      phoneNumber = '0' + phoneNumber.slice(2);
    }

    phoneNumber = phoneNumber.replace(/[^0-9+]/g, '');

    return phoneNumber;
  }
}