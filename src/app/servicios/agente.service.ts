import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Agente } from '../modelos/agente';
import { AGENTES } from '../servicios/hardcode-agentes';
import { MensajeService } from '../servicios/mensaje.service';


@Injectable({
  providedIn: 'root'
})
export class AgenteService {


  constructor(private MensajeService: MensajeService) {}
    
    getAgentes(): Observable<Agente[]> {
      this.MensajeService.add('AgenteService: fetched agentes');
      return of (AGENTES);
    }
    getAgente(id: number | string) {
      return this.getAgentes().pipe(
        map((agentes: Agente[]) => agentes.find(agente => agente.id === +id))
      );
    }
   }
