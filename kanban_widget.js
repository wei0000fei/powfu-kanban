// Powfu 拍摄看板 — iOS Scriptable 桌面小组件
// 安装方式：iPhone 下载 Scriptable → 新建脚本 → 粘贴此代码 → 桌面添加小组件

const TASKS_URL = "https://raw.githubusercontent.com/wei0000fei/claude-memory/master/tasks.json";
const LOCAL_URL = "http://192.168.31.180:8765/tasks.json";

const STATUS_EMOJI = {
  "planning": "🟡", "scripting": "📝", "shooting": "🎬",
  "editing": "✂️", "published": "✅"
};
const PRIORITY_EMOJI = { "high": "🔥", "medium": "⭐", "low": "·" };

async function fetchTasks() {
  let req = new Request(TASKS_URL);
  req.timeoutInterval = 10;
  try {
    let data = await req.loadJSON();
    return data;
  } catch {
    // Fallback to local
    try {
      let localReq = new Request(LOCAL_URL);
      localReq.timeoutInterval = 5;
      return await localReq.loadJSON();
    } catch {
      return { tasks: [], updated: "离线" };
    }
  }
}

async function createWidget() {
  let data = await fetchTasks();
  let tasks = data.tasks || [];

  // Filter: show planning + scripting + shooting (not published)
  let active = tasks.filter(t => t.status !== "published");

  let widget = new ListWidget();
  widget.backgroundColor = new Color("#0f0f0f");
  widget.setPadding(14, 16, 14, 16);

  // Header
  let header = widget.addText("Powfu 拍摄看板");
  header.font = Font.boldSystemFont(13);
  header.textColor = new Color("#f59e0b");
  widget.addSpacer(6);

  if (active.length === 0) {
    let empty = widget.addText("暂时没有待办项目 🎉");
    empty.font = Font.systemFont(12);
    empty.textColor = new Color("#555");
  } else {
    for (let t of active.slice(0, 5)) {
      let row = widget.addStack();
      row.layoutHorizontally();
      row.spacing = 6;

      let emoji = STATUS_EMOJI[t.status] || "·";
      let priority = PRIORITY_EMOJI[t.priority] || "";
      let title = t.title.length > 12 ? t.title.slice(0,11) + "…" : t.title;

      let line = row.addText(`${emoji} ${title}`);
      line.font = Font.systemFont(11);
      line.textColor = new Color("#ddd");
      line.lineLimit = 1;
      row.addSpacer();

      let ptext = row.addText(priority);
      ptext.font = Font.systemFont(10);
    }
  }

  widget.addSpacer(8);

  // Footer
  let footer = widget.addText(data.updated ? `↑ ${data.updated.slice(0,10)}` : "");
  footer.font = Font.systemFont(8);
  footer.textColor = new Color("#444");
  footer.rightAlignText();

  return widget;
}

let widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();
