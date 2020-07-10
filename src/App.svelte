<script>
  import SingleValues from "./SingleValues.svelte";
  import Operators from "./Operators.svelte";
  import Arrays from "./Arrays.svelte";
  import Repl from "./Repl.svelte";
  import QueryVariables from "./QueryVariables.svelte";
  import AggregationFunction from "./AggregationFunction.svelte";
  import Home from "./Home.svelte";
  import Usage from "./Usage.svelte";
  import Conjunction from "./Conjunction.svelte";
  import { examples, menu } from "./example-store";
  import { initExamples } from "./data-util";

  window.onscroll = function(e) {
    //console.log(e);
  };

  initExamples($examples);
</script>

<style>
  .rjql-desc {
    color: rgb(170, 170, 170);
    text-align: center;
    font-size: 0.9rem;
    font-family: monospace;
    margin: 10px 0px;
    position: absolute;
    bottom: 0;
  }

  main {
    text-align: center;
    margin: 0 auto;
  }

  ul {
    margin: 0px;
    padding: 0px;
    margin-top: 15px;
  }

  ul#menu li {
    padding: 10px;
    max-width: 240px;
    margin: 0 auto;
    list-style: none;
    text-align: right;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .title {
    color: #b77748;
    font-size: 2.5rem;
    font-family: "Sriracha", cursive;
  }

  .title img {
    width: 60px;
  }

  .title span {
    padding: 0px;
    position: absolute;
    top: 17px;
    margin-left: 4px;
  }

  .header {
    text-align: left;
    line-height: 30px;
    background-color: #fff;
    z-index: 1000;
    top: 0px;
    left: 0px;
    padding-left: 5px;
    background-color: #f9f9f9;
  }

  .content {
    margin: 0px auto;
    width: 100%;
    display: flex;
  }

  .left-part {
    text-align: left;
    width: 170px;
    min-width: 150px;
    border-right: 1px solid #eaeaea;
    position: fixed;
    height: 100%;
    background: #f9f9f9;
  }

  .right-part {
    flex: 80%;
    padding: 10px;
    margin-left: 170px;
  }

  .sel {
    font-weight: bold;
  }

  .version {
    position: absolute;
    font-size: 0.85rem;
    top: 44px;
    right: 14px;
    font-family: fira code;
    color: gray;
  }
</style>

<main>
  <div class="content">
    <div class="left-part">
      <div class="header">
        <div class="title">
          <img src="rjql-logo.png" alt="logo" />
          <span>RJQL</span>
          <div class="version">Sahir</div>
        </div>
      </div>
      <div class="rjql-desc">✨Rahul's JSON Query Language</div>
      <ul id="menu">
        <li class={$menu == 0 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => ($menu = 0)}>Home</a>
        </li>
        <li class={$menu == 1 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => ($menu = 1)}>Operators</a>
        </li>
        <li class={$menu == 2 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => ($menu = 2)}>
            Single Values
          </a>
        </li>
        <li class={$menu == 3 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => ($menu = 3)}>Arrays</a>
        </li>
        <li class={$menu == 4 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => ($menu = 4)}>
            Query Variables
          </a>
        </li>
        <li class={$menu == 5 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => $menu = 5}>Aggregation</a>
        </li> 
        <li class={$menu == 6 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => $menu = 6}>Conjunction</a>
        </li>
        <li class={$menu == 11 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => $menu = 11}>Usage</a>
        </li>
        <li class={$menu == 10 ? 'sel' : ''}>
          <a href="/" on:click|preventDefault={() => $menu = 10}>REPL</a>
        </li>
        
      </ul>
    </div>
    <div class="right-part">

      {#if $menu === 0}
        <Home />
      {:else if $menu === 1}
        <Operators />
      {:else if $menu === 2}
        <SingleValues />
      {:else if $menu === 3}
        <Arrays />
      {:else if $menu === 4}
        <QueryVariables />
      {:else if $menu === 5}
        <AggregationFunction />
      {:else if $menu === 6}
        <Conjunction />
      {:else if $menu === 10}
        <Repl />
      {:else if $menu === 11}
        <Usage />
      {:else}
        <h1>Page Not Found</h1>
      {/if}

    </div>
  </div>

</main>
