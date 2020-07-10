<script>
  import CodeExecutor from "./CodeExecutor.svelte";
  import { examples } from "./example-store";

  let data1 = $examples.and.json;
  
  var rjql1 = `data>dataFields[]:
    name = "MsnAcquisition"
    series>length = "1"`;

  var data2 = `[{
  "id": 1,
  "first_name": "Jeanette",
  "last_name": "Penddreth",
  "email": "jpenddreth0@census.gov",
  "gender": "Female",
  "ip_address": "26.58.193.2"
}, {
  "id": 2,
  "first_name": "Giavani",
  "last_name": "Frediani",
  "email": "gfrediani1@senate.gov",
  "gender": "Male",
  "ip_address": "229.179.4.212"
}, {
  "id": 3,
  "first_name": "Noell",
  "last_name": "Bea",
  "email": "nbea2@imageshack.us",
  "gender": "Female",
  "ip_address": "180.66.162.255"
}, {
  "id": 4,
  "first_name": "Willard",
  "last_name": "Valek",
  "email": "wvalek3@vk.com",
  "gender": "Male",
  "ip_address": "67.76.188.26"
}]`;
  var rjql2 = `[]:
    $count{gender: /Male/} = "2"`;

  var data3 = `{
  "Employees": [
    {
      "userId": "krish",
      "jobTitle": "Developer",
      "firstName": "Krish",
      "lastName": "Lee",
      "employeeCode": "E1",
      "region": "CA",
      "phoneNumber": "123456",
      "emailAddress": "krish.lee@learningcontainer.com"
    },
    {
      "userId": "devid",
      "jobTitle": "Developer",
      "firstName": "Devid",
      "lastName": "Rome",
      "employeeCode": "E2",
      "region": "CA",
      "phoneNumber": "1111111",
      "emailAddress": "devid.rome@learningcontainer.com"
    },
    {
      "userId": "tin",
      "jobTitle": "Program Directory",
      "firstName": "tin",
      "lastName": "jonson",
      "employeeCode": "E3",
      "region": "CA",
      "phoneNumber": "2222222",
      "emailAddress": "tin.jonson@learningcontainer.com"
    }
  ]
}`;

  var rjql3 = `Employees[]:
	phoneNumber = "$regex{\\d+}"
`;

  var dataArr = [data1, data2, data3];
  var rjqlArr = [rjql1, rjql2, rjql3];
  var index = 0;
  var showEditor = false;

  var json;
  var rjql;

  update();

  function update() {
    showEditor = false;
    json = dataArr[index];
    rjql = rjqlArr[index];
    setTimeout(() => {
      showEditor = true;
    }, 100);
  }
</script>

<div class="heading">REPL</div>

<div class="Example_block first">
  <div class="row">
    <div class="col" style="text-align: left;">
      Select Dataset
      <select bind:value={index} on:change={update}>
        <option value="0">Arrays</option>
        <option value="1">Aggregation</option>
        <option value="2">Query Variable</option>
      </select>
    </div>
    <div class="col" style="position: relative;" />
  </div>
  {#if showEditor}
    <CodeExecutor {json} _rjql={rjql} maxLines="30" />
  {/if}
</div>
<div class="Example_block" style="margin-top: 45px;     color: #9d9c9c;
    font-family: monospace;">
  Try out RJQL with your data right here in the browser.  
</div>
