import {Directive, Host, Self, Optional, Input} from '@angular/core';
import { Content } from "ionic-angular";
import {HidenavService} from "./hidenavService";
import $ from 'jquery';

@Directive({
    selector: '[hidenav-content]'
})
export class HidenavContent {

    @Input('hidenav-content') name: string;
    @Input('hidenav-parent') parent: string;
    constructor( @Host() @Self() @Optional() public el: Content, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        if(!this.el._elementRef.nativeElement.hasAttribute('hidenav-tabspage')){
            this.name = this.globals.requestName();
            $(this.el._elementRef.nativeElement).attr('hidenav-content', this.name);
            $('[hidenav-header]', $(this.el._elementRef.nativeElement).parents().get().find(itm => $(itm).find('[hidenav-header]').length)).attr('hidenav-header', this.name);
            this.start();
        }else{
            let counter = 0;
            let int = setInterval(() => {
                let x = $(this.el._elementRef.nativeElement).closest('[hidenav-tabscontent]').attr('hidenav-tabscontent');
                counter++;
                if(x && x.length > 0){
                    this.parent = $(this.el._elementRef.nativeElement).closest('[hidenav-tabscontent]').attr('hidenav-tabscontent');
                    this.name = this.globals.requestTabName(this.parent);
                    $(this.el._elementRef.nativeElement).attr('hidenav-content', this.name);
                    $(this.el._elementRef.nativeElement).attr('hidenav-tabspage', this.parent);
                    this.start();
                    clearInterval(int);
                }else if(counter > 50){
                    clearInterval(int);
                }
            }, 50)
        }
    }
    
    start() {
        if(typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        this.globals.data[this.name].content = this.el;
        this.globals.data[this.name].parent = this.parent;
        this.globals.initiate(this.name);
    }

    ngOnDestroy() {
        this.globals.data[this.name] = null;
    }
}