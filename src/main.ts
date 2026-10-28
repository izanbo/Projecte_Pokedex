import * as Models from "./models.js";
import * as Utils from "./utils.js";

// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================

const mapaPokemon = new Map<number, Models.BasePokemon>();

const cachePokemon = new Map<number, Models.DetailedPokemon>();

async function carregarListaPokemon(): Promise<void> {
    Utils.mostrarEstat("Carregant els 151 Pokémon...", "loading");

    try {
        const resposta = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        if (!resposta.ok) {
            throw new Error(`Error HTTP ${resposta.status}`);
        }

        const dades = (await resposta.json()) as Models.IPokeApiListResponse;

        mapaPokemon.clear();

        dades.results.forEach((item: Models.IPokeApiListItem): void => {
            const pokemon = new Models.BasePokemon(item);
            mapaPokemon.set(pokemon.id, pokemon);
        });

        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
        Utils.netejarCercador();
        Utils.netejarDetallCard();
        Utils.amagarEstat();

    } catch (error) {
        console.error("Error carregant la llista:", error);
        Utils.mostrarEstat(
            "Error carregant la llista de Pokémon.",
            "error"
        );
    }
}

const btnShowAll = document.getElementById("btn-show-all");

btnShowAll?.addEventListener("click", () => {
    document.querySelectorAll("#type-filter-container .btn-type").forEach((boto) => boto.classList.remove("active"));
    void carregarListaPokemon();
});

// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================

const searchInput = document.getElementById(
    "search-input"
) as HTMLInputElement | null;

searchInput?.addEventListener("input", buscarPokemon);

function buscarPokemon(): void {
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query === "") {
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
        return;
    }

    const numero = Number(query);

    if (/^\d+$/.test(query)) {
        const pokemon = mapaPokemon.get(numero);

        Utils.renderitzarLlistaNoms(pokemon ? [pokemon] : []);
        return;
    }

    const pokemonsFiltrats = Array.from(mapaPokemon.values()).filter(
        (pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    Utils.renderitzarLlistaNoms(pokemonsFiltrats);
}

// ==========================================================
// EXERCICI 3: Detall del Pokémon, caché i crit
// ==========================================================

const llistaPokemon = document.getElementById("pokemon-list");

llistaPokemon?.addEventListener("click", (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const item = target.closest("li");

    if (!(item instanceof HTMLLIElement)) return;

    const id = Number(item.dataset.id);
    const url = item.dataset.url;

    if (!Number.isInteger(id) || id <= 0 || !url) return;

    Utils.marcarItemActiu(item);

    void carregarDetallPokemon(id, url);
});

async function carregarDetallPokemon(
    id: number,
    url: string
): Promise<void> {
    try {
        const pokemonGuardat = cachePokemon.get(id);

        if (pokemonGuardat) {
            Utils.renderitzarDetallPokemon(pokemonGuardat);
            Utils.amagarEstat();
            return;
        }

        Utils.mostrarEstat("Carregant dades del Pokémon...", "loading");

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`Error HTTP ${resposta.status}`);
        }

        const dades = (await resposta.json()) as Models.IPokeApiDetail;
        const pokemon = new Models.DetailedPokemon(dades, url);

        cachePokemon.set(id, pokemon);

        Utils.renderitzarDetallPokemon(pokemon);
        Utils.amagarEstat();

    } catch (error) {
        console.error("Error carregant el detall del Pokémon:", error);

        Utils.mostrarEstat(
            "No s'han pogut carregar les dades del Pokémon.",
            "error"
        );
    }
}

// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================

Utils.generarBotonsTipus();

// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================

const contenidorTipus = document.getElementById("type-filter-container");

contenidorTipus?.addEventListener("click", (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const boto = target.closest("button.btn-type");

    if (!(boto instanceof HTMLButtonElement)) return;

    const tipus = boto.dataset.type;

    if (!tipus) return;

    contenidorTipus.querySelectorAll("button.btn-type").forEach((element) => {
        element.classList.remove("active");
    });

    boto.classList.add("active");

    void carregarPokemonPerTipus(tipus);
});

async function carregarPokemonPerTipus(tipus: string): Promise<void> {
    try {
        Utils.mostrarEstat(
            "Carregant Pokémon del tipus seleccionat...",
            "loading"
        );

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/type/${encodeURIComponent(tipus)}`
        );

        if (!resposta.ok) {
            throw new Error(`Error HTTP ${resposta.status}`);
        }

        const dades = (await resposta.json()) as Models.IPokeApiTypeResponse;

        const pokemons = dades.pokemon
            .map((element) => new Models.BasePokemon(element.pokemon))
            .filter((pokemon) => pokemon.id >= 1 && pokemon.id <= 151)
            .sort((a, b) => a.id - b.id);

        mapaPokemon.clear();

        pokemons.forEach((pokemon) => {
            mapaPokemon.set(pokemon.id, pokemon);
        });

        Utils.renderitzarLlistaNoms(pokemons);
        Utils.netejarCercador();
        Utils.netejarDetallCard();
        Utils.amagarEstat();

    } catch (error) {
        console.error("Error carregant Pokémon per tipus:", error);

        Utils.mostrarEstat(
            "No s'han pogut carregar els Pokémon d'aquest tipus.",
            "error"
        );
    }
}
