export const getErrorMessage = (errorMessage) => {
  switch (errorMessage) {
    //checked / database
    case "Invalid login credentials":
      return "Incorrect email or password. Please try again.";
    // case "Email not confirmed":
    //   return "Your email is not confirmed. Please check your inbox.";
    case "User already registered":
      return "This email is already registered. Please log in.";
    case "Password should be at least 6 characters":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
};
