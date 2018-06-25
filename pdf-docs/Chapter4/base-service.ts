/**
 * Make a GET request to the specified path
 * @param path The path (baseUrl already included)
 * @param options The options to pass to the HttpClient
 */
protected getVerb<T>(path: string, options?: HttpOption): 
                                            Promse<ApiResponseDto<T>> {

    const httpOptions = Object.assign({
        headers: {
            [Defaults.JwtHeaderName]: this.authService.token || ''
        }
    }, options || {});

    return this.httpClient
        .get(`${environment.apiServicesBaseUrl}/${path}`, httpOptions)
        .toPromise();
}