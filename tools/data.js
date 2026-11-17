// Site content (real copy of the current site). Content is frozen for the redesign: do not invent facts.
const SITE = 'https://codelady-ship.github.io/net-pro-group-fiqma/';
const EMAIL = 'info@netprogroup.example';
const PHONE1 = '+994 12 000 00 00', PHONE1_TEL = '+994120000000';
const PHONE2 = '+994 50 000 00 00', PHONE2_TEL = '+994500000000';
const ADDRESS = 'Nümunə küçəsi 1, Bakı, Azərbaycan';

const CATS = [
  { file: 'mehsullar-1.html', name: 'Fasiləsiz enerji mənbələri (UPS)', short: 'UPS sistemləri',
    intro: 'Server otaqları, ofislər və data mərkəzləri üçün fasiləsiz enerji mənbələri. Elektrik kəsiləndə avadanlıq işləməyə davam edir, gərginlik dalğalanmalarından qorunur və məlumat itkisi yaranmır.',
    items: [
      ['liebert-exm2', 'Liebert® EXM2 UPS', 'Orta ölçülü kritik sistemlər üçün monoblok UPS. Yüksək səmərəlilik, kompakt ölçü və asan texniki xidmət.', 'İki qara şkaf tipli UPS bloku'],
      ['edge-li-ion', 'Vertiv™ Edge Lithium-Ion UPS, 1500–3000 VA', 'Litium-ion batareyalı line-interactive UPS. Server və şəbəkə avadanlığını qısa kəsintilərdə ehtiyat enerji ilə təmin edir.', 'Rack tipli nazik qara UPS'],
      ['liebert-gxt5', 'Liebert® GXT5 UPS, 750 VA – 20 kVA', 'Online ikiqat çevirmə texnologiyası ilə davamlı enerji keyfiyyəti. Rack və ya qüllə şəklində quraşdırılır.', 'Üst-üstə qoyulmuş iki rack tipli UPS'],
      ['trinergy-cube', 'Liebert® Trinergy™ Cube, 150 kW – 3.4 MW', 'Böyük data mərkəzləri üçün modul tipli UPS. Tələbat artdıqca gücü mərhələli şəkildə artırmaq mümkündür.', 'Geniş qara modul tipli UPS sistemi'],
      ['gxt-rt', 'Liebert® GXT RT+ UPS', 'Bir fazalı, 0.9 güc əmsallı UPS. Geniş giriş gərginliyi diapazonunda qoşulmuş cihazları qoruyur.', 'Qüllə və rack tipli iki UPS bloku'],
    ] },
  { file: 'mehsullar-2.html', name: 'DC enerji sistemləri', short: 'DC enerji',
    intro: 'Telekom qovşaqları və data mərkəzləri üçün etibarlı, genişlənə bilən 48 V DC enerji sistemləri. Rektifikator modulları işləyə-işləyə dəyişdirilə bilir.',
    items: [
      ['kabinet', '48 V DC enerji şkafı', 'Rektifikatorlar, batareya qrupları və paylayıcı panel bir şkafda. Telekom və şəbəkə qovşaqları üçün uyğundur.', 'Qara rəngli böyük enerji şkafı'],
      ['gxt-rt', 'Kompakt rack tipli DC modul', '19 düymlük rack-a quraşdırılan kompakt DC enerji modulu. Kiçik server otaqları üçün nəzərdə tutulub.', 'Qüllə və rack tipli enerji blokları'],
    ] },
  { file: 'mehsullar-3.html', name: 'Enerji paylanması', short: 'Paylanma',
    intro: 'Rack və şkaflar daxilində enerjinin təhlükəsiz paylanması üçün PDU-lar və paylayıcı panellər. Hər çıxışın yükünü izləmək mümkündür.',
    items: [
      ['edge-li-ion', 'Ağıllı rack PDU', 'Hər rozetka üzrə enerji sərfiyyatını göstərən və uzaqdan idarə olunan paylayıcı blok.', 'Rack tipli nazik qara cihaz'],
      ['liebert-gxt5', 'Modul tipli paylayıcı panel', 'Server otağı üçün avtomatik açarlı, genişlənə bilən paylayıcı panel.', 'Üst-üstə qoyulmuş iki rack tipli cihaz'],
      ['kabinet', 'Mərtəbə tipli paylayıcı şkaf', 'Data mərkəzində sıralar üzrə enerji paylanması üçün mərkəzi şkaf.', 'Qara rəngli böyük şkaf'],
    ] },
  { file: 'mehsullar-4.html', name: 'Sənaye AC və DC sistemləri', short: 'Sənaye sistemləri',
    intro: 'Neft-qaz, energetika və istehsal obyektləri üçün ağır iş şəraitinə davamlı AC və DC enerji sistemləri.',
    items: [
      ['liebert-exm2', 'Sənaye tipli UPS sistemi', 'Toz, rütubət və yüksək temperaturda işləmək üçün gücləndirilmiş korpuslu UPS.', 'İki qara şkaf tipli enerji bloku'],
    ] },
  { file: 'mehsullar-5.html', name: 'Statik ötürmə açarları', short: 'Ötürmə açarları',
    intro: 'İki müstəqil enerji mənbəyi arasında millisaniyələr ərzində avtomatik keçid. Bir mənbə sıradan çıxsa, yük kəsintisiz digərinə ötürülür.',
    items: [
      ['edge-li-ion', 'Rack tipli statik ötürmə açarı', 'Bir girişli serverləri iki enerji mənbəyinə qoşmaq üçün 1U ölçülü açar.', 'Rack tipli nazik qara cihaz'],
      ['liebert-gxt5', 'Orta güclü ötürmə açarı', 'Server otağının bütöv sırasını qorumaq üçün statik ötürmə açarı.', 'Üst-üstə qoyulmuş iki rack tipli cihaz'],
      ['trinergy-cube', 'Mərkəzi statik ötürmə sistemi', 'Data mərkəzi səviyyəsində yüksək güclü yüklər üçün mərkəzi açar sistemi.', 'Geniş qara modul tipli sistem'],
      ['kabinet', 'Şkaf tipli ötürmə həlli', 'Paylayıcı panel və ötürmə açarı bir şkafda birləşdirilmiş hazır həll.', 'Qara rəngli böyük şkaf'],
    ] },
  { file: 'mehsullar-6.html', name: 'Enerji idarəetməsi və monitorinq', short: 'Monitorinq',
    intro: 'UPS, PDU və iqlim avadanlığının vəziyyətini bir paneldən izləmək üçün kartlar, sensorlar və proqram təminatı. Problem yarananda dərhal bildiriş alırsınız.',
    items: [
      ['gxt-rt', 'Şəbəkə monitorinq kartı', 'UPS-i yerli şəbəkəyə qoşur, veb interfeys və SNMP ilə vəziyyəti göstərir.', 'Qüllə və rack tipli enerji blokları'],
      ['kabinet', 'Temperatur və rütubət sensorları', 'Server şkaflarında iqlim şəraitini izləyir və həddi aşanda xəbərdarlıq edir.', 'Qara rəngli böyük şkaf'],
      ['trinergy-cube', 'Mərkəzi monitorinq proqramı', 'Bütün enerji avadanlığını bir paneldə göstərən, hesabat hazırlayan proqram.', 'Geniş qara modul tipli sistem'],
    ] },
];

const SERVICES = [
  ['qurasdirma', 'Avadanlıqların quraşdırılması və konfiqurasiyası', 'Server, şəbəkə və enerji avadanlığını layihəyə uyğun quraşdırır, sazlayır və sənədləşdiririk.', 'Texnik server şkafında avadanlıq quraşdırır'],
  ['tehlukesizlik', 'Təhlükəsizlik xidmətləri', 'Firewall, VPN və giriş nəzarəti qururuq, şəbəkəni müntəzəm yoxlayır və zəiflikləri aradan qaldırırıq.', 'Mütəxəssislər monitorlarda kodu nəzərdən keçirir'],
  ['helpdesk', 'Helpdesk xidmətləri', 'İş saatlarında telefon və e-poçt vasitəsilə istifadəçilərə texniki dəstək göstəririk.', 'Qulaqlıqlı dəstək mütəxəssisi kompüter arxasında'],
  ['it', 'İT xidmətləri', 'Ofis şəbəkəsi, serverlər, e-poçt və ehtiyat nüsxələmə sistemlərinin tam idarə olunması.', 'İki mühəndis server otağında kabelləri yoxlayır'],
  ['temir', 'Ofis avadanlıqlarının təmiri və texniki xidməti', 'Kompüter, printer və şəbəkə avadanlığının diaqnostikası, təmiri və profilaktik baxışı.', 'Noutbukun içərisində təmir işləri'],
  ['yenilenme', 'Avadanlıqların vaxtında yenilənməsi', 'Köhnəlmiş avadanlığı planlı şəkildə dəyişir, məlumatları itkisiz yeni sistemə köçürürük.', 'Komanda noutbuklar arxasında planlama aparır'],
  ['nezaret', 'Daimi nəzarət', 'Serverlər, UPS və şəbəkə 24/7 monitorinq olunur; problem yaranan kimi bildiriş alır və reaksiya veririk.', 'Operator monitorinq ekranı qarşısında'],
];

const NAV = [
  ['index.html', 'Əsas səhifə'],
  ['haqqimizda.html', 'Haqqımızda'],
  ['mehsullar-1.html', 'Məhsullar', true],
  ['xidmetler.html', 'Xidmətlər və həllər'],
  ['qalereya.html', 'Qalereya'],
  ['elaqe.html', 'Əlaqə'],
];

// Home page content
const slides = [
  ['Avadanlıqların quraşdırılması və konfiqurasiyası', 'Server otağından ofis şəbəkəsinə qədər — layihə, quraşdırma və sazlama.', 'xidmetler.html'],
  ['Fasiləsiz enerji həlləri', 'UPS, DC enerji sistemləri və enerji paylanması ilə işiniz dayanmır.', 'mehsullar-1.html'],
  ['İT infrastrukturuna daimi nəzarət', 'Serverləri, UPS-i və şəbəkəni 24/7 izləyir, problemi erkən tapırıq.', 'xidmetler.html#nezaret'],
];
const prodSlides = [
  ['slide-1', 'Enerji idarəetməsi və monitorinq', 'Bütün enerji avadanlığını bir paneldən izləyin.', 'mehsullar-6.html', 'Operator idarəetmə panelində işləyir'],
  ['slide-2', 'DC enerji sistemləri', 'Telekom və data mərkəzləri üçün etibarlı, genişlənə bilən DC enerji həlləri.', 'mehsullar-2.html', 'Sarı kabel kanalları olan enerji otağı'],
  ['slide-3', 'Enerji paylanması', 'Rack və şkaflar daxilində enerjinin təhlükəsiz paylanması.', 'mehsullar-3.html', 'Server şkafları sırası'],
];
const gallery = [
  ['1', 'Data mərkəzində sıra şəklində yerləşdirilmiş şkaflar, illüstrasiya'],
  ['2', 'Qaldırılmış döşəmə üzərində UPS və batareya şkafları'],
  ['3', 'Bina damında sənaye soyutma qurğusu'],
  ['4', 'Soyutma sistemi olan avadanlıq otağı, illüstrasiya'],
  ['5', 'Hündür qara server şkafı'],
];
const partners = ['vertiv', 'autotrox', 'delta', 'dealom', 'glossel', 'guardan'];
const brands = [['makelsan', 'Makelsan', 189, 26], ['vertiv', 'Vertiv', 153, 38], ['long', 'Long', 155, 38]];

// Business hours (shown in the footer)
const HOURS = 'B.e. – Cümə: 09:00 – 18:00';

// FAQ: every answer restates facts already on the site. Rendered visibly on elaqe.html (tools/pages/contact.js)
// and mirrored as FAQPage JSON-LD (tools/lib/seo.js). Keep both in sync by using only this array.
const FAQ = [
  ['Net Pro Group hansı xidmətləri göstərir?', 'Avadanlıqların quraşdırılması və konfiqurasiyası, təhlükəsizlik xidmətləri, helpdesk, İT xidmətləri, ofis avadanlıqlarının təmiri və texniki xidməti, avadanlıqların vaxtında yenilənməsi və daimi (24/7) nəzarət.'],
  ['Hansı məhsul qruplarını təklif edirsiniz?', 'Fasiləsiz enerji mənbələri (UPS), DC enerji sistemləri, enerji paylanması, sənaye AC və DC sistemləri, statik ötürmə açarları, enerji idarəetməsi və monitorinq.'],
  ['Məhsul broşürünü necə əldə edə bilərəm?', 'Məhsulun yanındakı “Broşür sorğusu” düyməsini basın: əlaqə forması məhsulun adı ilə dolur. Sorğunu göndərin, cavabı e-poçtla alacaqsınız.'],
  ['Sorğu göndərdikdən sonra nə baş verir?', 'Mesajınız qəbul edilir və ekranda NPG-XXXXXX formatında sorğu nömrəsi göstərilir. Server əlçatan olmadıqda forma e-poçt proqramınızı hazır mesajla açır.'],
  ['Daimi nəzarət necə işləyir?', 'Serverlər, UPS və şəbəkə 24/7 monitorinq olunur; problem yaranan kimi bildiriş alır və reaksiya veririk.'],
  ['İş saatlarınız necədir?', 'Bazar ertəsi – Cümə: 09:00 – 18:00.'],
];

// Home hero time-lapse video (owner request, 2026-11-17). The clip is generated separately and committed to
// assets/media/. Keep ready:false until both the MP4 and the poster (= the clip's final frame) exist – while false
// the hero shows the current design with existing repo images only (no placeholder). The build fails if ready:true
// and a file is missing. webm is optional (set to '' if there is none).
const HERO_VIDEO = {
  ready: false,
  mp4: 'assets/media/hero-build.mp4',
  webm: '',
  poster: 'assets/media/hero-build-poster.jpg',
  width: 1920, height: 1080,
  caption: 'AI ilə yaradılmış video',
  label: 'Boş server otağında rack-lərin, kabel kanallarının, kommutatorların və serverlərin quraşdırılmasını göstərən timelapse video',
};

module.exports = { HERO_VIDEO, HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands };
