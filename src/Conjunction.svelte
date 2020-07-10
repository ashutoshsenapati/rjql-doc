<script>
  import { examples } from "./example-store";
  import CodeExecutor from "./CodeExecutor.svelte";
  import { onMount } from "svelte";

  onMount(() => {});
</script>

<div class="heading">Conjunction</div>

<div class="Example_block first">
  <div class="heading">`&&` - and</div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.and.json} _rjql={$examples.and.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          Logical  <span class="span_style">AND</span>, A && B is 
          <span class="span_style">true</span> if both A and B are true.
        </p>
      </div>

     
    </div>

  </div>

</div>

<div class="Example_block">
  <div class="heading">`||` - or</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.or.json} _rjql={$examples.or.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          Logical  <span class="span_style">OR</span>, A || B is 
          <span class="span_style">true</span> if either of A or B is true.
        </p>
      </div>

    </div>
  </div>
</div>
