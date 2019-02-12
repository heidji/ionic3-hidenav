import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class HidenavService {

    data: any = [];

    scrollTop = 0;
    navheight = 0;
    direction: any;
    lastscroll = 0;

    initiate(name) {
        let parent = this.data[name].parent;
        let content = this.data[name].content;
        if (!parent) {
            let header = this.data[name].header;
            let content = this.data[name].content;
            setTimeout(() => {
                let n: any = content._scrollContent.nativeElement;
                n.style.paddingTop = n.style.marginTop;
                n.style.marginTop = 0;
                this.navheight = header._elementRef.nativeElement.offsetHeight;
            }, 100);

            content.ionScroll.subscribe(() => {
                let x = this.lastscroll - content.scrollTop;
                if (x < 0)
                    this.direction = 'down';
                else
                    this.direction = 'up';
                this.lastscroll = content.scrollTop;
                this.scrollTop = this.scrollTop - x;
                if (this.scrollTop > this.navheight)
                    this.scrollTop = this.navheight;
                if (this.scrollTop < 0)
                    this.scrollTop = 0;
                let h: any = header._elementRef;
                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
            });
            content._elementRef.nativeElement.addEventListener('touchend', this.c.bind(this, name));
        } else if (parent) {
            let header = this.data[parent].header;
            let tabscontent = this.data[parent].tabscontent;
            let h = tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').offsetHeight;
            setTimeout(() => {
                if(typeof tabscontent._scroll._el != 'undefined'){
                    let n: any = tabscontent._scroll._el;
                    n.style.paddingTop = h + 'px';
                    n.style.marginTop = 0;
                }
                this.navheight = header._elementRef.nativeElement.offsetHeight;
                content._scrollContent.nativeElement.style.paddingTop = h + 'px';

                tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.top = this.navheight + 'px';
                setTimeout(() => {
                    tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height = '100%';
                    tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position = 'absolute';
                }, 100)
            }, 50);


            content.ionScroll.subscribe(() => {
                let x = this.lastscroll - content.scrollTop;
                if (x < 0)
                    this.direction = 'down';
                else
                    this.direction = 'up';
                this.lastscroll = content.scrollTop;
                this.scrollTop = this.scrollTop - x;
                if (this.scrollTop > this.navheight)
                    this.scrollTop = this.navheight;
                if (this.scrollTop < 0)
                    this.scrollTop = 0;
                let h: any = header._elementRef;
                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
            });
            content._elementRef.nativeElement.addEventListener('touchend', this.ct.bind(this, name, parent));
        }
    }

    private c(name) {
        if(this.scrollTop == 0 || this.scrollTop == this.navheight)
            return false;
        let header = this.data[name].header;
        let content = this.data[name].content;
        let h: any = header._elementRef;
        let x = 40;
        let sub = Observable.interval(5)
            .takeWhile(() => (x > 0))
            .subscribe(i => {
                x -= 1;
                if (!content.isScrolling) {
                    if (this.direction == 'down') {
                        Observable.interval(6)
                            .takeWhile(() => (this.scrollTop < this.navheight))
                            .subscribe(i => {
                                if (this.scrollTop > this.navheight) this.scrollTop = this.navheight;
                                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                            });
                        if (this.scrollTop < this.navheight) {
                            content.scrollTo(0, content.scrollTop + this.navheight - this.scrollTop, ((this.navheight - this.scrollTop) / 2) * 6);
                        }
                    } else if (this.direction == 'up') {
                        Observable.interval(6)
                            .takeWhile(() => (this.scrollTop > 0))
                            .subscribe(i => {
                                if (this.scrollTop < 0) this.scrollTop = 0;
                                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                            });
                        if (this.scrollTop < this.navheight) {
                            content.scrollTo(0, content.scrollTop - this.scrollTop, (this.scrollTop / 2) * 6);
                        }
                        sub.unsubscribe();
                    }
                }
            });
    }

    private ct(name, parent) {
        if(this.scrollTop == 0 || this.scrollTop == this.navheight)
            return false;
        let header = this.data[parent].header;
        let content = this.data[name].content;
        let tabscontent = this.data[parent].tabscontent;
        let h: any = header._elementRef;
        let x = 40;
        let sub = Observable.interval(5)
            .takeWhile(() => (x > 0))
            .subscribe(i => {
                x -= 1;
                if (!content.isScrolling) {
                    if (this.direction == 'down') {
                        Observable.interval(6)
                            .takeWhile(() => (this.scrollTop < this.navheight))
                            .subscribe(i => {
                                this.scrollTop += 2;
                                if (this.scrollTop > this.navheight) this.scrollTop = this.navheight;
                                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                                tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                            });
                        if (this.scrollTop < this.navheight) {
                            content.scrollTo(0, content.scrollTop + this.navheight - this.scrollTop, ((this.navheight - this.scrollTop) / 2) * 6);
                        }
                    } else if (this.direction == 'up') {
                        Observable.interval(6)
                            .takeWhile(() => (this.scrollTop > 0))
                            .subscribe(i => {
                                this.scrollTop -= 2;
                                if (this.scrollTop < 0) this.scrollTop = 0;
                                h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                                tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
                            });
                        if (this.scrollTop < this.navheight) {
                            content.scrollTo(0, content.scrollTop - this.scrollTop, (this.scrollTop / 2) * 6);
                        }
                    }
                    sub.unsubscribe();
                }
            });
    }

    public reset(name) {
        let header = this.data[name].header;
        let tabscontent = this.data[name].tabscontent;
        this.scrollTop = 0;
        let h: any = header._elementRef;
        h.nativeElement.style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = "translate3d(0, " + -this.scrollTop + "px, 0)";
    }

}
