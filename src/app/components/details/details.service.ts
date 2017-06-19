import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from 'rxjs/Observable';

import {Pokemon} from '../../shared/models/Pokemon';

@Injectable()
export class DetailsService {

  pokemon: Pokemon = null;
  evolutionForms: any[] = null;


  constructor(private http: Http){}


  public getPokemon(): Pokemon {
    return this.pokemon;
  }
  public getEvolutionForms(): any[] {
    return this.evolutionForms;
  }


  public setEvolutionForms(id: number): void {

    if(this.getPokemon().evolutionChainUrl == null) {

      this.getEvolutionUrl(id)
        .catch(this.handleError)
        .subscribe(url => {

          this.getPokemon().evolutionChainUrl = url;

          this.http.get(url)
            .map(response => response.json())
            .catch(this.handleError)
            .subscribe(evolution => {

              this.evolutionForms = [];

              this.http.get(evolution.chain.species.url)
                .map(response => response.json())
                .subscribe(response => {
                  this.evolutionForms.push({
                    name: this.nameToUpperCase(response.name),
                    id: response.id
                  });
                });

              var availableNodes = evolution.chain.evolves_to;

              while(availableNodes.length > 0) {

                var currentNode = availableNodes.pop();
                var children = currentNode.evolves_to;

                this.http.get(currentNode.species.url)
                  .map(response => response.json())
                  .subscribe(response => {
                    this.evolutionForms.push({
                      name: this.nameToUpperCase(response.name),
                      id: response.id
                    });


                    for(var i = 0; i < children.length; i++) {
                      availableNodes.push(children[i]);

                      this.http.get(children[i].species.url)
                        .map(response => response.json())
                        .subscribe(response => {
                          this.evolutionForms.push({
                            name: this.nameToUpperCase(response.name),
                            id: response.id
                          });
                        });
                    }
                  });


              }



            });


        });


    }





  }

  public getEvolutionUrl(id: number): Observable<string> {

    return this.http.get(this.getPokemon().speciesUrl)
      .map(response => response.json().evolution_chain.url);


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

  private handleError() {
    return Observable.throw('Error.');
  }

}
