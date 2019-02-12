import { NgModule, ModuleWithProviders } from '@angular/core';
import {HidenavTabscontent} from "./hidenavTabscontent";
import {HidenavContent} from "./hidenavContent";
import {HidenavHeader} from "./hidenavHeader";
import {HidenavService} from "./hidenavService";

@NgModule({
    declarations: [
        HidenavTabscontent,
        HidenavContent,
        HidenavHeader
    ],
    exports: [
        HidenavTabscontent,
        HidenavContent,
        HidenavHeader
    ]
})
export class HidenavModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HidenavModule,
            providers: [
                HidenavService
            ]
        };
    }
}