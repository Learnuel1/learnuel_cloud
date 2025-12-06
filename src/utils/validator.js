exports.isEmailValid = (email) => {
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  return regex.test(email);
}
exports.isPasswordStrong = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    return passwordRegex.test(password)? true : false;
}
exports.isPasswordStrongManual = (password) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&{}[]$#^()-_+=~`|:;\"\'<>,./\\';

  
  // Check length
  if (password.length < 8) return false;
  if(password.split('').filter( x => lowercase.split('').includes(x)).length ===0) return false;
  if(password.split('').filter( x => uppercase.split('').includes(x)).length ===0) return false;
  if(password.split('').filter( x => numbers.split('').includes(x)).length ===0) return false;
  if(password.split('').filter( x => specialChars.split('').includes(x)).length ===0) return false;
  return true; 

}