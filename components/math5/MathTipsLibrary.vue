<script setup lang="ts">
import { BookOpenCheck, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-vue-next'
import { mathTipLessons } from '~/data/math-tip-lessons'

type TipCategory = 'numbers' | 'fractions' | 'decimals' | 'percent' | 'units' | 'geometry' | 'word' | 'motion'
type MathTip = {
  id: keyof typeof mathTipLessons
  category: TipCategory
  emoji: string
  title: string
  formula: string
  note: string
  example: string
}

const categories = [
  { id: 'all', label: 'Tất cả', emoji: '✨' },
  { id: 'numbers', label: 'Số & phép tính', emoji: '🔢' },
  { id: 'fractions', label: 'Phân số', emoji: '🍕' },
  { id: 'decimals', label: 'Số thập phân', emoji: '🎯' },
  { id: 'percent', label: 'Phần trăm', emoji: '💯' },
  { id: 'units', label: 'Đổi đơn vị', emoji: '📏' },
  { id: 'geometry', label: 'Hình học', emoji: '📐' },
  { id: 'word', label: 'Toán có lời văn', emoji: '🧩' },
  { id: 'motion', label: 'Chuyển động', emoji: '🚲' },
] as const

const tips: MathTip[] = [
  { id: 'order', category: 'numbers', emoji: '🪜', title: 'Thứ tự phép tính', formula: '( ) → ×, : → +, −', note: 'Trong ngoặc trước; nhân chia trước; cộng trừ sau. Cùng mức thì làm từ trái sang phải.', example: '18 − 3 × 4 = 18 − 12 = 6' },
  { id: 'average', category: 'numbers', emoji: '⚖️', title: 'Số trung bình cộng', formula: 'Trung bình = Tổng : Số các số hạng', note: 'Cộng tất cả rồi chia đều cho số lượng.', example: '(8 + 9 + 10) : 3 = 9' },
  { id: 'divisible', category: 'numbers', emoji: '🔍', title: 'Dấu hiệu chia hết', formula: '2: số chẵn · 5: tận cùng 0/5 · 9: tổng chữ số chia hết cho 9', note: 'Với 3, cộng các chữ số rồi kiểm tra tổng có chia hết cho 3 không.', example: '315 chia hết cho 3 vì 3 + 1 + 5 = 9' },

  { id: 'fraction-simplify', category: 'fractions', emoji: '✂️', title: 'Rút gọn phân số', formula: 'Chia cả tử và mẫu cho cùng một số', note: 'Tử và mẫu phải cùng chia cho một số lớn hơn 1.', example: '12/18 = 2/3 (cùng chia 6)' },
  { id: 'fraction-compare', category: 'fractions', emoji: '⚔️', title: 'So sánh phân số', formula: 'Quy đồng mẫu rồi so sánh tử', note: 'Cùng mẫu: tử lớn hơn thì phân số lớn hơn.', example: '2/3 = 4/6 > 3/6 = 1/2' },
  { id: 'fraction-add', category: 'fractions', emoji: '➕', title: 'Cộng, trừ phân số', formula: 'Quy đồng mẫu → cộng/trừ tử → giữ mẫu', note: 'Nhớ rút gọn kết quả nếu có thể.', example: '1/2 + 1/3 = 3/6 + 2/6 = 5/6' },
  { id: 'fraction-multiply', category: 'fractions', emoji: '✖️', title: 'Nhân, chia phân số', formula: 'Nhân: tử×tử, mẫu×mẫu · Chia: nhân với phân số đảo', note: 'Có thể rút gọn chéo trước khi nhân.', example: '2/3 : 4/5 = 2/3 × 5/4 = 5/6' },
  { id: 'fraction-of-number', category: 'fractions', emoji: '🍰', title: 'Tìm phân số của một số', formula: 'Số đã cho × phân số', note: 'Muốn tìm 3/5 của 20, lấy 20 nhân 3/5.', example: '20 × 3/5 = 12' },

  { id: 'decimal-add', category: 'decimals', emoji: '📍', title: 'Cộng, trừ số thập phân', formula: 'Viết các dấu phẩy thẳng cột', note: 'Thiếu chữ số có thể thêm 0 ở bên phải phần thập phân.', example: '8,5 + 2,35 = 8,50 + 2,35 = 10,85' },
  { id: 'decimal-10', category: 'decimals', emoji: '➡️', title: 'Nhân, chia với 10; 100; 1000', formula: 'Nhân: phẩy sang phải · Chia: phẩy sang trái', note: 'Dịch 1, 2 hoặc 3 chữ số tương ứng.', example: '4,25 × 100 = 425; 42,5 : 10 = 4,25' },
  { id: 'decimal-multiply', category: 'decimals', emoji: '🧮', title: 'Nhân số thập phân', formula: 'Nhân như số tự nhiên → đếm chữ số thập phân', note: 'Đặt dấu phẩy để kết quả có đủ tổng số chữ số sau dấu phẩy.', example: '1,2 × 0,3 = 0,36' },
  { id: 'decimal-divide', category: 'decimals', emoji: '🎈', title: 'Chia cho số thập phân', formula: 'Dời phẩy để số chia thành số tự nhiên', note: 'Dời dấu phẩy ở cả số bị chia và số chia cùng số chữ số.', example: '7,5 : 0,5 = 75 : 5 = 15' },

  { id: 'percent-find', category: 'percent', emoji: '🔎', title: 'Tìm tỉ số phần trăm', formula: 'Số thứ nhất : số thứ hai × 100%', note: 'Thực hiện phép chia rồi đổi kết quả sang phần trăm.', example: '15 : 60 × 100% = 25%' },
  { id: 'percent-value', category: 'percent', emoji: '🎁', title: 'Tìm giá trị phần trăm', formula: 'Giá trị = Tổng × số % : 100', note: 'Muốn tìm 20% của 150, lấy 150 nhân 20 rồi chia 100.', example: '150 × 20 : 100 = 30' },
  { id: 'percent-total', category: 'percent', emoji: '🧠', title: 'Tìm số ban đầu', formula: 'Số ban đầu = Giá trị × 100 : số %', note: 'Dùng khi biết một phần và phần trăm của phần đó.', example: '30 là 20% của: 30 × 100 : 20 = 150' },

  { id: 'unit-length', category: 'units', emoji: '📏', title: 'Độ dài và khối lượng', formula: 'Mỗi bậc liền nhau gấp 10 lần', note: 'km–hm–dam–m–dm–cm–mm; tấn–tạ–yến–kg–hg–dag–g.', example: '2,5 m = 25 dm = 250 cm' },
  { id: 'unit-area', category: 'units', emoji: '🟩', title: 'Đơn vị diện tích', formula: 'Mỗi bậc liền nhau gấp 100 lần', note: 'Khi đổi qua một bậc, dịch dấu phẩy 2 chữ số.', example: '3 m² = 300 dm²' },
  { id: 'unit-volume', category: 'units', emoji: '🧊', title: 'Thể tích và dung tích', formula: '1 dm³ = 1 l · 1 cm³ = 1 ml', note: 'Đơn vị thể tích liền nhau gấp 1000 lần.', example: '2,5 dm³ = 2,5 l = 2500 ml' },
  { id: 'unit-time', category: 'units', emoji: '⏰', title: 'Đơn vị thời gian', formula: '1 giờ = 60 phút · 1 phút = 60 giây', note: 'Thời gian không đổi theo 10; hãy nhớ mốc 60 và 24.', example: '2 giờ 15 phút = 135 phút' },

  { id: 'rectangle', category: 'geometry', emoji: '▭', title: 'Hình chữ nhật, hình vuông', formula: 'S chữ nhật = dài × rộng · S vuông = cạnh × cạnh', note: 'Chu vi là tổng độ dài các cạnh.', example: 'Dài 8 cm, rộng 5 cm → S = 40 cm²' },
  { id: 'triangle', category: 'geometry', emoji: '🔺', title: 'Diện tích tam giác', formula: 'S = đáy × chiều cao : 2', note: 'Đáy và chiều cao phải cùng đơn vị đo.', example: 'Đáy 8 cm, cao 5 cm → S = 20 cm²' },
  { id: 'trapezoid', category: 'geometry', emoji: '🪁', title: 'Diện tích hình thang', formula: 'S = (đáy lớn + đáy bé) × cao : 2', note: 'Cộng hai đáy trước, rồi nhân chiều cao.', example: '(10 + 6) × 4 : 2 = 32 cm²' },
  { id: 'circle', category: 'geometry', emoji: '⭕', title: 'Hình tròn', formula: 'C = d × 3,14 = r × 2 × 3,14 · S = r × r × 3,14', note: 'Bán kính r bằng một nửa đường kính d.', example: 'r = 3 cm → S = 3 × 3 × 3,14 = 28,26 cm²' },
  { id: 'cuboid', category: 'geometry', emoji: '📦', title: 'Hình hộp chữ nhật', formula: 'V = dài × rộng × cao', note: 'S xung quanh = chu vi đáy × cao; S toàn phần = S xung quanh + 2 × S đáy.', example: '5 × 3 × 2 = 30 cm³' },
  { id: 'cube', category: 'geometry', emoji: '🎲', title: 'Hình lập phương', formula: 'V = cạnh³ · S toàn phần = cạnh² × 6', note: 'S xung quanh bằng diện tích một mặt nhân 4.', example: 'Cạnh 3 cm → V = 3 × 3 × 3 = 27 cm³' },

  { id: 'sum-difference', category: 'word', emoji: '⚖️', title: 'Biết tổng và hiệu', formula: 'Số lớn = (Tổng + Hiệu) : 2', note: 'Số bé = (Tổng − Hiệu) : 2.', example: 'Tổng 40, hiệu 8 → số lớn 24, số bé 16' },
  { id: 'sum-ratio', category: 'word', emoji: '🧱', title: 'Biết tổng và tỉ số', formula: 'Một phần = Tổng : tổng số phần', note: 'Vẽ sơ đồ phần bằng nhau, tìm một phần rồi tìm mỗi số.', example: 'Tổng 35, tỉ số 2:5 → một phần = 35 : 7 = 5' },
  { id: 'difference-ratio', category: 'word', emoji: '📊', title: 'Biết hiệu và tỉ số', formula: 'Một phần = Hiệu : hiệu số phần', note: 'Lấy số phần lớn trừ số phần bé.', example: 'Hiệu 15, tỉ số 2:5 → một phần = 15 : 3 = 5' },
  { id: 'unit-method', category: 'word', emoji: '1️⃣', title: 'Rút về đơn vị', formula: 'Tìm 1 phần trước → tìm nhiều phần', note: 'Phù hợp bài mua hàng, năng suất và đại lượng tỉ lệ.', example: '5 quyển giá 40 nghìn → 1 quyển 8 nghìn' },

  { id: 'motion-formula', category: 'motion', emoji: '🚲', title: 'Quãng đường, vận tốc, thời gian', formula: 's = v × t · v = s : t · t = s : v', note: 'Các đơn vị phải phù hợp: km với km/giờ và giờ.', example: 'v = 40 km/giờ, t = 2 giờ → s = 80 km' },
  { id: 'motion-meet', category: 'motion', emoji: '🤝', title: 'Hai xe đi ngược chiều', formula: 'Thời gian gặp = Khoảng cách : tổng vận tốc', note: 'Mỗi giờ khoảng cách giảm bằng tổng hai vận tốc.', example: 'Cách 120 km, vận tốc 50 và 30 → gặp sau 1,5 giờ' },
  { id: 'motion-catch', category: 'motion', emoji: '🏃', title: 'Đuổi kịp cùng chiều', formula: 'Thời gian đuổi = Khoảng cách ban đầu : hiệu vận tốc', note: 'Xe sau phải nhanh hơn xe trước.', example: 'Cách 20 km, vận tốc 50 và 40 → đuổi kịp sau 2 giờ' },
]

const activeCategory = ref<(typeof categories)[number]['id']>('all')
const keyword = ref('')
const openTip = ref<string | null>(null)
const detailedTips = tips.map(tip => ({ ...tip, lesson: mathTipLessons[tip.id] }))
const filteredTips = computed(() => {
  const query = keyword.value.trim().toLocaleLowerCase('vi')
  return detailedTips.filter((tip) => {
    const categoryMatches = activeCategory.value === 'all' || tip.category === activeCategory.value
    const textMatches = !query || [tip.title, tip.formula, tip.note, tip.example,
      tip.lesson.explanation, ...tip.lesson.steps, tip.lesson.mistake,
      ...tip.lesson.examples.flatMap(example => [example.problem, ...example.solution, example.answer, example.check])]
      .some(value => value.toLocaleLowerCase('vi').includes(query))
    return categoryMatches && textMatches
  })
})
</script>

<template>
  <div class="m5-tips-library">
    <span class="m5-tips-library__icon"><BookOpenCheck /></span>
    <h2>Mẹo Toán lớp 5</h2>
    <p class="m5-tips-library__intro">Chọn một mẹo để xem cách làm, ví dụ giải từng bước và những lỗi cần tránh.</p>

    <label class="m5-tips-search">
      <Search :size="17" aria-hidden="true" />
      <input v-model="keyword" type="search" aria-label="Tìm mẹo Toán" placeholder="Tìm: phân số, diện tích, phần trăm..." />
    </label>

    <div class="m5-tips-categories" aria-label="Chủ đề Toán lớp 5">
      <button v-for="category in categories" :key="category.id" type="button" :class="{ 'is-active': activeCategory === category.id }" :aria-pressed="activeCategory === category.id" @click="activeCategory = category.id">
        <span>{{ category.emoji }}</span>{{ category.label }}
      </button>
    </div>

    <p v-if="!filteredTips.length" class="m5-tips-empty">Chưa tìm thấy mẹo phù hợp. Em thử từ khóa khác nhé!</p>
    <div v-else class="m5-tips-grid">
      <article v-for="tip in filteredTips" :key="tip.id" class="m5-tip-card" :class="`is-${tip.category}`">
        <button type="button" class="m5-tip-card__toggle" :aria-expanded="openTip === tip.id" :aria-controls="`m5-tip-${tip.id}`" @click="openTip = openTip === tip.id ? null : tip.id">
          <span class="m5-tip-card__emoji">{{ tip.emoji }}</span>
          <span><strong>{{ tip.title }}</strong><small>{{ tip.formula }}</small></span>
          <ChevronUp v-if="openTip === tip.id" :size="17" />
          <ChevronDown v-else :size="17" />
        </button>
        <div v-if="openTip === tip.id" :id="`m5-tip-${tip.id}`" class="m5-tip-card__details">
          <p class="m5-tip-card__memory"><Sparkles :size="16" /><span><b>Cách nhớ:</b> {{ tip.note }}</span></p>
          <section class="m5-tip-lesson">
            <h3>Hiểu cách làm</h3>
            <p>{{ tip.lesson.explanation }}</p>
            <h3>Các bước thực hiện</h3>
            <ol><li v-for="step in tip.lesson.steps" :key="step">{{ step }}</li></ol>
          </section>
          <section v-for="(example, index) in tip.lesson.examples" :key="example.problem" class="m5-tip-worked-example">
            <h3>Ví dụ {{ index + 1 }} · Giải từng bước</h3>
            <p class="m5-tip-worked-example__problem">{{ example.problem }}</p>
            <ol><li v-for="step in example.solution" :key="step">{{ step }}</li></ol>
            <p class="m5-tip-worked-example__answer"><b>Đáp số:</b> {{ example.answer }}</p>
            <p class="m5-tip-worked-example__check"><b>Kiểm tra lại:</b> {{ example.check }}</p>
          </section>
          <section class="m5-tip-mistake">
            <h3>Lỗi dễ mắc</h3>
            <p>{{ tip.lesson.mistake }}</p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.m5-tips-library{width:100%;min-width:0;min-height:0;display:flex;flex:1;flex-direction:column;overflow:hidden;color:var(--m5-ink)}
.m5-tips-library__icon{width:55px;height:55px;margin:0 auto 7px;display:grid;place-items:center;flex:none;border-radius:17px;background:#fff0bd;color:#d58c00}
.m5-tips-library h2{margin:0;text-align:center;font:800 27px/1.1 var(--m5-heading)}
.m5-tips-library__intro{margin:6px auto 12px;max-width:470px;color:#72798a;font-size:11px;font-weight:700;text-align:center}
.m5-tips-search{position:relative;display:block;min-width:0;flex:none}.m5-tips-search svg{position:absolute;left:12px;top:12px;color:#77849a}.m5-tips-search input{width:100%;height:41px;padding:8px 12px 8px 37px;border:1.5px solid #d4dce8;border-radius:12px;outline:0;background:#fff;font-size:11px;font-weight:700}.m5-tips-search input:focus{border-color:#efb42f;box-shadow:0 0 0 3px rgba(239,180,47,.16)}
.m5-tips-categories{width:100%;min-width:0;display:flex;gap:6px;margin:9px 0;overflow-x:auto;overscroll-behavior-x:contain;padding:1px 1px 5px;scrollbar-width:thin}.m5-tips-categories button{min-width:max-content;height:31px;display:flex;align-items:center;gap:4px;padding:0 9px;border:1px solid #e2ded7;border-radius:999px;background:#fff;color:#60697b;font-size:9px;font-weight:900}.m5-tips-categories button.is-active{border-color:#f0b235;background:#fff3ca;color:#8b5c00}.m5-tips-categories button span{font-size:12px}
.m5-tips-grid{width:100%;min-width:0;min-height:0;display:grid;flex:1 1 0;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:max-content;align-content:start;gap:7px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;padding:1px 4px 3px 1px;scrollbar-width:thin;scrollbar-color:#d8c7b5 transparent}.m5-tip-card{min-width:0;height:max-content;align-self:start;overflow:hidden;border:1px solid #dce6ef;border-left:4px solid #72a8dc;border-radius:12px;background:#fff}.m5-tip-card.is-fractions,.m5-tip-card.is-percent{border-left-color:#ed8c7a}.m5-tip-card.is-units,.m5-tip-card.is-motion{border-left-color:#76bca8}.m5-tip-card.is-geometry{border-left-color:#e8ad32}.m5-tip-card.is-word{border-left-color:#9a89d5}.m5-tip-card__toggle{width:100%;min-width:0;min-height:61px;display:grid;grid-template-columns:31px minmax(0,1fr) 17px;align-items:center;gap:7px;padding:8px;border:0;background:transparent;color:inherit;text-align:left}.m5-tip-card__toggle>span:nth-child(2){min-width:0}.m5-tip-card__emoji{width:31px;height:31px;display:grid;place-items:center;border-radius:9px;background:#f2f7fc;font-size:17px}.m5-tip-card__toggle strong,.m5-tip-card__toggle small{display:block;overflow-wrap:anywhere}.m5-tip-card__toggle strong{font-size:10px}.m5-tip-card__toggle small{margin-top:3px;color:#d6533e;font-size:9px;font-weight:900;line-height:1.3}.m5-tip-card__toggle>svg{color:#8992a2}.m5-tip-card__details{padding:0 9px 9px;border-top:1px dashed #e4e6e8}.m5-tip-card__details p{display:flex;align-items:flex-start;gap:5px;margin:7px 0 0;color:#596174;font-size:9px;font-weight:700;line-height:1.4}.m5-tip-card__details svg{flex:none;color:#eaaa1f}.m5-tip-card__example{padding:6px;border-radius:8px;background:#f5f8fc}.m5-tips-empty{margin:20px 0;padding:16px;border-radius:13px;background:#fff5d9;color:#79622e;font-size:11px;font-weight:800;text-align:center}
@media(max-width:767px){
  .m5-tips-library__icon{width:42px;height:42px;margin-bottom:4px;border-radius:13px}.m5-tips-library__icon svg{width:22px;height:22px}
  .m5-tips-library h2{padding:0 42px;font-size:23px}
  .m5-tips-library__intro{margin:3px auto 10px;max-width:310px;padding:0 8px;font-size:11px;line-height:1.35}
  .m5-tips-search svg{left:14px;top:14px}.m5-tips-search input{height:45px;padding-left:40px;border-radius:13px;font-size:13px}
  .m5-tips-categories{gap:7px;margin:8px 0;padding:1px 1px 7px;scroll-snap-type:x proximity;scrollbar-width:none}.m5-tips-categories::-webkit-scrollbar{display:none}.m5-tips-categories button{height:40px;padding:0 12px;scroll-snap-align:start;font-size:12px}.m5-tips-categories button span{font-size:15px}
  .m5-tips-grid{grid-template-columns:1fr;gap:9px;padding:1px 2px calc(8px + env(safe-area-inset-bottom)) 1px}
  .m5-tip-card{border-radius:14px}.m5-tip-card__toggle{min-height:68px;grid-template-columns:40px minmax(0,1fr) 20px;gap:10px;padding:10px}.m5-tip-card__emoji{width:40px;height:40px;border-radius:11px;font-size:20px}.m5-tip-card__toggle strong{font-size:14px;line-height:1.25}.m5-tip-card__toggle small{font-size:11px;line-height:1.35}.m5-tip-card__details{padding:0 11px 11px}.m5-tip-card__details p{font-size:11px;line-height:1.5}.m5-tip-card__example{padding:8px}
}
</style>

<style scoped>
/* Keep the controls visible while long lessons scroll in the results area. */
.m5-tips-library h2,.m5-tips-library__intro,.m5-tips-categories{flex-shrink:0}
.m5-tip-card__details{padding:12px;overflow-wrap:anywhere}
.m5-tip-card__details p{display:block;font-size:13px;line-height:1.65;font-weight:600}
.m5-tip-card__details .m5-tip-card__memory{display:flex;margin:0;gap:7px}
.m5-tip-card__memory svg{margin-top:3px}
.m5-tip-card__details h3{margin:0 0 7px;color:var(--m5-ink);font-size:14px;font-weight:900;line-height:1.4}
.m5-tip-lesson,.m5-tip-worked-example,.m5-tip-mistake{margin-top:14px}
.m5-tip-lesson h3:not(:first-child){margin-top:14px}
.m5-tip-card__details ol{margin:7px 0 0;padding-left:23px;color:#4a5269;font-size:13px;font-weight:600;line-height:1.65}
.m5-tip-card__details li{padding-left:3px}
.m5-tip-card__details li+li{margin-top:8px}
.m5-tip-card__details li::marker{color:#347dc2;font-weight:900}
.m5-tip-worked-example{padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#f5f8fc}
.m5-tip-card__details .m5-tip-worked-example__problem{color:var(--m5-ink);font-weight:800}
.m5-tip-card__details .m5-tip-worked-example__answer{padding:9px;margin-top:12px;border-radius:8px;background:#e7f5ee;color:#236c53}
.m5-tip-card__details .m5-tip-worked-example__check{margin-top:10px}
.m5-tip-mistake{padding:12px;border-radius:12px;background:#fff4dc}
.m5-tip-mistake h3{color:#8b5c00}
@media(max-width:767px){
  .m5-tip-card__details{padding:12px}
  .m5-tip-card__details p,.m5-tip-card__details ol{font-size:14px}
  .m5-tip-card__details h3{font-size:15px}
  .m5-tips-search input{font-size:16px}
}
</style>
