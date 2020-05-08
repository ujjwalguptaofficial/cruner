export const addArg = (argv: string[], ...args: string[]): string[] => {
    const endOfArgsMarkerIndex = argv.indexOf('--');
    if (endOfArgsMarkerIndex === -1) {
        argv.push(...args);
    } else {
        // if the we have an argument "--" (end of argument marker)
        // we cannot add arguments at the end. rather, we add
        // arguments before the "--" marker.
        argv.splice(endOfArgsMarkerIndex, 0, ...args);
    }

    return argv;
}
