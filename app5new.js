const path = require('path'); // app5.jsにあったライブラリ読み込みを維持
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// 【追加】app5new.jsより：POSTデータ（フォーム入力）を受け取るための設定
app.use(express.urlencoded({ extended: true }));

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

// ---------------------------------------------------
// ここから app5new.js の新機能（CRUD機能）を追加
// ---------------------------------------------------

// 一覧
app.get("/keiyo2", (req, res) => {
  res.render('keiyo2_new', {data: station2} );
});

// Create (新規作成画面への遷移)
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read (詳細表示)
app.get("/keiyo2/:number", (req, res) => {
  const number = req.params.number;
  const detail = station2[ number ];
  // app5new.jsの仕様に合わせて id も渡すように変更
  res.render('keiyo2_detail_new', {id: number, data: detail} );
});

// Delete (削除処理)
app.get("/keiyo2/delete/:number", (req, res) => {
  // 本来は削除の確認ページを表示する
  // 本来は削除する番号が存在するか厳重にチェックする
  station2.splice( req.params.number, 1 );
  res.redirect('/keiyo2' );
});

// Create (新規登録処理)
app.post("/keiyo2", (req, res) => {
  const id = station2.length + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  console.log( station2 );
  res.render('keiyo2_new', {data: station2} );
});

// Edit (編集画面への遷移)
app.get("/keiyo2/edit/:number", (req, res) => {
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_edit_new', {id: number, data: detail} );
});

// Update (更新処理)
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});

// ---------------------------------------------------
// 共通機能など
// ---------------------------------------------------

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

// ---------------------------------------------------
// じゃんけん機能 (app5.js の完成済みロジックを採用)
// ---------------------------------------------------

// app5new.jsにはなかったが、app5.jsにあったフォーム表示用ルートを維持
app.get("/janken_form", (req, res) => {
  res.sendFile(path.join(__dirname, 'janken_form.html'));
});

// app5.js のロジックを使用（app5new.jsの未完成コードは採用しない）
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;

  const num = Math.floor(Math.random() * 3); // 0, 1, 2 のいずれかを生成
  let cpu = '';
  let judgement = '';

  if (num === 0) cpu = 'グー';
  else if (num === 1) cpu = 'チョキ';
  else cpu = 'パー';

  // --- 勝敗判定ロジック ---
  total += 1; // 試行回数は常に1増える

  if (hand === cpu) {
    judgement = 'あいこ';
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1; // 勝った時だけ勝ち数を増やす
  } else {
    judgement = '負け';
  }
  // --- 判定ロジックここまで ---

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render('janken', display); 
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));