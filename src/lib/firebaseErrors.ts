/**
 * Maps raw Firebase authentication error codes to clean, user-friendly messages.
 */
export function formatFirebaseAuthError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';

  const code = typeof error === 'string' ? error : error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 8 characters with letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'Sign-in provider is not enabled in the Firebase Console.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    case 'auth/requires-recent-login':
      return 'This operation is sensitive and requires recent authentication. Please sign in again.';
    default:
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('auth/')) {
          const match = error.message.match(/auth\/[a-z0-9-]+/);
          if (match) {
            return formatFirebaseAuthError(match[0]);
          }
        }
        return error.message;
      }
      return 'Authentication failed. Please try again.';
  }
}
