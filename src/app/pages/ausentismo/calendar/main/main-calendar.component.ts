import { Component, OnInit, ViewChild, Input, Output, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { getTomorrow } from 'src/app/utils/dates';
import { CalendarStoreService, IDateRangeSelection } from 'src/app/stores/calendar.store.service';


@Component({
    selector: 'app-main-calendar',
    templateUrl: 'main-calendar.html'
})

export class MainCalendarComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() eventos;
    @Input() options;
    @Input() mesSeleccionado:Date;
    @Input() weekends:Boolean;

    @Output() changedDate: EventEmitter<Date> = new EventEmitter<Date>();
   
    @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

    storeSubscription: Subscription;
    private _rangeSelection: IDateRangeSelection;
    
    constructor(private calendarStoreService: CalendarStoreService){
            this.storeSubscription = this.calendarStoreService.selectionRange$
                .subscribe(rangeSelection => {
                    if (rangeSelection) {
                        this.updateSelectedMonthView(rangeSelection.fechaDesde);
                    }
                    this._rangeSelection = rangeSelection;
                    this.marcarPeriodoSeleccionado();
                });
        }

    
    calendarApi:any;
    mesVisualizado:Date = new Date(2013, 1, 1);
    
    calendarPlugins = [dayGridPlugin, interactionPlugin];

    header = {
        left: '',
        center: 'title',
        right: ''
    };
    columnHeaderText = (date: Date) : string => {
        var days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        var shortDayName = days[date.getDay()];
        return shortDayName;
    }
    
    public ngOnInit() {

    }

    ngAfterViewInit(){
        this.calendarApi = this.calendarComponent.getApi();
    }

    ngOnChanges(){
        if (this.mesSeleccionado != this.mesVisualizado){
            this.mesVisualizado = this.mesSeleccionado;
            if (this.calendarApi){
                this.calendarApi.gotoDate(this.mesVisualizado);
            }
        }
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
      }

    public gotoNextMonth(){
        this.updateSelectedMonthView(this._getNextMonth(this.mesVisualizado));
        this.marcarPeriodoSeleccionado();
    }

    public gotoPreviousMonth(){
        this.updateSelectedMonthView(this._getPrevMonth(this.mesVisualizado));
        this.marcarPeriodoSeleccionado();
    }

    public onDateClick(e){
        this.calendarStoreService.selectionRange = { fechaDesde:e.date, fechaHasta:getTomorrow(e.date) };
    }

    public onEventClick(e){
        if (e && e.event){
            console.log('EVENTO#############CLICKED');
            console.log(e)
            const props = e.event.extendedProps;

            this.calendarStoreService.selectionRange = { fechaDesde:props.ausentismoFechaDesde, fechaHasta:getTomorrow(props.ausentismoFechaHasta) };
            this.enableContextMenu(e);
        }
    }


    public onDateRangeSelection(e){
        this.calendarStoreService.selectionRange = { fechaDesde:e.start, fechaHasta:e.end };
    }

    private updateSelectedMonthView(newMonth:Date){
        this.mesVisualizado = newMonth;
        this.mesSeleccionado = newMonth;
        if (this.calendarApi) this.calendarApi.gotoDate(this.mesVisualizado);
        
        this.changedDate.emit(this.mesVisualizado);
    }

    private marcarPeriodoSeleccionado(){
        console.log('MARCAR PERIODO SELECCIONADO###########')
        if (this.calendarApi){
            if (this._rangeSelection){
                this.calendarApi.select(this._rangeSelection.fechaDesde, this._rangeSelection.fechaHasta );
            }
            else{
                this.calendarApi.unselect();
            }    
        }
    }

    contextmenu = true;
    contextmenuX = 0;
    contextmenuY = 0;

    //activates the menu with the coordinates
    enableContextMenu(e){
        this.contextmenuX=e.jsEvent.clientX
        this.contextmenuY=e.jsEvent.clientY
        this.contextmenu=true;
    }
    //disables the menu
    disableContextMenu(){
        this.contextmenu= false;
    }

    private _getNextMonth(currentMonth:Date):Date{
        return new Date(new Date(currentMonth).setMonth(currentMonth.getMonth()+1));
    }

    private _getPrevMonth(currentMonth:Date):Date{
        return new Date(new Date(currentMonth).setMonth(currentMonth.getMonth()-1));
    }
}
