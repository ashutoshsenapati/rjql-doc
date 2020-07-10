<script>
  import CodeExecutor from "./CodeExecutor.svelte";
  import { examples } from "./example-store";
</script>

<style>
  @media (min-width: 640px) {
  }
</style>

<div class="heading">Single Values</div>

<div class="Example_block first">

  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.singlevalues.json}
          _rjql={$examples.singlevalues.rjql} />
      </div>
      <div class="explanation">
        <p>
          Checks whether the value of the field
          <span class="span_style">name</span>
          is equal to
          <span class="span_style">John</span>
          .
        </p>
      </div>
      <div class="note" />
    </div>
  </div>

</div>

<div class="Example_block">
  <div class="heading" />
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 2
        <br />
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.singlevalues1.json}
          _rjql={$examples.singlevalues1.rjql} />
      </div>
      <div class="explanation">
        <p>
          Checks whether the value of the field
          <span class="span_style">name</span>
          is equal to
          <span class="span_style">John</span>
          .
        </p>
      </div>
      <div class="note" />
    </div>
  </div>

</div>

<div class="Example_block">
  <div class="heading" />
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 3
        <br />
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.singlevalues2.json}
          _rjql={$examples.singlevalues2.rjql} />
      </div>
      <div class="explanation">
        <div class="explanation_style">Explanation</div>
        <p>
          Checks whether the value of the field
          <span class="span_style">city</span>
          inside
          <span class="span_style">address</span>
          is equal to
          <span style="color:blue">Dallas</span>
          .
        </p>
      </div>
      <div class="note">
        <div class="note_style">
          <i class="fas fa-asterisk" />
          NOTE
        </div>

        <p>
          Don't confuse
          <span class="span_style">'>'</span>
          operator with
          <span class="span_style">></span>
          symbol which is uded in above example.
          <br />
          The symbol used in the above example is for traversing into
          <span class="span_style">city</span>
          which is inside
          <span class="span_style">address</span>
          .
        </p>
      </div>
    </div>
  </div>
</div>
