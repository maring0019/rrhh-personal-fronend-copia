import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Plex } from '@andes/plex';

import { ABMCreateUpdateComponent } from '../../crud/abm-create-update.component';
import { ObjectService } from 'src/app/services/tm/object.service';
import { ArticuloService } from 'src/app/services/articulo.service';

@Component({
    selector: 'app-articulo-create-update',
    templateUrl: 'articulo-create-update.html'
  })

export class ArticuloCreateUpdateComponent extends ABMCreateUpdateComponent {

    titulo = 'Artículos';
    
    constructor(
        protected route: ActivatedRoute,
        protected location: Location,
        protected plex: Plex,
        protected formBuilder: FormBuilder,
        protected objectService: ObjectService,
        private articuloService: ArticuloService)
    {
        super(route, location, plex, formBuilder, objectService)
    }

    protected get dataService(){
        return this.articuloService;
    }

    protected initForm(){
        return this.formBuilder.group({
            _id                   : [this.object._id],
            codigo                : [this.object.codigo],
            nombre                : [this.object.nombre],
            descripcion           : [this.object.descripcion],
            color                 : [this.object.color],
            diasCorridos          : [this.object.diasCorridos],
            diasHabiles           : [this.object.diasHabiles],          
            descuentaDiasLicencia : [this.object.descuentaDiasLicencia]
        });
    }
}