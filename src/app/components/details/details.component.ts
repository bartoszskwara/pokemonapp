import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import {Pokemon} from "../../shared/models/Pokemon"
import {DetailsService} from "./details.service"

import {PokemonService} from "../../shared/services/pokemon.service";

import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'pokemon-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private pokemonService: PokemonService,
    private detailsService: DetailsService,
    private router: Router
  ) {}


  ngOnInit(): void {


    this.route.params
        .switchMap((params: Params) => this.pokemonService.getPokemonDetailsById(+params['id']))
        .subscribe(pokemon => {
          this.detailsService.pokemon = pokemon;
          this.detailsService.setEvolutionForms(this.getPokemon().id);

        });




  }

  public goToDetailsById(id: number):void {
    this.router.navigate(['/pokemon', id]);
  }

  public getPokemon(): Pokemon {
    return this.detailsService.getPokemon();
  }
  public getEvolutionForms(): any[] {
    return this.detailsService.getEvolutionForms();
  }

  goBack(): void {
    this.location.back();
  }



}
