export const getAuthErrorMessage = (authCode: string) => {
  switch (authCode) {
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/email-already-in-use':
      return 'Email already in use';
    default:
      return 'Something went wrong';
  }
};

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
