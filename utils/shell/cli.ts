import chalk from 'chalk';
import { getOwnPackageJson } from '../package/getOwnPackageJson';

/**
 * Checks if the provided arguments contain a help request.
 */
export function isHelpRequest(args: string[]): boolean {
	const helpVariants = ['--help', '-h', 'help'];
	return args.some((arg) => helpVariants.includes(arg.toLowerCase()));
}

/**
 * Checks if the provided arguments contain a version request.
 */
export function isVersionRequest(args: string[]): boolean {
	const versionVariants = ['--version', '-v', 'version'];
	return args.some((arg) => versionVariants.includes(arg.toLowerCase()));
}

/**
 * Prints the help information and exits.
 */
export function handleHelp(): void {
	console.log(`
${chalk.bold('hairper')} - AI to help you with Harper app management

${chalk.bold('USAGE')}
  $ hairper [options]
  $ hairper [command]

${chalk.bold('OPTIONS')}
  -h, --help              Show help information
  -v, --version           Show version information
  -m, --model             Specify the model to use (e.g., gpt-4o, claude-3-5-sonnet, ollama-llama3)
                          Can also be set via HAIRPER_MODEL environment variable.
                          For Ollama, use the ollama- prefix (e.g., ollama-llama3).
  -c, --compaction-model  Specify the compaction model to use (defaults to gpt-4o-mini).
                          Can also be set via HAIRPER_COMPACTION_MODEL environment variable.
  -s, --session           Specify a path to a SQLite database file to persist the chat session.
                          Can also be set via HAIRPER_SESSION environment variable.
  --flex-tier             Force the use of the flex service tier for lower costs but potentially 
                          more errors under high system load.
                          Can also be set via HAIRPER_FLEX_TIER=true environment variable.
  --no-spinner            Disable the thinking spinner (also: --disable-spinner)
                          Can also be set via HAIRPER_NO_SPINNER=1 or HAIRPER_DISABLE_SPINNER=1.
  --no-interruptions      Disable stdin-based interruption logic
                          Aliases: --no-interrupt, --no-interrupts, --disable-interrupt,
                                   --disable-interrupts, --disable-interruptions
                          Env: set HAIRPER_DISABLE_INTERRUPTION=1 or HAIRPER_DISABLE_INTERRUPTIONS=1
                               (default interruptions are enabled). You can also set
                               HAIRPER_ENABLE_INTERRUPTION=0 or HAIRPER_ENABLE_INTERRUPTIONS=0.

${chalk.bold('COMMANDS')}
  help           Show help information
  version        Show version information

${chalk.bold('EXAMPLES')}
  $ hairper --help
  $ hairper version
  $ hairper "create a new harper app"
`);
	process.exit(0);
}

/**
 * Prints the version and exits.
 */
export function handleVersion(): void {
	const pkg = getOwnPackageJson();
	console.log(pkg.version);
	process.exit(0);
}
