function formatDocument(document: string): string {
  return document.replace(/[.\/\-]/g, "");
}

function validateDocument(document: string): boolean {
  // Only numbers
  const onlyNumbers = /^[0-9]+$/.test(document);
  if (!onlyNumbers) {
    return false; // invalid
  }

  let validatorDigit1 = 0;
  let validatorDigit2 = 0;
  let sum = 0;

  // CPF or CNPJ
  switch (document.length) {
    case 11: // CPF
      // 1st digit
      for (let i = 0; i <= 8; i++) {
        const digit = parseInt(document[i], 10);
        if (isNaN(digit)) {
          return false; // invalid
        }
        sum += digit * (10 - i);
      }
      const remainder1 = sum % 11;
      if (remainder1 < 2) {
        validatorDigit1 = 0;
      } else {
        validatorDigit1 = 11 - remainder1;
      }
      // Checking if 1st digit is correct
      if (document[9] !== validatorDigit1.toString()) {
        return false; // invalid
      }

      // 2nd digit
      sum = 0;
      for (let i = 0; i <= 8; i++) {
        const digit = parseInt(document[i], 10);
        if (isNaN(digit)) {
          return false; // invalid
        }
        sum += digit * (11 - i);
      }
      sum += validatorDigit1 * 2;
      const remainder2 = sum % 11;
      if (remainder2 < 2) {
        validatorDigit2 = 0;
      } else {
        validatorDigit2 = 11 - remainder2;
      }
      // Checking if 2nd digit is correct
      if (document[10] !== validatorDigit2.toString()) {
        return false; // invalid
      }
      break;

    case 14: // CNPJ
      return false; // we will don't use CNPJ

      // 1st digit
      let multiplier1 = 5;
      for (let i = 0; i <= 11; i++) {
        const digit = parseInt(document[i], 10);
        if (isNaN(digit)) {
          return false; // invalid
        }
        sum += digit * multiplier1;
        multiplier1--;
        if (multiplier1 === 1) {
          multiplier1 = 9;
        }
      }
      const remainder3 = sum % 11;
      if (remainder3 < 2) {
        validatorDigit1 = 0;
      } else {
        validatorDigit1 = 11 - remainder3;
      }
      // Checking if 1st digit is correct
      if (document[12] !== validatorDigit1.toString()) {
        return false; // invalid
      }

      // 2nd digit
      sum = 0;
      let multiplier2 = 6;
      for (let i = 0; i <= 11; i++) {
        const digit = parseInt(document[i], 10);
        if (isNaN(digit)) {
          return false; // invalid
        }
        sum += digit * multiplier2;
        multiplier2--;
        if (multiplier2 === 1) {
          multiplier2 = 9;
        }
      }
      sum += validatorDigit1 * 2;
      const remainder4 = sum % 11;
      if (remainder4 < 2) {
        validatorDigit2 = 0;
      } else {
        validatorDigit2 = 11 - remainder4;
      }
      // Checking if 2nd digit is correct
      if (document[13] !== validatorDigit2.toString()) {
        return false; // invalid
      }
      break;

    default:
      // If it isn't 14 or 11 digits
      return false; // invalid
  }

  return true;
}

export { formatDocument, validateDocument };
