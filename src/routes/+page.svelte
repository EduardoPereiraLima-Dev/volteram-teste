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
    :global(body) {
        margin: 0 ;
        padding:0;  
        font-family: Arial, sans-serif;
        background-color: #1adf4b;
        min-height: 100vh;
        color: #333;
    }
    .visually-hidden {
        position:absolute;
        width:1px;
        height:1px;
        padding:0;
        margin:-1px;
        overflow:hidden;
        clip:rect(0, 0, 0, 0);
        white-space:nowrap;
        border:0;
    }
    main {
       min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem;
    }
    .container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 3rem 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
        text-align: center;
    }
    header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        font-weight: bold;
        background: linear-gradient(90deg, #1adf4b, #1a8df4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    
    }
    header p {
        margin: 0 0 1.5rem 0;
        font-size: 1.2rem;
        color: #555;
    }
    .search-section {
        margin-bottom: 2rem;
    }
    .input-container {
        position: relative;
    }
    input {
        width: 100%;
       padding: 1rem 1.5rem;
        font-size: 1rem;
        border: 2px solid #ccc;
        border-radius: 50px;
        outline: none;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
    }
    input:focus {
        border-color: #1adf4b;
        box-shadow: 0 0 0 3px rgba(26, 223, 75, 0.3);
        transform: translateY(-2px);
    }
    input::placeholder {
        color: #aaa;
    }
    .results-section {
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .result-card, .loading-card, .error-card, .placeholder-card {
        background: #fff;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        border-left: border-box;       
        
    }
    .result-card h2 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        color: #333;
        font-weight: 600
    }
    .age-info {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .age-number {
        font-size: 3rem;
        font-weight: 700;
        color: #1adf4b;
        line-height: 1;
    }
    .age-label {
        font-size: 1.1rem;
        color: #555;
        font-style: 500;
    }
    .confidence {
        margin: 0;
        font-size: 0.9rem;
        color: #555;
        font-style: 500;
    }
    .error-card  {
       border-left-color: #e74c3c;
       color:#1a8df4;
    }
    .loading-card {
       border-left-color:#f39c12;
        color: #f39c12;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .no-data {
       border-left-color: #95a5a6;
        color: #95a5a6;
    }
    @media (max-width: 600px) {
        .container {
            margin: 1rem;
            padding: 2rem 1rem;
        }
        header h1 {
            font-size: 1.8rem;
        }
        header p {
            font-size: 1rem;
        }
        input {
            padding: 0.8rem 1.2rem;
            font-size: 0.9rem;
        }
        .result-card h2 {
            font-size: 1.2rem;
        }
        .age-number {
            font-size: 2.5rem;
        }
    }
    .loading-spinner {
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid #1adf4b;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .placeholder-card {
       background: #f8f9fa;
       border-radius: 15px;
        padding: 2rem;
        border-left:4px solid #6c757d;
        width: 100%;
        box-sizing: border-box;
        color: #6c757d;
    }
</style>