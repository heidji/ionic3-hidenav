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
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if(this.el._elementRef.nativeElement.getAttribute('hidenav-header').length > 0) {
                    this.name = this.el._elementRef.nativeElement.getAttribute('hidenav-header');
                    this.start();
                    observer.disconnect();
                }
            });
        });
        observer.observe(this.el._elementRef.nativeElement, {
            attributes: true,
        });
    }

    start() {
        if(typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        if(this.globals.data[this.name].header != null )
            console.warn('HIDENAV: "'+this.name + '" has been initialized before as HEADER, please make sure all your live directives carry unique names in order to avoid unexpected results');
        this.globals.data[this.name].header = this.el;
        this.globals.initiate(this.name);
    }

    ngOnDestroy() {
        this.globals.data[this.name] = null;
    }
}