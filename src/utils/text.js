const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&#39;": "'", "&nbsp;": " " };

export const decodeEntities = (s = "") =>
  String(s).replace(/&(amp|lt|gt|quot|nbsp|#0?39);/g, (m) => ENTITIES[m] ?? m);

export const stripHtml = (s = "") =>
  decodeEntities(String(s).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
