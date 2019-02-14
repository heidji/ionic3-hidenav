import {Directive, Host, Self, Optional, Input, ContentChild} from '@angular/core';
import {HidenavService} from "./hidenavService";
import {Content} from "ionic-angular";
import {SuperTabsComponent} from "ionic2-super-tabs";

@Directive({
    selector: '[hidenav-tabscontent]'
})
export class HidenavTabscontent {

    @Input('hidenav-tabscontent') name: string;
    @ContentChild(SuperTabsComponent) supertabs: SuperTabsComponent;
    constructor(@Host() @Self() @Optional() public el: Content, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        if(typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        if(this.globals.data[this.name].tabscontent != null )
            console.warn('HIDENAV: "'+this.name + '" has been initialized before as TABSCONTENT, please make sure all your live directives carry unique names in order to avoid unexpected results');
        this.globals.data[this.name].tabscontent = this.el;

        if(this.supertabs){
            this.supertabs.tabSelect.subscribe(e => {
                if(e.changed == true){
                    this.globals.reset(this.name);
                }
            })
        }
    }

    ngOnDestroy() {
        this.globals.data[this.name] = null;
    }

    ngAfterViewChecked() {
        this.globals.checkHeight(this.name);
    }
}