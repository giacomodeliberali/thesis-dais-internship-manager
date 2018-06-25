// Pipe
<p>
    {{'Dictionary.Back' | translate}}
</p>

// Directive
<p translate [translate-params]="currentUser">
    Pages.Index.SubTitle
</p>

// Service
const translatesString = await 
    this.translateService.get('Pages.Index.Title');