export const getStack = (fn: Function) => {
    const err = { stack: '' };

    Error.captureStackTrace(err, fn);

    const stack = err.stack as string;

    const stackLines = stack.split("\n");

    const callerLine = stackLines[1] || "";

    const regex = /at (?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/;

    const match = callerLine.match(regex);

    return match ? `${match[2]}:${match[3]}:${match[4]}` : "";
};
