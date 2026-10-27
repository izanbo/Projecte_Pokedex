import * as Models from "./models.js";
import * as Utils from "./utils.js";
import {BasePokemon, IPokeApiDetail, IPokeApiListItem} from "./models.js";

// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================

// Map global per guardar la col·lecció de pokemons
const mapaPokemon = new Map<number, Models.BasePokemon>();

async function carregarListaPokemon(): Promise<void> {
    // 1. Mostrar missatge de càrrega
    Utils.mostrarEstat("Carregant els 151 Pokémon...", "loading");

    try {
        // 2. Fer la petició a la API
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

        // 3. Comprovar si la resposta és correcta
        if (!resposta.ok) {
            throw new Error(`Error HTTP ${resposta.status}`);
        }

        // 4. Convertir a JSON i assegurar el tipus
        const dades = (await resposta.json()) as Models.IPokeApiListResponse;

        // 5. Buidar el map i omplir-lo amb els nous pokemons
        mapaPokemon.clear();
        dades.results.forEach((manolo :IPokeApiListItem) :void => {
            const pokemon = new Models.BasePokemon(manolo);
            mapaPokemon.set(pokemon.id, pokemon);
        });

        // 6. Convertir el Map a array, renderitzar i amagar estat
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
        Utils.amagarEstat();
        Utils.netejarCercador();

        console.log(mapaPokemon);

    } catch (error) {
        // 7. Gestió d'errors
        console.error(error);
        Utils.mostrarEstat("Error carregant la llista de Pokémon.", "error");
    }
}

// Enganxar el listener al botó
const btnShowAll = document.getElementById("btn-show-all") as HTMLButtonElement | null;
if (btnShowAll) {
    btnShowAll.addEventListener("click", () :void => {
        void carregarListaPokemon();
    });
}


// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits

const searchInput = document.getElementById("search-input") as HTMLInputElement;

if (searchInput) {
    searchInput.addEventListener("input", buscarPokemon);
}

async function buscarPokemon(): Promise<void> {
    const query: string = searchInput.value;

    if (query === "") {
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
        return;
    }

    const numero: number = Number(query);

    if (Number.isInteger(numero)) {

        const pokemon :BasePokemon | undefined = mapaPokemon.get(numero);

        if (pokemon) {
            Utils.renderitzarLlistaNoms([pokemon]);
        } else {
            Utils.renderitzarLlistaNoms([]);
        }

    } else {

        const filtrarNom: BasePokemon[] = Array.from(mapaPokemon.values()).filter(
            (p: BasePokemon): boolean =>
                p.name.toUpperCase().includes(query.toUpperCase())
        );

        Utils.renderitzarLlistaNoms(filtrarNom);
    }
}

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits


// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits


// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits