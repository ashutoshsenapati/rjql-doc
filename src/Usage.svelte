<script>
  import Editor from "./Editor.svelte";

  let eid = "embbed-demo";
  let val = `
\<script src="rjql.sahir.min.js"\>\</script\>
\<script\>
    var json = {
        name: "Sahir",
        famousFor: 'Poetry'
    };

    var qry = 'name = "Sahir"';
    var qry2 = 'name = "Faiz"';

    console.log(rjql.validate(json, qry));
    console.log(rjql.validate(json, qry1));
\</script\>
    `;

  let op = `[{ 
    errLineNo: 2,
    verb: 'OK',
    passed: true,
    next: '',
    target: { name: 'Sahir', famousFor: 'Poetry' },
    operator: '=' 
}]

[{ 
    errLineNo: 2,
    verb: 'Expected <i>name</i> to be <b>Faiz</b> found <u>Sahir</u>',
    passed: false,
    next: '',
    target: undefined,
    operator: '=' 
}]

//Returns an array of query block results.
`;
</script>

<style>
  .version-header {
    display: flex;
    border-bottom: 2px solid #f9f9f9;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 20px;
    padding-bottom: 5px;
  }

  .ver {
    font-size: 2rem;
    color: rgb(98, 78, 212);
  }

  .release {
    color: gray;
    font-size: 0.9rem;
  }

  .file {
    text-align: left;
    margin-top: 10px;
  }

  .wrapper {
    margin: 0px auto;
    width: 80%;
    margin-top: 20px;
  }

  .ed-hdr {
    font-weight: 600;
    margin-bottom: 10px;
  }

  .hero {
    font-size: 2rem;
    text-align: center;
    color: #d28c52;
    margin-bottom: 20px;
  }
</style>

<div class="heading">Usage</div>

<div style="height: 50px;" />

<div class="wrapper">
<div class="hero">Embed RJQL to test your JSON Data</div>
  <div class="row">
    <div class="col">
      <div class="ed-hdr">Embed</div>
      <Editor {val} {eid} mode="html" maxLines="20" />
    </div>
    <div class="col" style="position: relative;">
      <div class="ed-hdr">Output</div>
      <Editor val={op} eid="output" mode="javascript" maxLines="15" />
    </div>
  </div>

  <div class="version-header">
    <div class="ver">#sahir</div>
    <div class="release">29 May, 20</div>
  </div>
  <div class="file">
    <a href="/release/rjql.sahir.min.js" download>
      <i class="fab fa-js-square" />
      <span style="font-weight: 600">rjql.sahir.min.js</span> <i class="fas fa-download"></i>
    </a>
  </div>

  <div class="version-header">
    <div class="ver">#manto</div>
    <div class="release">20 Feb, 20</div>
  </div>
  <div class="file">
    <a href="/release/rjql.manto.min.js" download>
      <i class="fab fa-js-square" />
      <span style="font-weight: 600">rjql.manto.min.js</span> <i class="fas fa-download"></i>
    </a>
  </div>
</div>
