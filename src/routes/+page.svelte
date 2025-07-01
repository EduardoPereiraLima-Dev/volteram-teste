<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    /** @type {import('./$types').PageData} */
    let { data } = $props();

    let inputValue = $state(data.name || '');
    let debounceTimer = $state(null);
    let isLoading = $state(false);
    let currentResult = $state(data.result);
    let currentError = $state(data.error);

    // Função para fazer a consulta à API
    async function fetchNameData(name) {
        if (!name || name.trim() === '') {
            currentResult = null;
            currentError = null;
            return;
        }

        isLoading = true;
        currentError = null;

        try {
            const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name.trim())}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            currentResult = result;
        } catch (error) {
            console.error('Error fetching data:', error);
            currentResult = null;
            currentError = 'Erro ao consultar a API';
        } finally {
            isLoading = false;
        }
    }

    // Função de debounce para input
    function handleInput(event) {
        inputValue = event.target.value;
        
        // Limpa o timer anterior
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        // Define novo timer para debounce
        debounceTimer = setTimeout(async () => {
            const trimmedValue = inputValue.trim();
            
            // Atualiza a URL
            if (browser) {
                if (trimmedValue === '') {
                    goto('/', { replaceState: true });
                } else {
                    goto(`/?name=${encodeURIComponent(trimmedValue)}`, { replaceState: true });
                }
            }
            
            // Faz a consulta após o debounc
            await fetchNameData(trimmedValue);
        }, 750); // 350ms de debounce
    }

    // Limpa o timer de debounce ao desmontar o componente
    $effect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    });

    // Inicia a consulta se houver um nome na URL
    $effect(() => {
        if (data.result) {
            currentResult = data.result;
        }
        if (data.error) {
            currentError = data.error;
        }
    });
</script>

<svelte:head>
    <title>Consulta de Idade por Nome</title>
    <meta name="description" content="Descubra a idade estimada baseada no nome usando a API Agify" />
</svelte:head>

<main>
    <div class="container">
        <header>
            <h1>Consulta de Idade por Nome</h1>
            <p>Digite um nome para descobrir a idade estimada</p>
        </header>

        <section class="search-section">
            <div class="input-container">
                <label for="name-input" class="visually-hidden">Nome para consulta</label>
                <input
                    id="name-input"
                    type="text"
                    placeholder="Digite um nome..."
                    value={inputValue}
                    oninput={handleInput}
                    autocomplete="given-name"
                />
            </div>
        </section>

        <section class="results-section">
            {#if isLoading}
                <div class="loading-card">
                    <div class="loading-spinner"></div>
                    <p>Consultando...</p>
                </div>
                
            {:else if currentResult}
                <div class="result-card">
                    <h2>Resultado para "{currentResult.name}"</h2>
                    {#if currentResult.age}
                        <div class="age-info">
                            <span class="age-number">{currentResult.age}</span>
                            <span class="age-label">anos (estimativa)</span>
                        </div>
                        {#if currentResult.count}
                            <p class="confidence">
                                Baseado em {currentResult.count.toLocaleString()} registros
                            </p>
                        {/if}
                    {:else}
                        <div class="no-data">
                            <p>Não foi possível estimar a idade para este nome.</p>
                        </div>
                    {/if}
                </div>
            {:else if currentError}
                <div class="error-card">
                    <p>{currentError}</p>
                </div>
            {:else if inputValue.trim() === ''}
                <div class="placeholder-card">
                    <p>Digite um nome para começar a consulta</p>
                </div>
            {/if}
        </section>
    </div>
</main>

<style>
    /* Estilos CSS */
</style>