import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownItem, Plex } from '@andes/plex';
import { CRUDItemListComponent } from 'src/app/modules/tm/components/crud/list/item/crud-item-list.component';


@Component({
    selector: 'app-articulo-item-list',
    templateUrl: './articulo-item-list.html',
})
export class ArticuloItemListComponent extends CRUDItemListComponent{
    
    constructor(public router: Router, public plex: Plex) {
        super(router, plex);
    }

} 