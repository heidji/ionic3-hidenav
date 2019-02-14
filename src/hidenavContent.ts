import {Directive, Host, Self, Optional, Input} from '@angular/core';
import { Content } from "ionic-angular";
import {HidenavService} from "./hidenavService";

@Directive({
    selector: '[hidenav-content]'
})
export class HidenavContent {

    @Input('hidenav-content') name: string;
    @Input('hidenav-parent') parent: string;
    constructor( @Host() @Self() @Optional() public el: Content, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        if(typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        if(this.globals.data[this.name].content != null )
            console.warn('HIDENAV: "'+this.name + '" has been initialized before as CONTENT, please make sure all your live directives carry unique names in order to avoid unexpected results');
        this.globals.data[this.name].content = this.el;
        this.globals.data[this.name].parent = this.parent;
        this.globals.initiate(this.name);
    }

    ngOnDestroy() {
        this.globals.data[this.name] = null;
    }
}