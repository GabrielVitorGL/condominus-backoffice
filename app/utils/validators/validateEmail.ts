function validateEmail(email: string): boolean {
  // http://tinyurl.com/mlwavo8
  // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  const regexp = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
  return regexp.test(email);
}

export default validateEmail;
