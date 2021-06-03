import '../svelte/styles/base.css';
import Main from './components/main.svelte';

const main = new Main({
	target: document.body
});

export default main;