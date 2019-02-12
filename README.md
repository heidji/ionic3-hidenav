# Hide Navigation Bar for Ionic 3

Experimental Plugin for hardware accelerated navigation bar transitions while scrolling. There are two modes available, one with supertabs and one for normal pages.

## How to install

```
npm i ionic3-hidenav
```

## Adding Hidenav to Ionic Project

Update your **app.module.ts** as follows:

```
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

import {HidenavModule} from "ionic3-hidenav";

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HidenavModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}

```
if you're using **lazy loading** make sure to also import **HidenavModule** either globally using a shared.module.ts or in the each page module you're planning to use it on.
## Usage
In order to use the component in your project you need to specify the components which need to interact with each other to achieve the desired behavior.
There are two main actors which we need to choose: **ion-content** and **ion-header**, if you are planning to use the component on a supertabs page you will need to specify these components on different pages. more on that under **using with zyra/ionic2-super-tabs** below.

### home.html
```
<ion-header hidenav-header="homepage1">
  <ion-navbar>
    <ion-title>
      Ionic Blank
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content hidenav-content="homepage1" padding>
  <!-- long enough content to scroll -->
  .....
</ion-content>

```
#### establishing links with your different components
it is important to remember that these components will try to react together globally within the app, there is no way for the module to know on which page it is physically located so you need to give unique names to these components in order to avoid unexpected results. In this case we gave the **hidenav-header** and **hidenav-component** the same name so they know they belong to each other globally.

![](https://github.com/heidji/readme-content/blob/master/ezgif-1-158630fd5e77.gif?raw=true)

## using with zyra/ionic2-super-tabs
If you don't already know what supertabs are, it's an amazing project by Ibby Hadeed made to enable users to add swipeable tabs in their Ionic projects, check out the [repo](https://github.com/zyra/ionic2-super-tabs/).

![](https://github.com/heidji/readme-content/blob/master/ezgif-1-438aab70caaf.gif?raw=true)

it gets tricky to manage hiding navigation with tabs on, the reason behind it is that links will stretch out on several pages.
First you need to specify the **ion-content** and **ion-header** on the tabs page, these two should carry the same name:

### tabs.html
```
<ion-header hidenav-header="tabspage1">

  <ion-navbar>
    <ion-title>tabs</ion-title>
  </ion-navbar>

</ion-header>


<ion-content hidenav-tabscontent="tabspage1">
  <super-tabs>
    <super-tab [root]="page1" title="First page"></super-tab>
    <super-tab [root]="page2" title="Second page"></super-tab>
    <super-tab [root]="page3" title="Third page"></super-tab>
  </super-tabs>
</ion-content>
```
then you need to link the tabspage with each underlying page you want to use the hidenav function with using the **hidenav-parent** tag:

### page1.html

```
<ion-content hidenav-content="page1" hidenav-parent="tabspage1" padding>
  <!-- enough content to scroll -->
</ion-content>

```

## Limitations
This module is very invasive to the overall page design in order to achieve this hw-accelerated behavior, and as mentioned it is still experimental. Things like ion-refresher will be displaced when using it on supertabs and maybe other problems could arise as well. The code will be reviewed and cleaned up over the course of this project and please feel free to contribute.

**Thats it, enjoy!**

