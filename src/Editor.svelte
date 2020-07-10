<script>
  import { onMount } from "svelte";
  

  onMount(function() {
    setTimeout(function init() {
      editor = ace.edit(eid);
      editor.setTheme("ace/theme/textmate");
      editor.session.setMode("ace/mode/" + mode);
      editor.renderer.setShowGutter(showLineNo);
      editor.getSession().setUseWrapMode(true);
      editor.setShowPrintMargin(false);
      editor.setReadOnly(readOnly);

      editor.setOptions({
        fontFamily: "'Fira Code', monospace",
        fontSize: fsize,
        maxLines: maxLines,
        useWorker: false
      });

      window[eid] = editor;

    }, 50);
  });

  


  let editor;
  export let fsize = "10pt";
  export let mode = 'json';
  export let eid;
  export let val;
  export let readOnly = false;
  export let showLineNo = true;
  export let maxLines = 10;
</script>

<div id={eid}>{val}</div>