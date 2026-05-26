// migrate-content.js
// ✅ Run ONE TIME to fix all old plain-text posts in DB
// Command: node migrate-content.js

const { Post } = require("../models");

const convertTextToHTML = (text) => {
  if (!text || !text.trim()) return "";
  if (/<(p|br|div|h[1-6]|ul|ol|li)\b/i.test(text)) return text; // already HTML

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const escaped = normalized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const blocks = escaped.split(/\n{2,}/);
  if (blocks.length > 1) {
    return blocks
      .map((b) => (b.trim() ? `<p>${b.replace(/\n/g, "<br>")}</p>` : ""))
      .filter(Boolean)
      .join("");
  }
  if (escaped.includes("\n")) return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
  return `<p>${escaped}</p>`;
};

const migrate = async () => {
  try {
    const posts = await Post.findAll();
    let updated = 0;

    for (const post of posts) {
      const content = post.content || "";
      // Skip if already HTML
      if (/<(p|br|div)\b/i.test(content)) {
        console.log(`⏭  Post ${post.id} already HTML — skip`);
        continue;
      }
      const htmlContent = convertTextToHTML(content);
      await post.update({ content: htmlContent });
      console.log(`✅ Post ${post.id} converted`);
      updated++;
    }

    console.log(`\n🎉 Done! ${updated} posts converted.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
};

migrate();