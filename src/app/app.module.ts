import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PokemonService } from './shared/services/pokemon.service';
import { DetailsComponent } from './components/details/details.component';
import { DetailsService } from './components/details/details.service';


import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    PokemonService,
    DetailsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
