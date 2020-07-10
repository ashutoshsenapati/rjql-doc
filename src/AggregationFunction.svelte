<script>
  import { examples } from "./example-store";
  import CodeExecutor from "./CodeExecutor.svelte";
  import { onMount } from "svelte";

  onMount(() => {});
</script>

<div class="heading">Aggregation Function</div>

<div class="Example_block first">
  <div class="heading">$count</div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.count.json} _rjql={$examples.count.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          Here the query is checking whether the number of
          <span class="span_style">department</span>
          is
          <span class="span_style">2</span>
          .
        </p>
      </div>

      <div class="title">
        <i class="fas fa-check" />
        Example 2
        <br />
      </div>
      <div class="ce">
        <CodeExecutor
          json={$examples.count.json}
          _rjql={$examples.count1.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          Here the query is checking whether the number of
          <span class="span_style">department</span>
          with name
          <span class="span_style">Software</span>
          is equal to
          <span class="span_style">1</span>
          .
        </p>
      </div>

      <div class="note">
        <div class="note_style">
          <i class="fas fa-asterisk" />
          NOTE
        </div>
        <p>
          We can also have regular expressions inside the count as shown above.
          .
        </p>
        .
      </div>
    </div>

  </div>

</div>

<div class="Example_block">
  <div class="heading">$sum</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.sum.json} _rjql={$examples.sum.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          First line is used to traverse inside
          <span class="span_style">employees</span>
          array.
          <br />
          In the second line the query is checking whether the sum of the
          property
          <span class="span_style">salary</span>
          is equal to
          <span class="span_style">130000</span>
          .
        </p>
      </div>

    </div>
  </div>
</div>

<div class="Example_block">
  <div class="heading">$avg</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.avg.json} _rjql={$examples.avg.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          First line is used to traverse inside
          <span class="span_style">employees</span>
          array.
          <br />
          In the second line the query is checking whether the average of the
          property
          <span class="span_style">salary</span>
          is equal to
          <span class="span_style">75000</span>
          .
        </p>
      </div>

    </div>
  </div>
</div>

<div class="Example_block">
  <div class="heading">$max</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.max.json} _rjql={$examples.max.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          First line is used to traverse inside
          <span class="span_style">employees</span>
          array.
          <br />
          In the second line the query is checking whether the maximum value of
          the property
          <span class="span_style">salary</span>
          is equal to
          <span class="span_style">70000</span>
          .
        </p>
      </div>

    </div>
  </div>
</div>

<div class="Example_block">
  <div class="heading">$min</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.min.json} _rjql={$examples.min.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          First line is used to traverse inside
          <span class="span_style">employees</span>
          array.
          <br />
          In the second line the query is checking whether the minimum value of
          the property
          <span class="span_style">salary</span>
          is equal to
          <span class="span_style">60000</span>
          .
        </p>
      </div>

    </div>
  </div>
</div>
