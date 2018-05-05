declare var $;

export class LoadingHelper {

    private static _isLoading: boolean;

    public static get isLoading() {
        return this._isLoading;
    }

    public static set isLoading(value: boolean) {
        this._isLoading = value;
        this.checkBodyBlur();
    }

    private static checkBodyBlur() {
        if (LoadingHelper.isLoading)
            $('body').addClass('blur');
        else
            $('body').removeClass('blur');
    }
}