import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var $;

/**
 * A date picker directive
 * 
 * Usage: <input type="date" datepicker [(date)]="model"
 */
@Directive({
  selector: '[datepicker]'
})
export class DatepickerDirective {

  @Input() date: string | Date;
  @Input() startDate: Date = null;
  @Output() dateChange: EventEmitter<string | Date> = new EventEmitter<string | Date>();

  constructor(
    private el: ElementRef,
    private translateService: TranslateService) {


  }

  ngOnInit() {
    // Init the date picker with current locale
    $(this.el.nativeElement).datepicker({
      language: this.translateService.currentLang,
      clearBtn: true,
      startDate: this.startDate
    });

    // Set initial value
    if (this.date)
      $(this.el.nativeElement).datepicker('setDate', new Date(this.date));

    // Subscribe and notify events
    $(this.el.nativeElement).datepicker()
      .on('changeDate', (e) => {
        this.dateChange.emit(e.date);
      }).on('clearDate', (e) => {
        this.dateChange.emit(null);
      });
  }

}
