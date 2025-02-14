import { transports, format } from "winston"
import fs from "fs"

export function getLoggerOptions(scenarioName: string) {
    const logDir = `test-results/logs/${scenarioName}`

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
    }

    return {
        level: "info",
        format: format.combine(
            format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
            format.align(),
            format.printf(({ level, message, timestamp }) => `${level}: ${timestamp}: ${message}`)
        ),
        transports: [
            new transports.Console(), // Logs to console
            new transports.File({ filename: `${logDir}/log.log` }) // Logs to file
        ]
    };
}
