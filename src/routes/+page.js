/**  @type {import('./$types').PageLoad} */

export async function load({ url, fetch }) {
	const name = url.searchParams.get("name");

	// Verifique se 'name' existe e não está vazio
	if (!name || name.trim() === '') {
		return {
			name: "",
			result: null,
		};
	}

	try {
		const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name.trim())}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);	
		}
		
		const data = await response.json();
		return {
			name: name.trim(),
			result: data,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			name: "",
			result: null,
			error: "Erro ao buscar dados. Tente novamente mais tarde."
		};
	}
}

//onsole.log("Page load function executed");

// console.log("Page load function executed");olteran-teste\voltera-frontend-test\src\routes> node +page.js
//Page load function executed