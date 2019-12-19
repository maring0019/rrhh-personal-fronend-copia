import { Agrupamiento } from './Agrupamiento';
import { GuardiaPeriodo } from './GuardiaPeriodos';
import { Servicio } from './Servicio';
import { GuardiaLote } from './GuardiaLote';

interface IDiaGuardia {
    fecha?: Date,
    diaCompleto?: Boolean
}

export class ItemGuardiaPlanilla {
    agente: {
        id: String,
        nombre: String,
        apellido: String,
        numero: String
    }
    diasGuardia:  IDiaGuardia[]; // false si es medio dia

    get totalDias(){
        return this.diasGuardia
            .reduce((sum, dia) => {
                if (dia && dia.diaCompleto) return sum + 1;
                if (dia && !dia.diaCompleto) return sum + 0.5;
                return sum }
            , 0); // sum es el acumulador, se inicializa en 0
    }

    constructor(planilla?)
    {
        planilla = planilla || {};
        this.agente = planilla.agente? planilla.agente: null;
        this.diasGuardia = planilla.diasGuardia? planilla.diasGuardia: [];
    }
}

export class Guardia {
    id?: String;
    periodo: GuardiaPeriodo;
    lote: GuardiaLote;
    servicio: Servicio;
    tipoGuardia: String;
    categoria: Agrupamiento;
    planilla: ItemGuardiaPlanilla[];
    estado: String;
    fechaEntrega: Date;
    responsableEntrega: {    // Agente Jefe de Servicio
        id: String,
        nombre: String,
        apellido: String
    };
    validado: Boolean;
    responsableValidacion: { // Agente de Gestion de Personal
        id: String,
        nombre: String,
        apellido: String
    }; 
    fechaValidacion: Date;
    
    get guardiasPorDia():Number[]{
        let totales = [];
        this.periodo.range.forEach((item, index) => {
            let totalDia = 0;
            this.planilla.forEach(elem => {
                const diaGuardia = elem.diasGuardia[index];
                if (diaGuardia && diaGuardia.diaCompleto) totalDia += 1;
                if (diaGuardia && !diaGuardia.diaCompleto) totalDia += 0.5;
            });
            totales[index] = totalDia;
        });
        return totales;
    } 

    constructor(guardia?)
    {
        guardia = guardia || {};
        this.id = guardia.id || null;
        this.periodo = guardia.periodo? new GuardiaPeriodo(guardia.periodo): null;
        this.lote = new GuardiaLote(guardia.lote);
        this.servicio = guardia.servicio? new Servicio(guardia.servicio): null;
        this.tipoGuardia = guardia.tipoGuardia?
            ((typeof guardia.tipoGuardia === 'string') ? guardia.tipoGuardia : guardia.tipoGuardia.id) : null;
        this.categoria = guardia.categoria? new Agrupamiento(guardia.categoria): null;
        
        this.planilla = [];
        if (guardia.planilla && guardia.planilla.length){
            guardia.planilla.forEach(e => {
                this.planilla.push(new ItemGuardiaPlanilla(e));
            });
        }
        
        this.estado = guardia.estado ;
        this.fechaEntrega = guardia.fechaEntrega;
        this.responsableEntrega = guardia.responsableEntrega;
        this.validado = guardia.validado;
        this.responsableValidacion = guardia.responsableValidacion;
        this.fechaValidacion = guardia.fechaValidacion;
    }

}