<script>
  import Editor from "./Editor.svelte";
  import { onMount } from "svelte";
  import { runRJQL } from './example-store';

  export let json;
  export let _rjql;
  export let maxLines = 10;
  export let eid1 = "edtr-" + new Date().getTime() * Math.random();
  export let eid2 = "edtr-" + new Date().getTime() * Math.random();
  export let showRun = true;

  var show = false;
  var validate = rjql.consolidated;
  var result;

  runRJQL.subscribe(() => { 
    try {
      run();
    } catch(e) {}
  });
  

  onMount(() => {
    setTimeout(() => {
      show = true;
      run();
    }, 300);
  });

  function run() {
    var _response = window[eid1].getSession().getValue();
    var qry = window[eid2].getSession().getValue();
    result = (function() {
      try {
        var _r = validate(_response, qry);
        return transformedResult(_r);
      } catch(e) {
        return {
          desc: e.toString(),
          status: false,
          qbs: [{
            verb: e,
            line: -1,
            status: false
          }]
        }
      }
    })();
  }

  function transformedResult(_r) {
    var desc = _r.passed ? "passed" : "failed";
    return {
      desc,
      status: _r.passed,
      qbs: _r.qbs
    };
  }
</script>

<style>
  .loader {
    position: absolute;
    text-align: center;
    width: 100%;
    padding-top: 10px;
  }

  .btn {
    position: absolute;
    right: 0px;
    top: 0px;
    background-color: #f4f42a;
    font-size: 0.8rem;
    padding: 6px 11px;
    border-radius: 3px;
    color: #000;
    font-weight: 600;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .result {
    text-align: left;
    margin: 10px 2px;
  }

  .result .st {
    text-transform: uppercase;
    padding: 4px;
    font-size: .7rem;
    color: #fff;
    display: inline-block;
    border-radius: 2px;
    font-weight: 600;
  }

  .result .passed {
    background-color: green;
  }

  .result .failed {
    background-color: red;
  }

  .result .errs {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .result .errs .err {
    color: #D32F2F;
    font-size: .9rem;
  }
</style>

<div style="display: {!show ? '' : 'none'}; " class="loader">
  Loding Live Editor...
</div>
<div class="row" style="visibility: {show ? '' : 'hidden'}">
  <div class="col">
    <Editor val={json} eid={eid1} {maxLines}/>
  </div>
  <div class="col" style="position: relative;">
    <Editor val={_rjql} eid={eid2} {maxLines}/>

    {#if showRun}
      <div on:click={run} class="btn">
        <i class="fas fa-bolt" />
        RUN
      </div>
    {/if}
    {#if result}
      <div class="result">
        <div class="errs">
        {#each result.qbs as qb, i}
          {#if !qb.status}
            <div class="err">{i + 1}. {@html qb.verb} {qb.line != -1 ? 'at line ' + qb.line : ''}</div>
          {/if}
        {/each}
        </div>
        <div class="st {result.desc}">{@html (result.status ? '&#10004;' : '&#10005;')} {result.desc}</div>
      </div>
    {/if}
  </div>
</div>
