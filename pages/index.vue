<template>
  <button class="button" @click="import_csv">＋　CSVを追加</button>
  <div class="ml-1 mt-2">
    <ul>
      <li v-for="file in data.fileList" class="mb-2">
        <button
          class="button is-danger is-small"
          @click="remove_csv(file.id, file.name)"
        >
          削除</button
        >　<router-link :to="'/start/' + file.id">{{ file.name }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  setup() {
    const list_update = function () {
      db.files.toArray(function (files) {
        console.log(files);
        data.fileList = files;
      });
    };

    const data = Vue.reactive({
      fileList: [],
    });
    const import_csv = function () {
      const file_elm = document.createElement("input");
      file_elm.setAttribute("type", "file");
      file_elm.setAttribute("accept", ".csv");

      file_elm.addEventListener("change", function (e) {
        const reader = new FileReader();
        const file = e.currentTarget.files[0];
        reader.onload = function () {
          const blob = new Blob([`${reader.result}`], { type: "text/csv" });
          db.files.put({
            id: generateId(),
            file: blob,
            name: file.name,
          });

          list_update();
        };

        reader.readAsText(file);
      });

      file_elm.click();
    };

    const remove_csv = function (fileId, fileName) {
      if (confirm(fileName + " を削除しますか？")) {
        db.files.delete(fileId);
        list_update();
      }
    };

    //update list
    list_update();

    return { import_csv, remove_csv, data, list_update };
  },
};
</script>