if (typeof Vivus !== "undefined") {
  // Remove all Vivus instances
  Vivus.instances.forEach(function (instance) {
    instance.destroy();
  });
}
