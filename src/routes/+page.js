async function getAgeByName(name){
	try {
		const response = await fetch(`https://api.agify.io?name=${name}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		console.log(`Nome: ${data.name}`);
		console.log(`Idade: ${data.age}`);
		console.log(`contagem: ${data.country}`);
}catch (error) {
		console.error('Erro ao buscar dados:', error);
	}
}

getAgeByName('Paulo');
	// volteran-teste\voltera-frontend-test\src\routes> node +page.js
//me: Paulo
//ade: 55
//ntagem: undefined
// C:\Users\Alan\Desktop\volteran-teste\voltera-frontend-test\src\routes>
