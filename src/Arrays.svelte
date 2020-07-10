<script>
  import CodeExecutor from "./CodeExecutor.svelte";
  import { examples } from "./example-store";
</script>

<style>
  @media (min-width: 640px) {
  }
</style>

<div class="heading">Arrays</div>

<div class="Example_block first">
  <div class="heading">
    <p>Array of primitives</p>
  </div>
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.arrays.json}
          _rjql={$examples.arrays.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>
      

      <p>
        It is the collection of homogenious data .
        <br />
        Array values can be of type string, number, object, array, boolean or
        null.
        <br />
      </p>
    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p />
      <p>
        Query can alse be written as
        <span style="color:blue">cars ~ "Ford"</span>
        .
      </p>
      .
    </div>
  </div>
</div>

<div class="Example_block">

  <div class="heading">
    <p>Array of nested objects</p>
  </div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.arrays1.json}
          _rjql={$examples.arrays1.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>
      

      <p>We can have array inside other array.</p>

      <p>
        If we need to access the array
        <span class="span_style" />
        , first we need to traverse the object
        <span class="span_style">data</span>
        and then we need to go to the array
        <span class="span_style">cars</span>
        .
        <br />
        The symbol
        <span class="span_style" />
        is used to point to the array
        <span class="span_style">cars</span>
        which is inside the object
        <span class="span_style">data</span>
        .
        <br />
        To validate some fields inside the array
        <span class="span_style">cars</span>
        then you need to traverse the array
        <span class="span_style">cars</span>
        . So, we need to go inside the array. To do this we need to use colon (
        <span class="span_style">:</span>
        ).
        <br />
        The symbol
        <span class="span_style">:</span>
        is used if we need a nested query. Checking whether the field
        <span class="span_style">model</span>
        is equal to the value
        <span class="span_style">Leaf Plus</span>
        where
        <span class="span_style">company</span>
        is equal to
        <span class="span_style">Nissan</span>
        .
        <br />
        If it is
        <span class="span_style">Nissan</span>
        then it will go inside property to check whether the model is
        <span class="span_style">Leaf Plus</span>
        or not.
      </p>

    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p />
      <p>
        Query can alse be written as
        <span class="span_style">cars ~ "Ford"</span>
        .
      </p>
      .
    </div>
  </div>
</div>
