/**
 * Create a performance mark.
 * @param {string} name The name of the performance mark.
 * @param {any} detail The detail to pass to the performance mark.
 */
window.createPerformanceMark = (name, detail = undefined) => {
    performance.mark(`perf-start-${name}`, detail ? { detail } : undefined);
    // eslint-disable-next-line no-console
    console.debug(`perf-${name} started at ${performance.now()} + ms`);
  };
  
  /**
   * Measure the time between two performance marks.
   * @param {string} name The name of the performance mark.
   */
  window.measurePerformance = (name) => {
    performance.mark(`perf-stop-${name}`);
    const duration = performance.measure(`perf-${name}`, `perf-start-${name}`, `perf-stop-${name}`);
    // eslint-disable-next-line no-console
    console.debug(`perf-${name} stopped at ${performance.now()} ms`);
    // eslint-disable-next-line no-console
    console.debug(`perf-${name} took ${duration.duration} ms`);
  };
  