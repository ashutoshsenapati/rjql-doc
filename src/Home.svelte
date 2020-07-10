<script>
  import CodeExecutor from "./CodeExecutor.svelte";
  import { examples } from "./example-store";
  import { onMount } from "svelte";
  import { runRJQL, menu } from "./example-store";

  var jsonEditorId = "home-json-editor";
  var rjqlEditorId = "home-rjql-editor";

  var jsonES;
  var rjqlES;

  var exampleTitle;

  var keys = Object.keys($examples);
  var index = 0;
  var rjqlIndex = 0;

  onMount(() => {
    setTimeout(playExamples, 1000);
  });

  function playExamples() {
    jsonES = window[jsonEditorId].getSession();
    rjqlES = window[rjqlEditorId].getSession();
    start();
  }

  function start() {
    var key = keys[index];
    if (!key) {
      index = 0;
      start();
    } else {
      exampleTitle = key.replace('_', '').replace(/\d+/g, '');
      var o = $examples[key];
      jsonES.setValue(o.json);
      rjqlIndex = 0;
      rjqlES.setValue("");
      writeRJQL(o.rjql);
    }
  }

  function writeRJQL(rjql) {
    if($menu != 0) {
      return;
    }
    setTimeout(() => {
      rjqlES.setValue(rjqlES.getValue() + rjql[rjqlIndex]);
      rjqlIndex++;
      if (rjqlIndex == rjql.length) {
        $runRJQL = Math.random();
        setTimeout(() => {
          index++;
          start();
        }, 2000);
      } else {
        $runRJQL = Math.random();
        setTimeout(() => {
          writeRJQL(rjql);
        }, 70);
      }
    }, 10);
  }
</script>

<style>
  .hero {
    font-size: 3rem;
    text-align: center;
    color: #d28c52;
  }

  .home-editors {
    position: relative;
    border: 1px solid #e8e8e8;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.6);
    margin: 0px auto;
    margin-top: 50px;
    width: 70%;
    border-radius: 3px;
    border-left: 5px solid #9ddfb6;
  }

  .home-editors .wrapper {
    position: absolute;
    background-color: transparent;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .rjql-logo {
    position: absolute;
    right: 3px;
    bottom: -9px;
    color: #e8e8e8;
    font-size: 2rem;
    font-family: "Sriracha", cursive;
  }

  .example-title {
    color: #8e44ad;
    font-size: 0.9rem;
    font-family: fira code;
    position: absolute;
    right: -1px;
    top: -1px;
    border-radius: 3px;
    background-color: #f8f8f8;
    padding: 0px 3px;
    border: 1px solid #e8e8e8;
  }
</style>

<div class="heading">About</div>

<div class="Example_block first">
  <div class="hero">JSON Query Language & Validator</div>
  <div class="home-editors">
    <div class="wrapper" />
    <CodeExecutor
      json={$examples.uuid.json}
      _rjql={$examples.uuid.rjql}
      maxLines="15"
      eid1={jsonEditorId}
      eid2={rjqlEditorId}
      showRun={false} />
    <div class="example-title">{exampleTitle ? exampleTitle : 'sample'}</div>
    <div class="rjql-logo">RJQL</div>
  </div>
</div>

<div class="Example_block " style="margin-top: 40px;">
    <div class="hero">Its concise & effective</div>

    <div class="hero" style="margin-top: 40px;">Try REPL now</div>
</div>
