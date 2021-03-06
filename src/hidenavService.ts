import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class HidenavService {

    data: any = [];
    tapping = false;
    names = [];
    tabnames = [];

    requestName(){
        let name = 'page'+this.names.length;
        this.names.push(name);
        return name;
    }

    requestTabName(name){
        if(!this.tabnames[name])
            this.tabnames[name] = [];
        let tabname = name+'tab'+this.tabnames[name].length;
        this.tabnames[name].push(tabname);
        return tabname;
    }

    initiate(name) {
        if (!(this.data[name] && (this.data[name].parent && this.data[this.data[name].parent].tabscontent && this.data[name].content && this.data[this.data[name].parent].header) || (!this.data[name].parent && this.data[name].content && this.data[name].header)))
            return false;
        let parent = this.data[name].parent;
        let content = this.data[name].content;
        //make sure to know if the user is controlling the scroll so we can handle incomplete scrolls
        content._elementRef.nativeElement.addEventListener('touchstart', () => this.tapping = true);
        //if it's a simple page
        if (!parent) {
            let header = this.data[name].header;
            let content = this.data[name].content;

            content.ionScroll.subscribe(() => {
                if (content.scrollTop > 0) {
                    //exchange content margin with padding in order to make the content scroll to top of page
                    if (typeof content._scroll._el != 'undefined') {
                        if (this.data[name].marginTop == null)
                            this.data[name].marginTop = parseInt(window.getComputedStyle(content._scroll._el)['margin-top'], 10);
                        if (this.data[name].paddingTop == null)
                            this.data[name].paddingTop = parseInt(window.getComputedStyle(content._scroll._el)['padding-top'], 10);
                        if (this.data[name].navheight == null)
                            this.data[name].navheight = header._elementRef.nativeElement.offsetHeight;
                        (<any>content._scroll._el).style.paddingTop = this.data[name].paddingTop + this.data[name].marginTop + 'px';
                        (<any>content._scroll._el).style.marginTop = 0;
                    }
                } else {
                    this.reset(name);
                }

                if (this.data[name].lastscroll == null)
                    this.data[name].lastscroll = 0;
                let x = this.data[name].lastscroll - content.scrollTop;
                if (x < 0)
                    this.data[name].direction = 'down';
                else
                    this.data[name].direction = 'up';
                this.data[name].lastscroll = content.scrollTop;
                if (this.data[name].scrollTop == null)
                    this.data[name].scrollTop = 0;
                this.data[name].scrollTop = this.data[name].scrollTop - x;
                if (this.data[name].scrollTop > this.data[name].navheight)
                    this.data[name].scrollTop = this.data[name].navheight;
                if (this.data[name].scrollTop < 0)
                    this.data[name].scrollTop = 0;
                (<any>header._elementRef).nativeElement.style.transform = "translate3d(0, " + -this.data[name].scrollTop + "px, 0)";
            });
            content._elementRef.nativeElement.addEventListener('touchend', this.c.bind(this, name));

            content.ionScrollEnd.subscribe(() => {
                if (!this.tapping) {
                    this.c(name);
                }
                //check if the event missed out one last tick (for reset, white banner syndrome)
                setTimeout(() => {
                    if (content.scrollTop == 0) {
                        this.reset(name);
                    }
                }, 10)
            })

            //if it s supertabs page
        } else if (parent) {
            content.ionScroll.subscribe(() => {
                let header = this.data[parent].header;
                let tabscontent = this.data[parent].tabscontent;
                if (content.scrollTop > 0) {
                    let x = content.scrollTop;
                    let toolbarOffsetHeight = tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').offsetHeight;
                    if (typeof tabscontent._scroll._el != 'undefined') {
                        //assign the previous content margin top to a variable
                        if (this.data[parent].marginTop == null)
                            this.data[parent].marginTop = (<any>tabscontent._scroll._el).style.marginTop;
                        if (this.data[name].marginTop == null)
                            this.data[name].marginTop = parseInt(window.getComputedStyle(content._scroll._el)['margin-top'], 10);
                        if (this.data[name].paddingTop == null)
                            this.data[name].paddingTop = parseInt(window.getComputedStyle(content._scroll._el)['padding-top'], 10);
                        //then exchange margin top with padding top
                        (<any>tabscontent._scroll._el).style.paddingTop = toolbarOffsetHeight + 'px';
                        (<any>tabscontent._scroll._el).style.marginTop = 0;
                    }

                    //shift the content page below the supertabs toolbar
                    content._scrollContent.nativeElement.style.paddingTop = toolbarOffsetHeight + this.data[name].marginTop + this.data[name].paddingTop + 'px';

                    this.data[name].navheight = header._elementRef.nativeElement.offsetHeight;
                    tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.top = this.data[name].navheight + 'px';

                    //change the position type of supertabs toolbar to make it ready to scroll and save initial height value for resets
                    if (this.data[parent].containerHeight == null)
                        this.data[parent].containerHeight = tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height;
                    tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height = '100%';
                    //sometimes the content jumps once the scroll is initiated yielding a bad animation
                    if(tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position != 'absolute'){
                        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position = 'absolute';
                        content.scrollTop = x;
                    }

                } else {
                    //reset the scroll
                    this.reset(name)
                }

                if (this.data[name].lastscroll == null)
                    this.data[name].lastscroll = 0;
                let deltaY = this.data[name].lastscroll - content.scrollTop;
                if (deltaY < 0)
                    this.data[name].direction = 'down';
                else
                    this.data[name].direction = 'up';
                this.data[name].lastscroll = content.scrollTop;
                if (this.data[name].scrollTop == null)
                    this.data[name].scrollTop = 0;
                this.data[name].scrollTop = this.data[name].scrollTop - deltaY;
                if (this.data[name].scrollTop > this.data[name].navheight)
                    this.data[name].scrollTop = this.data[name].navheight;
                if (this.data[name].scrollTop < 0)
                    this.data[name].scrollTop = 0;
                //ANIMATE!
                (<any>header._elementRef).nativeElement.style.transform = "translate3d(0, " + -this.data[name].scrollTop + "px, 0)";
                tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = "translate3d(0, " + -this.data[name].scrollTop + "px, 0)";
            });
            //complete the scroll if user lets go of the screen prematurely
            content._elementRef.nativeElement.addEventListener('touchend', this.ct.bind(this, name));

            content.ionScrollEnd.subscribe(() => {
                if (!this.tapping) {
                    this.ct(name);
                }
                //check if the event missed out one last tick (for reset, white banner syndrome)
                setTimeout(() => {
                    if (content.scrollTop == 0) {
                        this.reset(name);
                    }
                }, 10)
            })
        }
    }

    private c(name) {
        this.tapping = false;
        if (this.data[name].scrollTop == 0 || this.data[name].scrollTop == this.data[name].navheight)
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
                    if (this.data[name].direction == 'down') {
                        content.scrollTo(0, content.scrollTop + this.data[name].navheight - this.data[name].scrollTop, (this.data[name].navheight - this.data[name].scrollTop) * 6).then(() => {
                            this.data[name].scrollTop = this.data[name].navheight;
                        });
                    } else if (this.data[name].direction == 'up') {
                        content.scrollTo(0, content.scrollTop - this.data[name].scrollTop, this.data[name].scrollTop * 6).then(() => {
                            this.data[name].scrollTop = 0;
                        });
                    }
                    sub.unsubscribe();
                }
            });
    }

    private ct(name) {
        this.tapping = false;
        if (this.data[name].scrollTop == 0 || this.data[name].scrollTop == this.data[name].navheight)
            return false;
        let content = this.data[name].content;
        let x = 40;
        let sub = Observable.interval(5)
            .takeWhile(() => (x > 0))
            .subscribe(i => {
                x -= 1;
                if (!content.isScrolling) {
                    if (this.data[name].direction == 'down') {
                        content.scrollTo(0, content.scrollTop + this.data[name].navheight - this.data[name].scrollTop, (this.data[name].navheight - this.data[name].scrollTop) * 6).then(() => {
                            this.data[name].scrollTop = this.data[name].navheight;
                        });
                    } else if (this.data[name].direction == 'up') {
                        content.scrollTo(0, content.scrollTop - this.data[name].scrollTop, this.data[name].scrollTop  * 6).then(() => {
                            this.data[name].scrollTop = 0;
                        });
                    }
                    sub.unsubscribe();
                }
            });
    }

    public reset(name) {
        let parent = this.data[name].parent;
        let content = this.data[name].content;
        if (parent) {
            let tabscontent = this.data[parent].tabscontent;
            let header = this.data[parent].header;
            if (typeof tabscontent._scroll._el != 'undefined') {
                //exchange tabscontent margin top with padding top
                (<any>tabscontent._scroll._el).style.marginTop = this.data[parent].marginTop;
                (<any>tabscontent._scroll._el).style.paddingTop = 0;
            }
            content._scrollContent.nativeElement.style.paddingTop = this.data[name].paddingTop + 'px';
            content._scrollContent.nativeElement.style.marginTop = this.data[name].marginTop + 'px';

            //revert supertabs behavior
            tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.top = '0px';
            tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height = this.data[parent].containerHeight;
            tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position = 'static';

            //Undo ANIMATE!
            (<any>header._elementRef).nativeElement.style.transform = null;
            tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = null;
        } else {
            let header = this.data[name].header;
            (<any>content._scroll._el).style.paddingTop = this.data[name].paddingTop + 'px';
            (<any>content._scroll._el).style.marginTop = this.data[name].marginTop + 'px';
            (<any>header._elementRef).nativeElement.style.transform = null;
        }
    }

    resetTabs(name) {
        let tabscontent = this.data[name].tabscontent;
        let header = this.data[name].header;
        if (typeof tabscontent._scroll._el != 'undefined') {
            //exchange tabscontent margin top with padding top
            (<any>tabscontent._scroll._el).style.marginTop = this.data[name].marginTop;
            (<any>tabscontent._scroll._el).style.paddingTop = 0;
        }

        //revert supertabs behavior
        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.top = '0px';
        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height = this.data[name].containerHeight;
        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position = 'static';

        //Undo ANIMATE!
        (<any>header._elementRef).nativeElement.style.transform = null;
        tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.transform = null;

        for (let key in this.data){
            if(this.data[key].parent == name){
                this.data[key].scrollTop = 0;
                this.data[key].lastScroll = 0;
            }
        }
    }

    checkHeight(name) {
        let tabscontent = this.data[name].tabscontent;
        if (!tabscontent)
            return false;
        if (tabscontent._scrollContent.nativeElement.querySelector('super-tabs-toolbar').style.position == 'absolute') {
            tabscontent._scrollContent.nativeElement.querySelector('super-tabs-container').style.height = '100%';
        }
    }

}
