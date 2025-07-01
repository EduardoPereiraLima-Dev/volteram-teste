
<script>
    import {page} from '$app/stores';
    import {goto} from '$app/navigation';
    import { browser } from '$app/environment';
    import {oncleanup} from 'svelte';

    /** @type {import('./$types').PageData}*/
    let {data} = $props();

    let inputValue = data.name || '';
    let debounceTimer = null;
    let isLoading = false;
    let currentResults = data.results || [];
    let currentError = data.error || null;

    //função de cunsulta
    async function fetchNameData(name) {
        if (!name) {
            currentResults = [];
            currentError = null;
            return;
        }

        isLoading = true;
        currentError = null;

        try {
            const response = await fetch(`/api/name/${name}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const results = await response.json();
            currentResults = results;
        } catch (error) {
            currentError = error.message;
            currentResults = [];
        } finally {
            isLoading = false;
            currentError = null;

            try {
                const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name.trim())}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const results = await response.json();
                currentResults = results;
            } catch (error) {
                console.error('Error fetching data:', error);
                currentResults = null;
                currentError = 'Erro de consulta';
            }finally {
                isLoading = false;
            }
        }
    }
     //funç~ao de debounce
     function handleInput(event) {
        inputValue = event.target.value;
        // Limpa o debounce anterior
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        // Define um novo debounce
        debounceTimer = setTimeout(async () => {
        const trimmedValue = inputValue.trim();
        //atualiza a url
        if (browser) {
            if (trimmedValue === '') {
                 goto('/', { replaceState: true });
            } else {
             goto(`/?name=${encodeURIComponent(trimmedValue)}`, { replaceState: true });
            }
        }
        // Chama a função de consulta automática
        await fetchNameData(trimmedValue);
        }, 750); // 300ms de debounce
    }
    // inicia dados da url 
    $effect(() => {
        if (data.result) {
            currentResults = data.result;
        }
        if (data.error) {
            currentError = data.error;
        }
    });

       

</script>

<svelte:head>
    <title>Voltera Frontend Test</title>
</svelte:head>

<main>
    <div class= "conteiner">
        <header>
            <h1>Consulta de idade por nome</h1>
            <p>Digite um nome para consultar a idade média associada a ele.</p>

        </header>
        <section class="search-section">
            <div class="input-conteiner">
                
            </div>

            </div>
        </section>

        </section>
    </div>

    </div>
</main>