import { TranslateService } from "@ngx-translate/core";
import { injectable } from "inversify";

declare var $;

/**
 * The notification helper
 */
@injectable()
export class NotificationHelper {

    /** The translate service initialized at app startup (app.component) */
    private static translateService: TranslateService;

    /**
     * Inject deps
     */
    constructor(translateService: TranslateService) {
        NotificationHelper.translateService = translateService;
    }

    /**
     * Show a new notification
     * @param message The message
     * @param icon The icon
     * @param type The type
     */
    public static async showNotification(message: string, icon: string, type: 'info' | 'success' | 'warning' | 'danger') {
        $.notify(
            {
                icon: icon,
                message: await NotificationHelper.translateService.get(message).toPromise()
            },
            {
                type: type,
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            }
        );
    }
}