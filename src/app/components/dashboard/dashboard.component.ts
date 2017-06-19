import {Component} from "@angular/core";
import { OnInit, OnDestroy } from '@angular/core';
import {Pokemon} from "../../shared/models/Pokemon";
import {PokemonService} from "../../shared/services/pokemon.service";
import { Router } from '@angular/router';

@Component({
  selector: 'pokeapp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {



  constructor(private pokemonService: PokemonService, private router: Router){}


  ngOnInit(): void {
    this.pokemonService.initPokemonService();

    if(this.pokemonService.getPokemons() == null || this.pokemonService.getPokemons().length < this.pokemonService.pokemonsPerPage) {
      this.pokemonService.dashboardInit();



        //.then(() => this.pokemonService.setPageNumbers())
        //.then(() => this.pokemonService.findPokemons());

    }


  }


  ngOnDestroy() {
    this.pokemonService.unsubscribeAll();
  }



  public changePage(pageNumber: number): void {
    this.pokemonService.changePage(pageNumber);
  }
  public nextPage(): void {
    this.pokemonService.changePage(this.pokemonService.getCurrentPageNumber()+1);
  }
  public prevPage(): void {
    this.pokemonService.changePage(this.pokemonService.getCurrentPageNumber()-1);
  }
  public goToDetails(id:number):void {
    this.router.navigate(['/pokemon', id]);
  }

  public createArrayOfPageNmbers(): number[] {
    let array = [];
    for(var i = this.pokemonService.getStartPageNumber(); i <= this.pokemonService.getEndPageNumber(); i++) {
      array.push(i);
    }
    return array;
  }

  getPokemons(): Pokemon[] {

    return this.pokemonService.getPokemons();

  }

  getFirstPokemonIndex(): number {
    return this.pokemonService.getFirstPokemonIndex();
  }
  getLastPokemonIndex(): number {
    return this.pokemonService.getLastPokemonIndex();
  }
  getCurrentPageNumber(): number {
    return this.pokemonService.getCurrentPageNumber();
  }

}
