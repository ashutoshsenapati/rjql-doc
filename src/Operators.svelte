<script>
  import Editor from "./Editor.svelte";
  import { examples } from "./example-store";
  import { onMount } from "svelte";
  onMount(() => {});
  var l = "<=";
  var n = "<>";
</script>

<style>
</style>

<div class="heading">Operators</div>
<div class="Example_block ">
  <div class="">
    <div style="text-align: center; margin-top: 10%; font-size: 1.3rem;">Operators are standard with any popular programming language.</div>
  </div>
</div>
<div class="operators first">

  <table id="operators">
    <tr>
      <th>Operators</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>=</td>
      <td>
        Operator validates whether the value of the left hand variable is equal
        to the right hand value.
      </td>

    </tr>
    <tr>
      <td>&gt</td>
      <td>
        Operator validates whether the value of the left hand variable is
        greater than right hand value.
      </td>
    </tr>

    <tr>
      <td>&lt</td>
      <td>
        Operator validates whether the value of the left hand variable is
        smaller than to the right hand value.
      </td>
    </tr>

    <tr>
      <td>>=</td>
      <td>
        Operator validates whether the value of the left hand variable is
        greater than or equal to the right hand value.
      </td>

    </tr>
    <tr>
      <td>{l}</td>
      <td>
        Operator validates whether the value of the left hand variable is
        smaller than or equal to the right hand value.
      </td>

    </tr>
    <tr>
      <td>{n}</td>
      <td>
        Operator validates whether the value of the left hand variable is not
        equal to the right hand value.
      </td>

    </tr>
    <tr>
      <td>~</td>
      <td>Operator checks for the substring in the original string.</td>

    </tr>

  </table>

</div>


