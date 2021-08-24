function handleArgs(args = {}) {
	const myArgs = process.argv.slice(2);
	myArgs.forEach(
		(arg, index) =>
			args[arg] && myArgs[index + 1] && args[arg](myArgs[index + 1])
	);
}

module.exports = handleArgs;
