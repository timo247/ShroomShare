function defineTest(wrapper, optionalMessage, testFunc) {
  const separator = optionalMessage !== '' ? '-' : '';
  test(`${wrapper.msg} ${separator} ${optionalMessage}`, async () => {
    await testFunc(wrapper);
  });
}

export default defineTest;
