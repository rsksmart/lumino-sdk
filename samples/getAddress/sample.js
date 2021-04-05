function runSample(lumino, sampleParams) {
  return new Promise((resolve) => {
    lumino.getAddress()
      .then(response => resolve(response))
      .catch(error => resolve(error));
  });
}
