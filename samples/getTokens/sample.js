function runSample(lumino, sampleParams) {
  return new Promise((resolve) => {
    lumino.getTokens()
      .then(response => resolve(response))
      .catch(error => resolve(error));
  });
}
