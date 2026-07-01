import { createToast } from "./toastManager";

/**
 * Throw error and display the message to the user as a toast
 */
export class ToastyError extends Error {
    constructor(reason: string, logLevel: "info" | "warning" | "error" = "error") {
        super(reason);
        createToast({ body: reason, type: logLevel })
    }
}