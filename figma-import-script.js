// =====================================================================
// FIGMA CANVAS GENERATOR SCRIPT: "NẾP — GÓC SỔ TAY"
// =====================================================================
// HƯỚNG DẪN CHẠY:
// 1. Mở file Figma của bạn: https://www.figma.com/design/dMaAN7n9XSqpmD4rxCNpxF/Untitled
// 2. Mở Figma Console:
//    - Trên Figma Desktop: Nhấn tổ hợp phím Cmd + Option + I (macOS) hoặc Ctrl + Shift + I (Windows)
//    - Chuyển sang tab "Console"
// 3. Dán toàn bộ nội dung script này vào Console và nhấn Enter.
// Toàn bộ giao diện "Nếp — Góc sổ tay" với đầy đủ Auto Layout, màu sắc,
// cuốn sổ 3D và các layer chi tiết sẽ được tự động vẽ lên Canvas!
// =====================================================================

(async () => {
  console.log("🎨 Đang tải fonts và khởi tạo thiết kế Nếp...");

  // 1. Tải fonts cần thiết
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  } catch (e) {
    console.warn("Lỗi tải font Inter, thử tải font hệ thống Roboto:", e);
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
  }

  // 2. Color Palette & Helpers
  const hex = (h) => {
    const c = h.replace("#", "");
    return {
      r: parseInt(c.substring(0, 2), 16) / 255,
      g: parseInt(c.substring(2, 4), 16) / 255,
      b: parseInt(c.substring(4, 6), 16) / 255
    };
  };

  const fill = (h) => [{ type: "SOLID", color: hex(h) }];
  const stroke = (h) => [{ type: "SOLID", color: hex(h) }];

  const colors = {
    bg: "#F5F0E8",         // Nền ấm áp tổng thể
    surface: "#FAF7F2",    // Nền card nhẹ
    pageBg: "#FDFCFA",     // Nền trang sổ tay
    textPrimary: "#2E2823",// Chữ đậm chính (charcoal nâu)
    textSecondary: "#7A7268",// Chữ phụ (warm gray)
    textMuted: "#A39B90",  // Chữ nhạt
    accentBrown: "#9C4A32",// Màu nâu đỏ chủ đạo (bookmark, highlight)
    accentLight: "#EEDCD6",// Màu nâu đỏ nhạt
    cardBorder: "#E8E2D8", // Viền card
    highlightBg: "#ECE4DA" // Active card môn học
  };

  const txt = (chars, size = 14, style = "Regular", color = colors.textPrimary) => {
    const t = figma.createText();
    t.fontName = { family: "Inter", style };
    t.characters = chars;
    t.fontSize = size;
    t.fills = fill(color);
    return t;
  };

  const createAutoLayout = (name, dir = "VERTICAL", padX = 0, padY = 0, itemSpacing = 0) => {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir;
    f.paddingLeft = padX;
    f.paddingRight = padX;
    f.paddingTop = padY;
    f.paddingBottom = padY;
    f.itemSpacing = itemSpacing;
    f.fills = [];
    return f;
  };

  // 3. FRAME GỐC TOÀN BỘ TRANG (1440 x 960)
  const root = figma.createFrame();
  root.name = "Nếp — Góc sổ tay (Desktop 1440)";
  root.resize(1440, 960);
  root.fills = fill(colors.bg);
  root.layoutMode = "VERTICAL";
  root.paddingLeft = 48;
  root.paddingRight = 48;
  root.paddingTop = 24;
  root.paddingBottom = 24;
  root.itemSpacing = 20;

  // -------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------
  const header = createAutoLayout("Header", "HORIZONTAL", 0, 0, 0);
  header.resize(1344, 48);
  header.layoutAlign = "STRETCH";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";

  // Left logo
  const logoGroup = createAutoLayout("Logo Group", "HORIZONTAL", 0, 0, 12);
  logoGroup.counterAxisAlignItems = "CENTER";
  const logoText = txt("nếp.", 22, "Bold", colors.textPrimary);
  const logoDivider = txt("|", 14, "Regular", colors.textMuted);
  const logoTagline = txt("GÓC NHỎ CHO RIÊNG MÌNH", 11, "Medium", colors.textSecondary);
  logoTagline.letterSpacing = { value: 6, unit: "PERCENT" };
  logoGroup.appendChild(logoText);
  logoGroup.appendChild(logoDivider);
  logoGroup.appendChild(logoTagline);

  // Center nav tabs
  const navTabs = createAutoLayout("Navigation Tabs", "HORIZONTAL", 0, 0, 32);
  navTabs.counterAxisAlignItems = "CENTER";
  const tab1 = txt("Sổ tay của tôi", 14, "Bold", colors.accentBrown);
  const tab2 = txt("Kho cảm hứng", 14, "Regular", colors.textSecondary);
  const tab3 = txt("Trang đã lưu", 14, "Regular", colors.textSecondary);
  navTabs.appendChild(tab1);
  navTabs.appendChild(tab2);
  navTabs.appendChild(tab3);

  // Right user
  const rightUser = createAutoLayout("User Action", "HORIZONTAL", 0, 0, 16);
  rightUser.counterAxisAlignItems = "CENTER";
  const searchIcon = txt("🔍", 14, "Regular", colors.textSecondary);
  const avatar = figma.createFrame();
  avatar.name = "Avatar";
  avatar.resize(32, 32);
  avatar.cornerRadius = 16;
  avatar.fills = fill("#E2D7CB");
  avatar.layoutMode = "VERTICAL";
  avatar.primaryAxisAlignItems = "CENTER";
  avatar.counterAxisAlignItems = "CENTER";
  const avatarTxt = txt("An", 12, "Medium", colors.textPrimary);
  avatar.appendChild(avatarTxt);
  rightUser.appendChild(searchIcon);
  rightUser.appendChild(avatar);

  header.appendChild(logoGroup);
  header.appendChild(navTabs);
  header.appendChild(rightUser);
  root.appendChild(header);

  // -------------------------------------------------------------
  // HERO GREETING BANNER
  // -------------------------------------------------------------
  const hero = createAutoLayout("Hero Banner", "HORIZONTAL", 0, 0, 0);
  hero.resize(1344, 70);
  hero.layoutAlign = "STRETCH";
  hero.primaryAxisAlignItems = "SPACE_BETWEEN";
  hero.counterAxisAlignItems = "CENTER";

  const heroLeft = createAutoLayout("Hero Texts", "VERTICAL", 0, 0, 4);
  const heroDate = txt("THỨ BẢY, 10 THÁNG 10 · CHÀO AN", 11, "Bold", colors.accentBrown);
  heroDate.letterSpacing = { value: 4, unit: "PERCENT" };
  const heroHeading = txt("Một khoảng lặng, một trang mới.", 24, "Bold", colors.textPrimary);
  const heroSub = txt("Đặt những bộn bề xuống. Giữ lại điều đáng nhớ.", 13, "Regular", colors.textSecondary);
  heroLeft.appendChild(heroDate);
  heroLeft.appendChild(heroHeading);
  heroLeft.appendChild(heroSub);

  const heroRight = createAutoLayout("Hero Buttons", "HORIZONTAL", 0, 0, 12);
  const btnChange = createAutoLayout("Button Đổi Sổ", "HORIZONTAL", 16, 10, 8);
  btnChange.cornerRadius = 20;
  btnChange.fills = fill("#FAF7F2");
  btnChange.strokes = stroke(colors.cardBorder);
  btnChange.appendChild(txt("📖 Đổi sổ", 13, "Medium", colors.textPrimary));

  const btnNew = createAutoLayout("Button Viết Trang Mới", "HORIZONTAL", 18, 10, 8);
  btnNew.cornerRadius = 20;
  btnNew.fills = fill(colors.accentBrown);
  btnNew.appendChild(txt("+ Viết trang mới", 13, "Medium", "#FFFFFF"));

  heroRight.appendChild(btnChange);
  heroRight.appendChild(btnNew);

  hero.appendChild(heroLeft);
  hero.appendChild(heroRight);
  root.appendChild(hero);

  // -------------------------------------------------------------
  // MAIN BODY (3 CỘT: CỘT TRÁI | CUỐN SỔ TAY Ở GIỮA | CỘT PHẢI)
  // -------------------------------------------------------------
  const bodyLayout = createAutoLayout("Main Body Layout", "HORIZONTAL", 0, 0, 24);
  bodyLayout.layoutAlign = "STRETCH";
  bodyLayout.primaryAxisAlignItems = "SPACE_BETWEEN";

  // ===== CỘT 1: SIDEBAR TRÁI (230px) =====
  const leftCol = createAutoLayout("Sidebar Trái", "VERTICAL", 0, 0, 16);
  leftCol.resize(230, 680);

  const notebookTitleGroup = createAutoLayout("Notebook Title", "VERTICAL", 0, 0, 2);
  notebookTitleGroup.appendChild(txt("CUỐN SỔ HỌC", 10, "Bold", colors.textMuted));
  notebookTitleGroup.appendChild(txt("Hỏi đáp Toán · Tiếng Việt", 16, "Bold", colors.textPrimary));
  notebookTitleGroup.appendChild(txt("Lớp 5 · AI hỗ trợ", 12, "Regular", colors.textSecondary));
  leftCol.appendChild(notebookTitleGroup);

  // Toolbar icons
  const toolbar = createAutoLayout("Toolbar", "HORIZONTAL", 8, 6, 12);
  toolbar.cornerRadius = 8;
  toolbar.fills = fill("#EAE2D8");
  toolbar.appendChild(txt("👆", 12));
  toolbar.appendChild(txt("T", 12, "Bold", colors.textSecondary));
  toolbar.appendChild(txt("✏️", 12));
  toolbar.appendChild(txt("🖼️", 12));
  toolbar.appendChild(txt("≡", 12));
  toolbar.appendChild(txt("↩", 12));
  leftCol.appendChild(toolbar);

  // Danh mục môn học
  const subjects = createAutoLayout("Subjects List", "VERTICAL", 0, 0, 8);
  subjects.appendChild(txt("MÔN HỌC", 10, "Bold", colors.textMuted));

  const mathCard = createAutoLayout("Toán Card (Active)", "VERTICAL", 12, 10, 2);
  mathCard.layoutAlign = "STRETCH";
  mathCard.cornerRadius = 8;
  mathCard.fills = fill(colors.highlightBg);
  mathCard.appendChild(txt("Toán lớp 5", 13, "Bold", colors.accentBrown));
  mathCard.appendChild(txt("Bài tập chia hết", 11, "Regular", colors.textSecondary));
  subjects.appendChild(mathCard);

  const litCard = createAutoLayout("Tiếng Việt Card", "VERTICAL", 12, 8, 2);
  litCard.layoutAlign = "STRETCH";
  litCard.appendChild(txt("Tiếng Việt lớp 5", 13, "Medium", colors.textPrimary));
  litCard.appendChild(txt("Đọc hiểu và từ vựng", 11, "Regular", colors.textMuted));
  subjects.appendChild(litCard);

  const sciCard = createAutoLayout("Khoa Học Card", "VERTICAL", 12, 8, 2);
  sciCard.layoutAlign = "STRETCH";
  sciCard.appendChild(txt("Khoa học tự nhiên", 13, "Medium", colors.textPrimary));
  sciCard.appendChild(txt("Động vật và môi trường", 11, "Regular", colors.textMuted));
  subjects.appendChild(sciCard);

  const seeAllLink = txt("Xem tất cả →", 12, "Medium", colors.accentBrown);
  subjects.appendChild(seeAllLink);
  leftCol.appendChild(subjects);

  // Bottom left note
  const leftFooter = txt("✨ AI giúp bạn giải nhanh hơn", 11, "Regular", colors.textSecondary);
  leftCol.appendChild(leftFooter);
  bodyLayout.appendChild(leftCol);

  // ===== CỘT 2: CUỐN SỔ TAY 2 TRANG MỞ ĐÔI (820px x 680px) =====
  const bookWrapper = createAutoLayout("Book Wrapper", "VERTICAL", 0, 0, 12);
  bookWrapper.counterAxisAlignItems = "CENTER";

  // Khối cuốn sách
  const bookFrame = figma.createFrame();
  bookFrame.name = "Open Notebook 3D";
  bookFrame.resize(820, 620);
  bookFrame.cornerRadius = 16;
  bookFrame.fills = fill("#5C5248"); // Viền bìa da nâu tối bên ngoài
  bookFrame.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.2, g: 0.15, b: 0.1, a: 0.18 },
    offset: { x: 0, y: 12 },
    radius: 32,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Khối ruột giấy 2 trang
  const paper = figma.createFrame();
  paper.name = "Paper Spread";
  paper.resize(804, 604);
  paper.x = 8;
  paper.y = 8;
  paper.cornerRadius = 10;
  paper.fills = fill(colors.pageBg);
  paper.layoutMode = "HORIZONTAL";
  paper.paddingLeft = 0;
  paper.paddingRight = 0;
  paper.paddingTop = 0;
  paper.paddingBottom = 0;
  bookFrame.appendChild(paper);

  // --- TRANG TRÁI (Page 12) ---
  const leftPage = createAutoLayout("Trang Trái (Trang 12)", "VERTICAL", 32, 28, 16);
  leftPage.resize(402, 604);
  leftPage.layoutAlign = "STRETCH";

  const p12Head = createAutoLayout("P12 Header", "HORIZONTAL", 0, 0, 0);
  p12Head.layoutAlign = "STRETCH";
  p12Head.primaryAxisAlignItems = "SPACE_BETWEEN";
  p12Head.appendChild(txt("10 THÁNG 10, 2026", 11, "Medium", colors.textMuted));
  p12Head.appendChild(txt("📖 Toán lớp 5", 11, "Bold", colors.accentBrown));
  leftPage.appendChild(p12Head);

  const p12TitleGroup = createAutoLayout("P12 Title", "VERTICAL", 0, 0, 4);
  p12TitleGroup.appendChild(txt("Bài tập chia hết\nvới 3", 22, "Bold", colors.textPrimary));
  p12TitleGroup.appendChild(txt("Hãy dùng AI giúp mình giải nhanh bài này.", 12, "Regular", colors.textSecondary));
  leftPage.appendChild(p12TitleGroup);

  // Card Đề bài
  const taskCard = createAutoLayout("Card Đề Bài", "VERTICAL", 16, 14, 8);
  taskCard.layoutAlign = "STRETCH";
  taskCard.cornerRadius = 8;
  taskCard.fills = fill("#FFFFFF");
  taskCard.strokes = stroke(colors.cardBorder);
  taskCard.appendChild(txt("BÀI TẬP", 10, "Bold", colors.textMuted));
  taskCard.appendChild(txt("Một thửa vườn hình chữ nhật có chiều dài 18 m và chiều rộng 12 m. Người làm vườn muốn chia vườn thành các lô nhỏ đều nhau để trồng rau. Nếu mỗi lô nhỏ có diện tích 6 m², thì vườn sẽ được chia thành bao nhiêu lô?", 13, "Regular", colors.textPrimary));
  leftPage.appendChild(taskCard);

  // Card Chụp ảnh đề bài
  const photoCard = createAutoLayout("Card Chụp Ảnh", "HORIZONTAL", 16, 14, 12);
  photoCard.layoutAlign = "STRETCH";
  photoCard.cornerRadius = 8;
  photoCard.fills = fill("#FAF7F2");
  photoCard.strokes = stroke(colors.cardBorder);
  photoCard.appendChild(txt("📷", 20));
  const photoText = txt("Chụp ảnh đề bài hoặc tải hình lên để AI hỗ trợ giải nhanh hơn.", 11, "Regular", colors.textSecondary);
  photoCard.appendChild(photoText);
  leftPage.appendChild(photoCard);

  const p12Num = txt("12", 11, "Medium", colors.textMuted);
  leftPage.appendChild(p12Num);
  paper.appendChild(leftPage);

  // --- TRANG PHẢI (Page 13) ---
  const rightPage = createAutoLayout("Trang Phải (Trang 13)", "VERTICAL", 32, 28, 14);
  rightPage.resize(402, 604);
  rightPage.layoutAlign = "STRETCH";

  const p13Head = createAutoLayout("P13 Header", "HORIZONTAL", 0, 0, 0);
  p13Head.layoutAlign = "STRETCH";
  p13Head.primaryAxisAlignItems = "SPACE_BETWEEN";
  p13Head.appendChild(txt("TRẢ LỜI TỪ AI", 11, "Bold", colors.textMuted));
  p13Head.appendChild(txt("✨", 14));
  rightPage.appendChild(p13Head);

  rightPage.appendChild(txt("Cách giải: chia diện tích vườn cho diện tích mỗi lô", 18, "Bold", colors.textPrimary));

  // 4 Bước giải
  const steps = createAutoLayout("4 Bước Giải", "VERTICAL", 0, 0, 6);
  steps.appendChild(txt("• Bước 1: Diện tích vườn = chiều dài × chiều rộng.", 12, "Regular", colors.textPrimary));
  steps.appendChild(txt("• Bước 2: Diện tích vườn là 18 × 12 = 216 m².", 12, "Regular", colors.accentBrown));
  steps.appendChild(txt("• Bước 3: Số lô = diện tích vườn ÷ diện tích mỗi lô.", 12, "Regular", colors.textPrimary));
  steps.appendChild(txt("• Bước 4: 216 ÷ 6 = 36. Vậy có 36 lô trồng rau.", 12, "Regular", colors.accentBrown));
  rightPage.appendChild(steps);

  // Card Kết quả to
  const resultCard = createAutoLayout("Card Kết Quả", "VERTICAL", 16, 12, 4);
  resultCard.layoutAlign = "STRETCH";
  resultCard.cornerRadius = 8;
  resultCard.fills = fill("#FFFFFF");
  resultCard.strokes = stroke(colors.cardBorder);
  resultCard.appendChild(txt("Số lô trồng rau", 11, "Medium", colors.textMuted));
  resultCard.appendChild(txt("36 lô", 30, "Bold", colors.accentBrown));
  resultCard.appendChild(txt("Vì 216 chia hết cho 6 nên mỗi lô đều có diện tích 6 m².", 11, "Regular", colors.textSecondary));
  rightPage.appendChild(resultCard);

  // Quote & Gợi ý
  rightPage.appendChild(txt('“Học Toán dễ hơn khi bạn chia nhỏ bài tập.”', 12, "Medium", colors.accentBrown));
  rightPage.appendChild(txt("— Gợi ý từ AI", 11, "Regular", colors.textMuted));

  const p13Num = txt("13", 11, "Medium", colors.textMuted);
  rightPage.appendChild(p13Num);
  paper.appendChild(rightPage);

  // Bookmark ribbon (dải ruy băng nâu đỏ treo giữa sách)
  const ribbon = figma.createRectangle();
  ribbon.name = "Bookmark Ribbon";
  ribbon.resize(16, 52);
  ribbon.x = 402;
  ribbon.y = 570;
  ribbon.fills = fill(colors.accentBrown);
  bookFrame.appendChild(ribbon);

  bookWrapper.appendChild(bookFrame);

  // Pagination controls dưới sách
  const pagination = createAutoLayout("Pagination Bar", "HORIZONTAL", 0, 4, 32);
  pagination.counterAxisAlignItems = "CENTER";
  pagination.appendChild(txt("← Trang trước", 12, "Medium", colors.textSecondary));
  pagination.appendChild(txt("12 — 13 / 48", 12, "Bold", colors.textPrimary));
  pagination.appendChild(txt("Trang sau →", 12, "Medium", colors.textSecondary));
  bookWrapper.appendChild(pagination);

  bodyLayout.appendChild(bookWrapper);

  // ===== CỘT 3: SIDEBAR PHẢI (220px) =====
  const rightCol = createAutoLayout("Sidebar Phải", "VERTICAL", 0, 0, 20);
  rightCol.resize(220, 680);

  // Gợi ý nhỏ
  const tipGroup = createAutoLayout("Gợi Ý Nhỏ", "VERTICAL", 0, 0, 4);
  tipGroup.appendChild(txt("💡 MỘT GỢI Ý NHỎ", 10, "Bold", colors.accentBrown));
  tipGroup.appendChild(txt("Bài tập chia hết với 3", 14, "Bold", colors.textPrimary));
  tipGroup.appendChild(txt("Nhớ kiểm tra xem tổng các chữ số có chia hết cho 3 không.", 12, "Regular", colors.textSecondary));
  tipGroup.appendChild(txt("↻ Gợi ý khác", 11, "Medium", colors.accentBrown));
  rightCol.appendChild(tipGroup);

  // Công cụ học
  const toolsGroup = createAutoLayout("Công Cụ Học", "VERTICAL", 0, 0, 8);
  toolsGroup.appendChild(txt("CÔNG CỤ HỌC", 10, "Bold", colors.textMuted));
  toolsGroup.appendChild(txt("💬  Lịch sử chat", 13, "Regular", colors.textPrimary));
  toolsGroup.appendChild(txt("✨  Mẹo tip hay", 13, "Regular", colors.textPrimary));
  toolsGroup.appendChild(txt("📷  Chụp ảnh bài tập", 13, "Regular", colors.textPrimary));
  rightCol.appendChild(toolsGroup);

  // Streak 7 ngày học
  const streakGroup = createAutoLayout("Streak 7 Ngày", "VERTICAL", 0, 0, 8);
  streakGroup.appendChild(txt("🌱 7 ngày học đều", 13, "Bold", colors.textPrimary));
  streakGroup.appendChild(txt("Một thói quen nhỏ. Một chút gắn mình hơn.", 11, "Regular", colors.textMuted));

  const daysRow = createAutoLayout("Days Row", "HORIZONTAL", 0, 0, 6);
  ["2", "3", "4", "5", "6", "7", "CN"].forEach((d) => {
    const pill = createAutoLayout("Day " + d, "VERTICAL", 6, 6, 0);
    pill.resize(22, 22);
    pill.cornerRadius = 4;
    pill.fills = fill("#EAE2D8");
    pill.primaryAxisAlignItems = "CENTER";
    pill.counterAxisAlignItems = "CENTER";
    pill.appendChild(txt(d, 10, "Medium", colors.textPrimary));
    daysRow.appendChild(pill);
  });
  streakGroup.appendChild(daysRow);
  rightCol.appendChild(streakGroup);

  bodyLayout.appendChild(rightCol);
  root.appendChild(bodyLayout);

  // -------------------------------------------------------------
  // FOOTER CHÂN TRANG
  // -------------------------------------------------------------
  const footer = createAutoLayout("Footer", "HORIZONTAL", 0, 8, 0);
  footer.resize(1344, 24);
  footer.layoutAlign = "STRETCH";
  footer.primaryAxisAlignItems = "SPACE_BETWEEN";
  footer.counterAxisAlignItems = "CENTER";

  const footerQuote = txt("🪶 Có những bài tập, giải ra là thấy vui.", 12, "Regular", colors.textSecondary);
  const footerLinks = createAutoLayout("Footer Links", "HORIZONTAL", 0, 0, 16);
  footerLinks.appendChild(txt("⛶ Chế độ tập trung", 12, "Regular", colors.textSecondary));
  footerLinks.appendChild(txt("|", 12, "Regular", colors.textMuted));
  footerLinks.appendChild(txt("Hướng dẫn & phím tắt", 12, "Regular", colors.textSecondary));

  footer.appendChild(footerQuote);
  footer.appendChild(footerLinks);
  root.appendChild(footer);

  // 4. Định vị frame trên màn hình Figma
  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("✅ ĐÃ RÃ THIẾT KẾ 'NẾP — GÓC SỔ TAY' LÊN CANVAS FIGMA THÀNH CÔNG!");
})();

