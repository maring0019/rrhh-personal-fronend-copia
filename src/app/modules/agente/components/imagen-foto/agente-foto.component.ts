import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AgenteService } from 'src/app/services/agente.service';

import { Agente } from 'src/app/models/Agente';

@Component({
    selector: 'app-agente-foto',
    templateUrl: './agente-foto.html'
})

export class AgenteFotoComponent implements OnChanges{
    @Input() agente: Agente;
    foto:any;

    constructor(private sanitizer: DomSanitizer, private agenteService: AgenteService){ }

    ngOnChanges(){
        this.displayFoto();
    }

    displayFoto(){
        this.agenteService.getFoto(this.agente.id).subscribe(data => {
            this.foto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + data);
        });
    }
}