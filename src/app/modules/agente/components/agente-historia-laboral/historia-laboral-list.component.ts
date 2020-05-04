import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';

import { ABMListComponent } from 'src/app/modules/tm/components/crud/abm-list.component';
import { AgenteBajaFormComponent } from 'src/app/modules/agente/components/agente-baja/agente-baja-form-component';

import { Agente } from 'src/app/models/Agente';
import { ObjectService } from 'src/app/services/tm/object.service';
import { ModalService } from 'src/app/services/modal.service';
import { AgenteService } from 'src/app/services/agente.service';

@Component({
    selector: 'app-historia-laboral-list',
    templateUrl: './historia-laboral-list.html'
  })

export class HistoriaLaboralListComponent extends ABMListComponent {
    @Input() editable:Boolean;
    @Input() agente: Agente;
    @Input() historiaLaboral:any[];

    @Output() changed: EventEmitter<Agente> = new EventEmitter<Agente>();

    @ViewChild(AgenteBajaFormComponent) bajaFormComponent: AgenteBajaFormComponent;

    public readonly modal_id_create = 'create';
    public readonly modal_id_baja = 'baja';
    public readonly modal_id_modificacion = 'modificacion';
    public readonly modal_id_reactivacion = 'reactivacion';

    public canEditHistoria = false;

    constructor(
        protected router: Router,
        protected objectService: ObjectService,
        private agenteService: AgenteService,
        private modalService: ModalService,
        private plex: Plex){
            super(router, objectService)
        }

    public ngOnInit() {
        // Los items los inicializamos sencillamente con 
        // los valores del Input. No es necesario hacer
        // una busqueda utilizando los servicios.
        this.items = this.historiaLaboral;
    }

    public nuevaHistoriaLaboral(){
        this.onOpenModal(this.modal_id_create);
    }

    public onOpenModal(modalId:string){
        this.modalService.open(modalId);
    }

    public onCancelModal(modalId:string){
        this.modalService.close(modalId);
    }

    public onItemView(item:any){
        this.viewOrEdit(item, false);
    }

    public onItemEdit(item:any){
        this.viewOrEdit(item, true);
    }

    public onItemDelete(item:any){
        this.agenteService.deleteHistoriaLaboral(this.agente, item)
            .subscribe(
                agente => {
                    this.items = this.items.filter(x => x._id != item._id);
                    this.plex.info('success', 'Se eliminó correctamente el Item');
                },
                error => this.plex.info('error', 'No se pudo eliminar correctamente el Item')
            )
    }
  

    private viewOrEdit(item:any, canEdit:boolean){
        this.itemSelected = item;
        this.canEditHistoria = canEdit;
        switch (item.tipo) {
            case 'modificacion':
            case 'alta':
                this.onOpenModal(this.modal_id_modificacion);
                break;
            case 'baja':
                this.onOpenModal(this.modal_id_baja);
                break;
            case 'reactivacion':
                this.onOpenModal(this.modal_id_reactivacion);
                break;
        }
    }

    public onSuccessHistoriaLaboralCreate(agente:Agente){
        // this.historiaLaboral = agente.historiaLaboral;
        this.changed.emit(agente);
        this.modalService.close(this.modal_id_create);
        this.plex.info('success', 'Se actualizó correctamente la Historia Laboral del Agente');

    }

    public updateBaja(){
        if (this.bajaFormComponent.invalid()) return;
        let changeset = this.bajaFormComponent.values();
        let datosBaja = {
            _id: this.itemSelected._id,
            tipo: this.itemSelected.tipo,
            changeset: changeset
        }
        this.agenteService.updateHistoriaLaboral(this.agente, datosBaja)
            .subscribe(
                agente => {
                    this.onCancelModal(this.modal_id_baja);
                    this.items = agente.historiaLaboral;
                    this.plex.info('success', 'Se actualizó correctamente el Item');
                },
                 error => this.plex.info('error', 'No se pude actualizar correctamente el Item')
                 
            )
    }




    public onSuccessBaja(event){

    }

    public onErrorBaja(event){

    }
}