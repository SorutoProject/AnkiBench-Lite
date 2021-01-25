<template>
  <div class="pt-3 columns is-mobile content is-centered">
    <div
      class="column box is-one-third-widescreen is-half-desktop is-two-thirds-tablet is-full-mobile"
      v-if="progress.remain.length > 0"
    >
      <progress
        class="progress is-info"
        :value="progress.total - progress.remain.length"
        :max="progress.total"
      ></progress>
      <p class="has-text-weight-bold is-size-4">
        {{ progress.remain[0].question }}
      </p>
      <ul class="mt-2">
        <li v-for="answer in progress.remain[0].answers">{{ answer }}</li>
      </ul>
    </div>
    <div
      class="column box is-one-third-widescreen is-half-desktop is-two-thirds-tablet is-full-mobile"
      v-if="progress.remain.length === 0"
    >
      <p class="has-text-weight-bold has-text-centered is-size-4">
        すべての問題が完了しました
      </p>
      <p class="has-text-centered">
        <router-link class="button is-outlined is-info is-medium" to="/" replace
          >ホームに戻る</router-link
        >
      </p>
    </div>
  </div>
  <div
    class="buttons pt-4 has-addons is-fullwidth is-bottom"
    v-if="progress.remain.length > 0"
  >
    <button class="button is-info" @click="unrem">わからない</button>
    <button class="button is-danger" @click="rem">わかる</button>
  </div>
</template>
<style scoped>
.buttons.is-fullwidth .button {
  width: 50%;
}
.box {
  padding: 30px;
  margin-bottom: 70px;
  min-height: 50%;
}
.is-bottom {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  height: 60px;
  max-width: 100%;
  background: #fff;
}
.is-bottom button {
  height: 100%;
}
.progress {
  height: 5px;
}
</style>
<script>
export default {
  setup() {
    const route = VueRouter.useRoute();
    const router = VueRouter.useRouter();

    const progress = Vue.reactive({
      remain: [
        {
          //default value
          question: "よみこみ中...",
          answers: ["少々お待ち下さい..."],
          count: 2,
        },
      ],
      total: 0,
    });

    const loadCsv = function () {
      //load csv from db
      db.files.get(route.params.fileId).then(function (fileData) {
        console.log(fileData);
        if (fileData === undefined) {
          alert("存在しないファイルIDが指定されています。\nホームに戻ります。");
          router.replace("/");
        } else {
          fileData.file.text().then(function (csvStr) {
            let csv = Papa.parse(csvStr, {
              skipEmptyLines: true,
            }).data;

            //randomize
            if (route.query.random === "true") {
              const shuffle = ([...array]) => {
                for (let i = array.length - 1; i >= 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
              };

              csv = shuffle(csv);
            }

            let csvJson = [];
            csv.forEach(function (row) {
              csvJson.push({
                question: row[0],
                answers: row[1].split("||"),
                count: 2,
              });
            });

            progress.remain = csvJson;
            progress.total = csvJson.length;
          });
        }
      });

      //Vue Router Config
      VueRouter.onBeforeRouteLeave(function(to, from){
          if(progress.remain.length === 0) return true
          else if(!window.confirm("【確認】\n現在、学習を実行中です。\nページから離れると進捗状況が削除されますがよろしいですか？")){
              return false
          }else{
              return true
          }
      });
    };

    loadCsv();

    //define rem and unrem func
    const rem = function () {
      progress.remain.shift();
    };

    const unrem = function () {
      progress.remain.push(progress.remain[0]);
      progress.remain.shift();
    };
    return { progress, rem, unrem };
  },
};
</script>