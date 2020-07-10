
import { writable } from 'svelte/store';

export let examples  = writable({});
export let runRJQL = writable(false);

export let menu = writable(0); 

