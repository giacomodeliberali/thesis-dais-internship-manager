declare var $;

export class LoadingService {

    private _isLoading: boolean;

    public get isLoading() {
        return this._isLoading;
    }

    public set isLoading(value: boolean) {
        this._isLoading = value;
        this.checkBodyBlur();
    }

    private checkBodyBlur() {
        if (this.isLoading)
            $('body').addClass('blur');
        else
            $('body').removeClass('blur');
    }
}