export const validators = {
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPassword(password) {
    return password.length >= 6;
  },

  isValidUsername(username) {
    return username.length >= 3 && username.length <= 20;
  },
};
