import {Directive, Host, Self, Optional, Input, ContentChild} from '@angular/core';
import {HidenavService} from "./hidenavService";
import {Content} from "ionic-angular";
import {SuperTabsComponent} from "ionic2-super-tabs";
import $ from 'jquery';

@Directive({
    selector: '[hidenav-tabscontent]'
})
export class HidenavTabscontent {

    @Input('hidenav-tabscontent') name: string;
    @ContentChild(SuperTabsComponent) supertabs: SuperTabsComponent;
    constructor(@Host() @Self() @Optional() public el: Content, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        this.name = this.globals.requestName();
        this.el._elementRef.nativeElement.setAttribute('hidenav-tabscontent', this.name);
        $('[hidenav-header]', $(this.el._elementRef.nativeElement).parents().get().find(itm => $(itm).find('[hidenav-header]').length)).attr('hidenav-header', this.name);
        if(typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        if(this.globals.data[this.name].tabscontent != null )
            console.warn('HIDENAV: "'+this.name + '" has been initialized before as TABSCONTENT, please make sure all your live directives carry unique names in order to avoid unexpected results');
        this.globals.data[this.name].tabscontent = this.el;

        if(this.supertabs){
            this.supertabs.tabSelect.subscribe(e => {
                if(e.changed == true){
                    this.globals.resetTabs(this.name);
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