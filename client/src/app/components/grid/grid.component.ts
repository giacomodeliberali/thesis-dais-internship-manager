import { Component, Input, PipeTransform, TemplateRef, ViewChild, EventEmitter, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "../../helpers/loading.helper";
/**
 * A grid component, wrapper for 
 * https://github.com/swimlane/ngx-datatable/blob/master/demo/basic/scrolling.component.ts
 * http://swimlane.github.io/ngx-datatable/#flex
 *
 * @export
 * @class GridComponent
 * @implements {OnInit}
 * @template T The  type of grid items
 */
@Component({
    moduleId: module.id,
    selector: 'grid-cmp',
    templateUrl: 'grid.component.html'
})
export class GridComponent<T> implements OnInit, OnChanges {

    /** The inner grid instance */
    @ViewChild(DatatableComponent) table: DatatableComponent;

    /** Emit an event every time a new row gets selected. The event contains the selected row object of type T */
    onRowSelection = new EventEmitter<T>();

    /** The columns */
    @Input()
    columns: Array<Column<T>>;
    _columns: Array<Column<T>>;

    /** The rows */
    @Input()
    rows: Array<T>;
    @Input()
    allRows: Array<T>;

    /** The localized messages */
    messages = null;


    /**
     * Creates an instance of GridComponent.
     * @param {TranslateService} translateService
     * @param {LoadingService} loadingService
     */
    constructor(
        private translateService: TranslateService,
        private loadingService: LoadingService) {

        this.loadingService.isLoading = true;
    }

    /**
     * Listed for @Input() changes
     *
     * @param {SimpleChanges} changes The changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['rows'].currentValue)
            this.loadingService.isLoading = false;
    }

    /**
     * Translate columns and assign it to the grid
     */
    async ngOnInit() {
        this._columns = await Promise.all(this.columns.map(async c => {
            c.name = await this.translateService.get(c.name).toPromise();
            return c;
        }));

        this.messages = {
            // Message to show when array is presented
            // but contains no values
            emptyMessage: await this.translateService.get('Dictionary.NoResults').toPromise(),

            // Footer total message
            totalMessage: await this.translateService.get('Dictionary.TotalRows').toPromise()
        };
    }

    onSelect(event) {
        this.onRowSelection.emit(event.selected[0]);
    }

    /**
     * Access the object by path. eg val(obj,'uno.due.tre') return obj.uno.due.tre
     * @param obj The object
     * @param path The path
     */
    private getValue(obj: any, path: string) {

        const paths = path.split('.');
        let current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    };


    /**
     * Search in all columns the text value and filter items
     *
     * @param {*} event The  keyup event
     */
    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();


        if (!val) {
            this.rows = JSON.parse(JSON.stringify(this.allRows));
        } else {
            // filter our data
            const temp = this.allRows.filter(d => {
                let ok = false;
                this.columns.map(c => c.prop).forEach(k => {
                    const colValue = this.getValue(d, k);
                    if (colValue)
                        ok = ok || colValue.toString().toLowerCase().indexOf(val) !== -1;
                });
                return ok;
            });

            // update the rows
            this.rows = JSON.parse(JSON.stringify(temp));
        }


        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

}

/**
 * The columns settings
 */
export class Column<T> {
    name: string;
    prop: string;
    pipe?: PipeTransform;
    cellTemplate?: TemplateRef<any>;
    headerTemplate?: TemplateRef<any>;
    cellClass?: string;
}
