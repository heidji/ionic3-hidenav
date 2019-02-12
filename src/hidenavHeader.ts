import {Directive, Host, Self, Optional, Input} from '@angular/core';
import {Header} from "ionic-angular";
import {HidenavService} from "./hidenavService";

@Directive({
    selector: '[hidenav-header]'
})
export class HidenavHeader {

    @Input('hidenav-header') name: string;
    constructor(@Host() @Self() @Optional() public el: Header, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        if(typeof this.globals.data[this.name] == 'undefined')
            this.globals.data[this.name] = [];
        this.globals.data[this.name].header = this.el;
    }
}