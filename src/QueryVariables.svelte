<script>
  import { examples } from "./example-store";
  import CodeExecutor from "./CodeExecutor.svelte";

  var k = "{}";
  var t = "{^\\w+\\d+$}";
</script>

<div class="heading">Query Variables</div>

<div class="Example_block first">
  <div class="heading">$sort</div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.sort.json} _rjql={$examples.sort.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>

      <p>
        The query
        <span class="span_style">cars[] = "$asort"</span>
        sorts the array in ascending order.
      </p>
    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p>
        Inorder to sort in ascending order we can write
        <span class="span_style">cars[] = "$asort"</span>
      </p>
      .
    </div>
  </div>
</div>

<div class="Example_block">

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.sort1.json} _rjql={$examples.sort1.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>

      <p>
        The query
        <span class="span_style">cars[] = "$dsort"</span>
        sorts the array in descending order based on the property
      </p>
    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p>
        Inorder to sort in descending order we can write
        <span class="span_style">cars[] = "$dsort"</span>
      </p>
      .
    </div>
  </div>
</div>

<div class="Example_block">

  <div class="heading">$uuid</div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.uuid.json} _rjql={$examples.uuid.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>

      <p>
        Checks whether the value of the field
        <span class="span_style">id</span>
        is in the form of UUID.
      </p>
    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p>
        UUID format is
         <span class="span_style">
          [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
        </span>
        .
      </p>
      .
    </div>
  </div>
</div>

<div class="Example_block">

  <div class="heading">$regex</div>
  <div class="discription">
    <p>Example for checking Regular Expression:</p>
  </div>
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.regex.json} _rjql={$examples.regex.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>

      <p>
        Checking whether the value of the field
        <span class="span_style">model</span>
        inside the array
        <span class="span_style">cars</span>
        is the form of
        <span class="span_style">/^[a-z]$/</span>
        if the
        <span class="span_style">company</span>
        is equal to
        <span class="span_style">BMW</span>
        .
      </p>
    </div>
    <div class="note">
      <div class="note_style">
        <i class="fas fa-asterisk" />
        NOTE
      </div>
      <p>
        Using
        <span class="span_style">/.../</span>
        inside
        <span class="span_style">{k}</span>
        is optional.
        <br />
        For character we can use
        <span class="span_style">\w</span>
        , for digit we can use
        <span class="span_style">\d</span>

      </p>
      .
    </div>
  </div>
</div>

<div class="Example_block">
  <div class="heading">$in</div>
  <div class="discription" />
  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example 1
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.in.json} _rjql={$examples.in.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          This query will search for the value/values.
          <br />
          The first line is used to traverse inside the
          <span class="span_style">cars</span>
          .
          <br />
          In the second line the query is searching whether the value
          <span class="span_style">Nissan</span>
          given inside
          <span class="span_style">in</span>
          matches with value of left-hand property
          <span class="span_style">company</span>
          .
        </p>
      </div>

      <div class="title">
        <i class="fas fa-check" />
        Example 2
        <br />
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.in_2.json} _rjql={$examples.in_2.rjql} />
      </div>
      <div class="explanation">
        <p class="title">Explanation</p>
        <p>
          This query will search for the value/values.
          <br />
          The query is searching whether the values given inside
          <span class="span_style">in</span>
          matches with values of array
          <span class="span_style">cars</span>
          on the left-hand side.
        </p>
      </div>

    </div>
  </div>
</div>

<div class="Example_block">

  <div class="heading">$ip</div>

  <div class="examples">
    <div class="example">
      <div class="title">
        <i class="fas fa-check" />
        Example:
      </div>
      <div class="ce">
        <CodeExecutor json={$examples.ip.json} _rjql={$examples.ip.rjql} />
      </div>
      <div class="explanation">
        <p class="title">
          Explanation
        </p>
      </div>

      <p>
        Checks whether the value of the field
        <span class="span_style">ip_address</span>
        is in the form of IP Address.
      </p>
    </div>

  </div>
</div>
