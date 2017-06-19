import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/of";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {Pokemon} from '../../shared/models/Pokemon';

@Injectable()
export class PokemonService {

  pokemons: Pokemon[] = null;
  pokemonsUrl: string = "http://pokeapi.co/api/v2/pokemon/";
  currentPageNumber: number = 1;
  pokemonsPerPage: number = 10;
  startPage: number;
  endPage: number;
  numberOfAllPokemons: number;
  totalPageNumber: number;

  subscription: Subscription;


  constructor(private http: Http){}

  public initPokemonService(): void {
    this.subscription = new Subscription();
  }

  getPokemons(): Pokemon[] {
    return this.pokemons;
  }

  findPokemons(): void {
    this.pokemons = [];

    for(var i = this.getFirstPokemonIndex() + 1; i <= this.getLastPokemonIndex() + 1; i++) {

        this.subscription.add(
          this.getPokemonById(i)
            .subscribe( pokemon => this.pokemons.push(pokemon) )
        );
    }

  }


  public setPageNumbers(): void {
    this.currentPageNumber = this.currentPageNumber || 1;
    this.pokemonsPerPage = this.pokemonsPerPage || 10;

    this.totalPageNumber = Math.ceil( this.numberOfAllPokemons / this.pokemonsPerPage);

    if(this.totalPageNumber <= 10) {
      this.startPage = 1;
      this.endPage = this.totalPageNumber;
    }
    else {
      if (this.currentPageNumber <= 6) {
          this.startPage = 1;
          this.endPage = 10;
      } else if (this.currentPageNumber + 4 >= this.totalPageNumber) {
          this.startPage = this.totalPageNumber - 9;
          this.endPage = this.totalPageNumber;
      } else {
          this.startPage = this.currentPageNumber - 5;
          this.endPage = this.currentPageNumber + 4;
      }
    }

  }



  public dashboardInit(): void {
    this.getNumberOfAllPokemons()
      .catch(this.handleError)
      .subscribe(response => {
        this.numberOfAllPokemons = response;
        this.setPageNumbers();
        this.findPokemons();
      });
  }


  public getNumberOfAllPokemons(): Observable<number> {
    return this.http.get(this.pokemonsUrl)
      .map(response => response.json().count as number);
      //.catch(this.handleError)
    //  .subscribe(response => this.numberOfAllPokemons = response.json().count);

  }



  public changePage(pageNumber: number): void {
    this.currentPageNumber = pageNumber;
    this.setPageNumbers();
    this.findPokemons();
  }




  public getPokemonById(id: number): Observable<Pokemon> {

    return this.http.get(this.pokemonsUrl+id)
      //.toPromise()
      .map(response => {
        var pokemon = response.json();
        return  {
          id: pokemon.id,
          name: this.nameToUpperCase(pokemon.name),
          image: pokemon.sprites.front_default,
          hp: pokemon.stats[5].base_stat,
          speed: pokemon.stats[0].base_stat,
          attack: pokemon.stats[4].base_stat,
          defense: pokemon.stats[3].base_stat,
          speciesUrl: pokemon.species.url,
          evolutionChainUrl: null
        };
      })
      //.catch(this.handleError)
    /*  .subscribe(pokemon => {
        return  {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
          hp: pokemon.stats[5].base_stat,
          speed: pokemon.stats[0].base_stat,
          attack: pokemon.stats[4].base_stat,
          defense: pokemon.stats[3].base_stat,
          speciesUrl: pokemon.species.url,
          evolutionChainUrl: null
        };
        //console.log(newPokemon);
      //  this.pokemons.push(newPokemon);
    });*/

  }



  getPokemonDetailsById(id: number): Observable<Pokemon> {

    if(this.getPokemons() != null) {
      var pokemon = this.getPokemons().find(pokemon => pokemon.id === id);
      if(pokemon != null) {
        return Observable.of(pokemon);
      }

    }


    return this.getPokemonById(id);


  }



  public unsubscribeAll(): void {
    this.subscription.unsubscribe();
  }



  private nameToUpperCase(name: string): string {
    if(name.length == 0) {
      return null;
    }
    else {
      let firstLetter = name[0];
      let rest = name.substring(1);
      firstLetter = firstLetter.toUpperCase();
      return firstLetter + rest;
      
    }
  }


  public getFirstPokemonIndex(): number {
    return (this.currentPageNumber - 1) * this.pokemonsPerPage;
  }



  getLastPokemonIndex(): number {
    return Math.min(this.getFirstPokemonIndex() + this.pokemonsPerPage - 1, this.numberOfAllPokemons - 1);
  }


  private handleError() {
    return Observable.throw('Error.');
  }


  public getCurrentPageNumber(): number {
    return this.currentPageNumber;
  }
  public getTotalPageNumber(): number {
    return this.totalPageNumber;
  }
  public getStartPageNumber(): number {
    return this.startPage;
  }


  public getEndPageNumber(): number {
    return this.endPage;
  }

}
