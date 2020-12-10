import morgan from 'morgan'
import chalk from 'chalk'

export default morgan(function (tokens, req, res) {
    return [
        chalk.hex('#2A1DAD').bold('   > '),
        chalk.hex('#34ACE0').bold('[' + tokens.date(req, res) + ']'),
        chalk.hex('#B43041').bold(tokens.method(req, res)),
        chalk.hex('#F4D47C').bold(tokens.status(req, res)),
        chalk.hex('#534239').bold(tokens.url(req, res)),
        chalk.hex('#2ED573').bold(tokens['response-time'](req, res) + ' ms'),
    ].join(' ');
})