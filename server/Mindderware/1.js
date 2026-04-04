async function fetchData() {
let data = await Promise.resolve(1);
return data + 1;
}

function processData() {
let result = fetchData();
console.log(result); 
}

