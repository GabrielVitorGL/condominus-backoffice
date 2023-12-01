function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[\s\(\)\-]+|\+55/g, "");
}

function validatePhoneNumber(phoneNumber: string): boolean {
  // Garantindo que apenas há números
  const onlyNumbers = /^[0-9]+$/;
  if (!onlyNumbers.test(phoneNumber)) {
    return false;
  }

  // Não existem códigos de DDD com o dígito 0
  if (phoneNumber[0] === "0" || phoneNumber[1] === "0") {
    return false;
  }

  switch (phoneNumber.length) {
    case 11:
      // se tiver 11 dígitos, deverá ser um número de celular, ou seja, após o DDD ser o número 9
      // celulares não podem começar com 90 após o DDD porque esse é o prefixo para ligações a cobrar
      if (phoneNumber[2] !== "9" || phoneNumber[3] === "0") {
        return false;
      }
      break;
    case 10:
      // se tiver 10 dígitos, deverá ser um telefone fixo, e eles devem iniciar com um dígito de 2 a 8 após o DDD
      if (
        phoneNumber[2] === "9" ||
        phoneNumber[2] === "1" ||
        phoneNumber[2] === "0"
      ) {
        return false;
      }
      break;
    default:
      // se não tiver 11 ou 10 dígitos não é valido para nosso formato
      return false;
  }

  return true;
}

export { formatPhoneNumber, validatePhoneNumber };
