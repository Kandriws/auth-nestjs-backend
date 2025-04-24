import * as crypto from 'crypto';

export function generateStrongPassword(length = 12): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  const values = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }
  return password;
}
