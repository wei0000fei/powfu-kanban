// Powfu 拍摄看板 — iOS Scriptable 小组件 v2
const URL = "https://wei0000fei.github.io/powfu-kanban/tasks.json";
const EMOJI = { "planning":"🟡", "scripting":"✍️", "shooting":"🎬", "editing":"🎞️", "published":"✅" };

let data;
try { data = await new Request(URL).loadJSON(); } catch(e) { data={tasks:[],updated:"离线"}; }
let tasks = (data.tasks||[]).filter(t => t.status !== "published");

let w = new ListWidget();
w.backgroundColor = new Color("#0f0f0f");
w.setPadding(16, 18, 14, 18);

// Title
let t = w.addText("Powfu 拍摄看板");
t.font = Font.boldSystemFont(15);
t.textColor = new Color("#f5a623");
w.addSpacer(10);

// Tasks
let n = Math.min(tasks.length, 5);
if (n === 0) {
  let e = w.addText("暂时没有待办 🎉");
  e.font = Font.mediumSystemFont(12);
  e.textColor = new Color("#555");
} else {
  for (let i=0; i<n; i++) {
    let tk = tasks[i];
    let s = EMOJI[tk.status]||"·";
    let title = tk.title.length>14 ? tk.title.slice(0,13)+"…" : tk.title;
    let p = tk.priority==="high"?"  🔥":"";
    let line = w.addText(`${s}  ${title}${p}`);
    line.font = Font.systemFont(12);
    line.textColor = new Color("#ccc");
    line.lineLimit = 1;
    w.addSpacer(6);
  }
}

w.addSpacer(4);

// Footer
let u = data.updated ? data.updated.slice(0,10) : "";
let f = w.addText(`更新于 ${u}`);
f.font = Font.systemFont(8);
f.textColor = new Color("#666");
f.rightAlignText();

if (config.runsInWidget) { Script.setWidget(w); } else { w.presentMedium(); }
Script.complete();
