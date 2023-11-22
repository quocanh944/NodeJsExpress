function sanitizeAndValidateUserData(data) {
  const sanitizedData = {};

  if (data.email && validateEmail(data.email)) {
    sanitizedData.email = data.email.trim();
  } else {
    throw new Error("Email không hợp lệ.");
  }

  if (data.fullName) {
    sanitizedData.fullName = data.fullName.trim();
  }

  return { ...data, ...sanitizedData };
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function userHasPermissionToUpdate(currentUser) {
  return currentUser.role === 'ADMIN';
}

export { userHasPermissionToUpdate, sanitizeAndValidateUserData }
