if (typeof Vivus !== "undefined" && typeof Vivus.instances !== "undefined") {
  Vivus.instances.forEach(function (instance) {
    instance.destroy();
  });
}
