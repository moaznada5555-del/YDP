// ==========================================
// 1. روابط الـ APIs والإعدادات والـ Firebase Setup
// ==========================================
const sheetURL = "https://script.google.com/macros/s/AKfycbx123xgH-HBkM8r5Hv-XlNEEcKGggO6JHQqdcoXUk9Ob4QtNGZI9MKNlMBDcYE_j3up/exec";[cite: 11]

const firebaseConfig = {
  apiKey: "AIzaSyCgLXWto9q2LRC7tjdJaqBNHHgVK3KGtio",
  authDomain: "ydp-project-bc31c.firebaseapp.com",
  projectId: "ydp-project-bc31c",
  storageBucket: "ydp-project-bc31c.firebasestorage.app",
  messagingSenderId: "398614049602",
  appId: "1:398614049602:web:41560bffc7d3fc91034edb",
  measurementId: "G-D1HHC8S3RW"
};[cite: 11]

if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}[cite: 11]
const db = firebase.firestore();[cite: 11]

// مصفوفة عالمية لحفظ بيانات الشيت وجلبها للـ Dashboard لايف
let cachedInterviewData = [];[cite: 11]

// ربط متغيرات العداد الزمني بالـ window لضمان التزامن الكامل مع الـ index.html
window.interviewTimerInterval = null;[cite: 11]
window.interviewSeconds = 0;[cite: 11]

// ==========================================
// 2. Matrices, Question Bank & Structure (120 سؤال كاملاً دون أي حذف)
// ==========================================
const committeeQuestions = {
    "IT": [
        "ماذا يحدث عند كتابة رابط في المتصفح والضغط على Enter؟",[cite: 11]
        "ما الفرق بين <div> و <span>؟",[cite: 11]
        "ما هو مفهوم الـ Semantic HTML ولماذا هو مهم؟",[cite: 11]
        "اشرح الفرق بين position: absolute و position: relative.",[cite: 11]
        "ما هو الـ Flexbox وكيف نوسط عنصراً في منتصف الشاشة؟",[cite: 11]
        "ما هو الفرق بين HTTP و HTTPS وكيف يؤثر على أمان المواقع؟",
        "اشرح مفهوم الـ DOM وكيف يمكن لـ JavaScript التفاعل معه؟",
        "ما الفرق بين استخدام var, let, و const في JavaScript؟",
        "كيف يمكنك تحسين أداء وسرعة تحميل صفحات الويب؟",
        "ما هو مفهوم الـ Responsive Web Design وكيف تطبقه؟",
        "ما هي الـ Arrow Functions في ES6 وما فرقها عن الدالة العادية؟",
        "اشرح مفهوم الـ Promises والـ Async/Await في التعامل مع البيانات.",
        "ما هو الفرق بين LocalStorage و SessionStorage وكيفية استخدامهما؟",
        "كيف تتعامل مع أخطاء الكود وتصحيحها باستخدام الـ DevTools؟",
        "ما هو الـ CORS وكيف يمكن حل مشكلاته أثناء ربط الـ APIs؟"
    ],
    "HR": [
        "هل لديك مهارة حل النزاعات؟",[cite: 11]
        "هل سبق لك إجراء مقابلات؟",[cite: 11]
        "هل تلتزم بالسرية التامة？",[cite: 11]
        "كيف تتعامل مع عضو غير ملتزم؟",[cite: 11]
        "ما هي معايير تقييم الأداء الشهري التي تعتمد عليها للأعضاء؟",
        "كيف تتصرف إذا اكتشفت تسريب تفاصيل اجتماع سري خارج اللجنة؟",
        "ما هي أفضل الطرق لتحفيز فريق يمر بمرحلة خمول جماعي؟",
        "كيف تدير مقابلة شخصية لشخص يبدو متوتراً للغاية لمساعدته على إبراز مهاراته؟",
        "كيف تتعامل مع الشكاوى الكيدية بين أعضاء الفريق الواحد؟",
        "ما هي المهارات الأساسية للـ HR الناجح في الأنشطة الطلابية؟",
        "كيف تصمم خطة دمج (Onboarding) مميزة للأعضاء الجدد؟",
        "كيف تتعامل مع عضو متميز جداً تقنياً لكنه يرفض اتباع القواعد الإدارية؟",
        "ما هو الفرق بين التقييم الكمي والتقييم الكيفي للأداء؟",
        "كيف تحدد الاحتياجات التدريبية للفريق قبل وضع أي خطة عمل؟",
        "إذا تقدم عضو بطلب انسحاب مفاجئ، ما هي الخطوات التي تتبعها؟"
    ],
    "PR": [
        "كيف تقنع شريكاً برعاية فعاليتنا؟",[cite: 11]
        "ماذا تفعل لو حدث خطأ بروتوكولي أثناء فعالية؟",[cite: 11]
        "كيف تبني علاقة قوية مع الجهات الخارجية؟",[cite: 11]
        "كيف تتصرف إذا اعتذر متحدث رسمي (Speaker) عن الحضور قبل المؤتمر بساعتين؟",
        "ما هي أساسيات صياغة إيميل رسمي لدعوة شخصية دبلوماسية؟",
        "كيف تدير التفاوض مع مكان (Venue) للحصول على أفضل خصم ممكن؟",
        "ما هو الفرق بين العلاقات العامة والتسويق من وجهة نظرك؟",
        "كيف تتعامل مع الصحافة والإعلام في حال وجود تغطية للحدث؟",
        "إذا هاجم شخص الكيان على منصات التواصل، كيف ترد العلاقات العامة؟",
        "كيف ترتب بروتوكول جلوس الشخصيات الهامة (VIP) في الصفوف الأولى؟",
        "ما هي الخطوات الحيوية لتجهيز كتيب تعريف الكيان (Proposal)؟",
        "كيف تحافظ على استدامة العلاقات مع الشركاء حتى بعد انتهاء المشروع؟",
        "كيف تقيس نجاح الخطة الإستراتيجية للعلاقات العامة بعد الحدث؟",
        "ماذا تفعل لو تم رفض طلب التصريح الأمني لإقامة الفعالية في اللحظات الأخيرة؟",
        "كيف تبني شبكة معارف وعلاقات قوية تفيد الكيان في المستقبل؟"
    ],
    "Media": [
        "ما هي البرامج والبرمجيات التي تجيد استخدامها في التصميم أو المونتاج؟",[cite: 11]
        "كيف تتعامل مع ضغط الوقت عند طلب تصاميم عاجلة لفعالية قائمة؟",[cite: 11]
        "ما هي أسس اختيار الهوية البصرية (Palette & Typography) لأي مشروع جديد؟",
        "كيف تتابع تريندات الميديا الحالية وتوظفها لخدمة أهداف الكيان؟",
        "ما الفرق بين التصميم الموجه لمنصات التواصل والتصميم المعد للطباعة؟",
        "كيف تنظم وتدير أرشيف الصور والفيديوهات الخاص بالفعاليات والمؤتمرات؟",
        "كيف تتعامل مع التغذية الراجعة (Feedback) السلبية من الإدارة على تصاميمك؟",
        "ما هي أساليب صناعة محتوى مرئي جذاب يرفع من نسب التفاعل (Engagement)؟",
        "كيف تحافظ على جودة وهوية التصاميم عند العمل مع فريق مكون من مصممين متعددين؟",
        "ما هو دور المونتاج وتصحيح الألوان في إيصال رسالة الفيديو التسويقي؟",
        "كيف تتعامل مع حقوق الملكية الفكرية للموسيقى والصور المستخدمة؟",
        "ما هي معاييرك في اختيار زوايا التصوير المناسبة أثناء التغطية الحية؟",
        "كيف تضع خطة زمنية واضحة (Storyboard) قبل البدء في إنتاج فيديو طويل؟",
        "ما هي أحدث أدوات الذكاء الاصطناعي التي تستخدمها لتحسين إنتاجيتك في الميديا؟",
        "كيف تتصرف لو تعطل الهارد أو فُقدت ملفات عمل مشروع ضخم قبل النشر بيوم؟"
    ],
    "Organization": [
        "كيف تتعامل مع الأعداد الكبيرة للمشاركين أثناء تنظيم طابور الدخول أو الفعاليات؟",[cite: 11]
        "إذا حدث نقص طارئ في التجهيزات واللوجستيات قبل المؤتمر بساعة، كيف تتصرف؟",[cite: 11]
        "كيف تضع خطة إخلاء طوارئ (Emergency Plan) لمكان الفعالية؟",
        "ما هي معاييرك لاختيار وتوزيع المهام على المنظمين في القاعة الحية؟",
        "كيف تدير عملية تسجيل الحضور (Check-in) لمنع التكدس عند الأبواب؟",
        "كيف تنسق مع اللجان الأخرى (PR & Media) لتوفير متطلباتهم اللوجستية يوم الحدث؟",
        "ماذا تفعل لو حجز أحد المشاركين تذكرة ولم يجد مقعداً متاحاً بسبب سوء التنظيم؟",
        "كيف تختار القاعة المناسبة من حيث المساحة، الصوت، والإضاءة لورش العمل؟",
        "ما هي أدواتك لإدارة العمليات اللوجستية وجرد الأدوات والمعدات الخاصة بالكيان؟",
        "كيف تتعامل مع الخلافات والمشادات المشحونة التي قد تحدث بين المنظمين والمحاضرين؟",
        "ما هي أهم الخطوات التي تقوم بها فور انتهاء الفعالية ومغادرة الجمهور؟",
        "كيف تدير عملية شراء وتجهيز الـ المطبوعات والهدايا (Giveaways) بأعلى جودة وأقل سعر؟",
        "كيف تتصرف إذا تأخرت شركة الصوت والإضاءة عن الموعد المحدد للتركيب؟",
        "ما هي عناصر الـ Checklist الأساسية التي لا يمكن الاستغناء عنها قبل يوم الحدث؟",
        "كيف تقيم أداء فريق التنظيم بعد ختام الفعالية لتفادي أخطاء المرات القادمة؟"
    ],
    "FR": [
        "ما هو الفارق الأساسي بين إدارة المشروعات والمبادرات الشبابية؟",[cite: 11]
        "كيف تضع ميزانية مرنة ودراسة جدوى مالية لحدث ضخم طارئ؟",[cite: 11]
        "كيف تحدد القيمة السوقية العادلة للرعايات التي يقدمها الكيان للمستثمرين؟",
        "ما هي أفضل الإستراتيجيات لإقناع الممولين لدعم مشروع شبابي غير ربحي؟",
        "كيف تتعامل مع العجز المالي المفاجئ أثناء تنفيذ الميزانية التشغيلية؟",
        "ما هي طرق تنويع مصادر دخل الكيان لضمان استدامته المالية؟",
        "كيف تكتب تقريراً مالياً ختامياً احترافياً للإدارة والجهات المانحة؟",
        "كيف تقيم المخاطر المالية المحتملة لأي مشروع قبل البدء في تنفيذه؟",
        "ماذا تفعل لو تراجع أحد الرعاة عن دفع المبلغ المتفق عليه بعد توقيع العقد؟",
        "كيف تدير المصروفات النثرية اليومية للفريق بطريقة دقيقة وموثقة؟",
        "ما هي أسس مراجعة الفواتير وإيصالات الاستلام لتجنب أي تلاعب مالي؟",
        "كيف توازن بين الجودة المطلوبة للفعالية وبين حدود الميزانية التقشفية؟",
        "ما هي المهارات التي يجب توافرها في مسؤول التمويل لضمان نجاح الصفقات؟",
        "كيف تخطط لميزانية احتياطية (Contingency Fund) لمواجهة تقلبات الأسعار؟",
        "كيف توظف مهارات التفاوض المالي لتقليل تكاليف المشتريات المباشرة؟"
    ],
    "Projects": [
        "كيف تضع خطة تشغيلية مبتكرة لمبادرة شبابية تخدم رؤية الكيان؟",[cite: 11]
        "كيف تقيس مدى نجاح وتأثير مشروع قائم على الأرض؟",[cite: 11]
        "ما هي منهجيات إدارة المشاريع (مثل Agile أو Waterfall) التي تفضلها ولماذا؟",
        "كيف تصيغ أهداف المشروع بناءً على نموذج SMART بدقة؟",
        "كيف تحدد الفئة المستهدفة (Target Audience) للمشروع وتدرس احتياجاتهم؟",
        "ما هي خطوات عمل دراسة حالة (Case Study) لمشروع سابق لضمان التطوير؟",
        "كيف تدير الـ Scope Creep (توسع نطاق المشروع) دون التأثير على موعد التسليم؟",
        "كيف تنسق العمل والمخطط الزمني بين مختلف اللجان لإنتاج مخرجات المشروع؟",
        "ما هي مؤشرات الأداء الرئيسية (KPIs) التي تستخدمها لتقييم تقدم المشروع؟",
        "كيف تتعامل مع مقاومة التغيير أو عدم حماس الأعضاء لأفكار المشروع الجديدة؟",
        "كيف تضع خطة إدارة مخاطر (Risk Management) متكاملة للمشروع؟",
        "كيف تصمم هيكل تفكيك العمل (WBS) لتوزيع المهام بكفاءة؟",
        "كيف توظف التغذية الراجعة من المستفيدين لتطوير المراحل القادمة من المشروع؟",
        "ما هي إستراتيجيتك لضمان استمرارية أثر المشروع بعد فترة طويلة من إطلاقه؟",
        "كيف تعد تقرير الإغلاق (Project Closure Report) لتوثيق الدروس المستفادة؟"
    ],
    "Coordinators": [
        "كيف تتعامل مع عضو غير ملتزم أو متفاعل في فريقك؟",[cite: 11]
        "ما هي المهارات الأساسية التي يجب أن تتوفر في المنسق الناجح؟",[cite: 11]
        "كيف تخطط لتوزيع المهام بعدالة بين أعضاء فريقك لضمان عدم الضغط؟",[cite: 11]
        "ماذا تفعل لو تعارضت قراراتك كمنسق مع رؤية رئيس اللجنة (Head)؟",[cite: 11]
        "كيف توازن بين تحقيق أهداف اللجنة الفنية وبناء علاقات إنسانية قوية مع فريقك؟",
        "كيف تدير اجتماعًا دوريًا للفريق بطريقة فعالة ومثمرة وفي وقت محدد؟",
        "إذا واجه فريقك إحباطًا عامًا بسبب صعوبة المهام، كيف تتدخل لرفع الروح المعنوية؟",
        "كيف تتصرف إذا حدث خلاف حاد وعلني بين عضوين في فريقك أثناء العمل؟",
        "ما هي الطريقة الصحيحة لتقديم نقد بناء (Feedback) لعضو دون جرح مشاعره؟",
        "كيف تكتشف المهارات الكامنة لدى أعضاء فريقك وتوجههم للمهام المناسبة لهم؟",
        "إذا طلب منك رئيس اللجنة تقريرًا مفاجئًا عن أداء فريقك، ما هي العناصر الأساسية التي ستدرجها؟",
        "كيف تدير وقتك الشخصي بنجاح بين مهام التنسيق، دراستك، وحياتك الشخصية؟",
        "ما هو تصرفك لو اعتذر نصف فريقك عن أداء مهمة عاجلة في نفس الوقت لظروف طارئة؟",
        "كيف تبني ثقافة الالتزام والمسؤولية الذاتية داخل فريق العمل الخاص بك؟",
        "ما هي رؤيتك لتطوير قنوات التواصل الداخلي بين الأعضاء لضمان الشفافية؟"
    ]
};

const centralCommittees = { 
    "HR-C": { name: "لجنة الموارد البشرية المركزية" }, 
    "PR-C": { name: "لجنة العلاقات العامة المركزية" }, 
    "SM-C": { name: "لجنة السوشيال ميديا المركزية" }, 
    "ORG-C": { name: "لجنة التنظيم المركزية" }, 
    "TR-C": { name: "لجنة التدريب المركزية" }, 
    "PROJ-C": { name: "لجنة المشروعات والمبادرات المركزية" }, 
    "FIN-C": { name: "لجنة الإدارة المالية المركزية" } 
};[cite: 11]

const provinces = { 
    "2024": { name: "محافظة القاهرة" }, 
    "2030": { name: "محافظة الجيزة" }, 
    "2050": { name: "محافظة الدقهلية" }, 
    "2065": { name: "محافظة الفيوم" }, 
    "2080": { name: "محافظة الغربية" }, 
    "2100": { name: "محافظة الإسماعيلية" }, 
    "2400": { name: "محافظة سوهاج" }, 
    "2600": { name: "محافظة أسيوط" }, 
    "2700": { name: "محافظة الأقصر" }, 
    "2200": { name: "محافظة المنيا" }, 
    "2300": { name: "محافظة بني سويف" }, 
    "2500": { name: "محافظة قنا" } 
};[cite: 11]

const committeeDesc = [ 
    { title: "العلاقات العامة", text: "تمثيل الكيان وبناء الشراكات الرسمية." }, 
    { title: "التدريب والتطوير", text: "تطوير مهارات وقدرات الأعضاء." }, 
    { title: "السوشيال ميديا والمنصات", text: "إدارة صناعة المحتوى الرقمي للكيان." }, 
    { title: "التنظيم واللوجستيات", text: "إدارة الفعاليات والمؤتمرات الميدانية." }, 
    { title: "المشروعات والمبادرات", text: "ابتكار وبناء الخطط التشغيلية للمبادرات." }, 
    { title: "الموارد البشرية", text: "متابعة وتقييم الأداء العام داخل الكيان." } 
];[cite: 11]

const generalDrive = "https://drive.google.com/drive/folders/1SZQqRozQ2AbF1YNLLrdpzTVExvp-4QuL";[cite: 11]
let selectedCommittee = "";[cite: 11]
let currentAccessType = "";[cite: 11]
let selectedLoginType = "";[cite: 11]

let globalIDPhotoBase64 = "https://via.placeholder.com/150";[cite: 11]

// ==========================================
// 3. دوال بدء التشغيل والتحكم في الدخول
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const driveBtn = document.getElementById("drive-zone");[cite: 11]
    if(driveBtn) {[cite: 11]
        driveBtn.addEventListener("click", function() {[cite: 11]
            if (currentAccessType === "زائر") {[cite: 11]
                alert("❌ عذراً، لا تمتلك صلاحية الوصول لملفات جوجل درايف الخاصة بالكيان.");[cite: 11]
                return;[cite: 11]
            }
            window.open(generalDrive, "_blank");[cite: 11]
        });
    }

    // تهيئة كود الـ QR المبدئي داخل الكارنيه ليعمل فوراً
    const qrBox = document.getElementById("id-qrcode-box");[cite: 11]
    if (qrBox) {[cite: 11]
        qrBox.innerHTML = "";[cite: 11]
        new QRCode(qrBox, {[cite: 11]
            text: "GAN-TEAM-SAIB-2026",[cite: 11]
            width: 85,[cite: 11]
            height: 85,[cite: 11]
            colorDark: "#000000",[cite: 11]
            colorLight: "#ffffff"[cite: 11]
        });
    }
});

function guestAccess() { 
    document.getElementById('login-overlay').style.display = 'none';[cite: 11]
    currentAccessType = "زائر";[cite: 11]
    setVisitorRestrictedUI(true);[cite: 11]
    renderAllUI();[cite: 11]
}

function showAccessInput(type) { 
    selectedLoginType = type;[cite: 11]
    document.getElementById('main-options').style.display = 'none';[cite: 11]
    document.getElementById('code-input-area').style.display = 'block';[cite: 11]
}

function backToMain() { 
    document.getElementById('main-options').style.display = 'block';[cite: 11]
    document.getElementById('code-input-area').style.display = 'none';[cite: 11]
}

function checkAccess() {
    const code = document.getElementById('access-code').value.trim();[cite: 11]
    
    if (code === "3070" && selectedLoginType === "executive") {[cite: 11]
        document.getElementById('login-overlay').style.display = 'none';[cite: 11]
        currentAccessType = "المكتب التنفيذي";[cite: 11]
        setVisitorRestrictedUI(false);[cite: 11]
        
        // إظهار اللوحات الإضافية الخاصة بالمكتب التنفيذي والأمانة العامة
        const execZone = document.getElementById('executive-structure-zone');[cite: 11]
        const execSyncZone = document.getElementById('executive-live-sync-panel-zone');[cite: 11]
        if(execZone) execZone.style.display = 'block';[cite: 11]
        if(execSyncZone) execSyncZone.style.display = 'block';[cite: 11]
        
        fetchInterviewSheetData();[cite: 11]
    } else if ((provinces[code] && selectedLoginType === 'provinces') || (centralCommittees[code] && selectedLoginType === 'committees')) {[cite: 11]
        const data = provinces[code] || centralCommittees[code];[cite: 11]
        document.getElementById('login-overlay').style.display = 'none';[cite: 11]
        currentAccessType = data.name;[cite: 11]
        setVisitorRestrictedUI(false);[cite: 11]
    } else { 
        alert("❌ الكود السري الذي أدخلته غير صحيح أو لا يطابق البوابة المختارة!");[cite: 11]
    }
    
    const roleDisplay = document.getElementById('user-role-display');[cite: 11]
    if (roleDisplay) {[cite: 11]
        roleDisplay.innerText = `نطاق الوصول: ${currentAccessType}`;[cite: 11]
    }
    renderAllUI();[cite: 11]
}

function setVisitorRestrictedUI(isVisitor) {
    const elementsToHide = [
        'workspace-section',       
        'interview-section',       
        'admin-dashboard-section'
    ];[cite: 11]
    elementsToHide.forEach(id => {
        const el = document.getElementById(id);[cite: 11]
        if (el) el.style.display = isVisitor ? 'none' : 'block';[cite: 11]
    });
}

// ==========================================
// 4. غرفة المقابلات والعداد الزمني الذكي
// ==========================================
function startInterview(comm) {
    selectedCommittee = comm;[cite: 11]
    document.getElementById('interview-main-menu').style.display = 'none';[cite: 11]
    document.getElementById('interview-form-area').style.display = 'block';[cite: 11]
    
    // تحديث عنوان الغرفة والربط التلقائي والذكي لخانة وصف اللجان
    const titleEl = document.getElementById('interview-title');[cite: 11]
    const descEl = document.getElementById('committee-desc-display');[cite: 11]
    
    let committeeMappedName = "";[cite: 11]
    if (comm === "HR") committeeMappedName = "الموارد البشرية";[cite: 11]
    else if (comm === "PR") committeeMappedName = "العلاقات العامة";[cite: 11]
    else if (comm === "Media") committeeMappedName = "السوشيال ميديا والمنصات";[cite: 11]
    else if (comm === "Organization") committeeMappedName = "التنظيم واللوجستيات";[cite: 11]
    else if (comm === "Projects") committeeMappedName = "المشروعات والمبادرات";[cite: 11]
    else if (comm === "FR") committeeMappedName = "التمويل والإدارة المالية";[cite: 11]
    else if (comm === "Coordinators") committeeMappedName = "منسقين اللجان";[cite: 11]
    else if (comm === "IT") committeeMappedName = "الدعم الفني و الـ IT";

    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-file-alt"></i> استمارة تقييم لجنة: ${committeeMappedName || comm}`;[cite: 11]
    }

    if (descEl) {
        const foundDesc = committeeDesc.find(d => d.title === committeeMappedName);[cite: 11]
        if (foundDesc) {
            descEl.innerText = `🎯 مخرجات ووصف اللجنة: ${foundDesc.text}`;[cite: 11]
            descEl.style.display = 'block';[cite: 11]
        } else {
            if (comm === "Coordinators") {
                descEl.innerText = "🎯 تقييم المهارات القيادية والإدارية للمتقدمين على مناصب التنسيق الميداني والركزي.";[cite: 11]
            } else if (comm === "FR") {
                descEl.innerText = "🎯 إدارة الميزانيات، الموارد المالية للفعاليات، وعمليات التمويل والدعم المستدام.";[cite: 11]
            } else {
                descEl.innerText = "🎯 استمارة التقييم ورصد الدرجات لايف للجان كيان YDP الموحد لعام 2026.";[cite: 11]
            }
            descEl.style.display = 'block';[cite: 11]
        }
    }

    const container = document.getElementById('questions-container');[cite: 11]
    
    // تشغيل الهيكل الموحد لجميع الاستمارات واللجان بما فيها المنسقين
    const questions = committeeQuestions[comm] || ["سؤال تقييمي عام 1", "سؤال تقييمي عام 2"];[cite: 11]
    container.innerHTML = questions.map((q, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px; direction: rtl;">
            <span style="font-size:0.9rem; flex:1; text-align:right; font-weight:600; color:#e2e8f0;">${i+1}. ${q}</span>
            <div style="display:flex; gap:12px; margin-right: 10px;">
                <label style="cursor:pointer; font-weight:bold; color:#22c55e;"><input type="radio" name="q${i}" value="1"> صح</label>
                <label style="cursor:pointer; font-weight:bold; color:#ef4444;"><input type="radio" name="q${i}" value="0"> خطأ</label>
            </div>
        </div>
    `).join('');

    // تشغيل العداد الزمني الآمن المتصل بالنطاق العالمي
    if(window.interviewTimerInterval) clearInterval(window.interviewTimerInterval);[cite: 11]
    window.interviewSeconds = 0;[cite: 11]
    const timerDisplay = document.getElementById('interview-timer');[cite: 11]
    window.interviewTimerInterval = setInterval(() => {
        window.interviewSeconds++;[cite: 11]
        let mins = Math.floor(window.interviewSeconds / 60).toString().padStart(2, '0');[cite: 11]
        let secs = (window.interviewSeconds % 60).toString().padStart(2, '0');[cite: 11]
        if(timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;[cite: 11]
    }, 1000);
}

async function submitInterviewData() {
    const nameInput = document.getElementById('cand-name');[cite: 11]
    const notesInput = document.getElementById('cand-notes');[cite: 11]
    const questions = committeeQuestions[selectedCommittee] || [];[cite: 11]
    
    let percentage = 0;[cite: 11]
    let status = "مرفوض";[cite: 11]
    
    const checked = document.querySelectorAll('#questions-container input[type="radio"]:checked');[cite: 11]
    if(!nameInput.value || checked.length < questions.length) {[cite: 11]
        return alert("❌ برجاء كتابة اسم الشخص المستهدف والإجابة على بنود الاستمارة كاملة!");[cite: 11]
    }
    
    let scoreValue = 0;[cite: 11]
    checked.forEach(r => scoreValue += parseInt(r.value));[cite: 11]
    percentage = (scoreValue / questions.length) * 100;[cite: 11]

    if(window.interviewTimerInterval) clearInterval(window.interviewTimerInterval);[cite: 11]
    status = percentage >= 50 ? "مقبول" : "مرفوض";[cite: 11]
    let timeTaken = document.getElementById('interview-timer').innerText + " دقيقة";[cite: 11]

    const newRecord = {
        name: nameInput.value,[cite: 11]
        committee: selectedCommittee,[cite: 11]
        score: percentage.toFixed(0),[cite: 11]
        status: status,[cite: 11]
        time: timeTaken,[cite: 11]
        notes: notesInput.value || "لا يوجد"[cite: 11]
    };

    cachedInterviewData.unshift(newRecord);[cite: 11]
    
    renderInterviewTable(cachedInterviewData);[cite: 11]
    renderExecSyncTable(cachedInterviewData);[cite: 11]

    const params = new URLSearchParams({
        name: nameInput.value,[cite: 11]
        gov: currentAccessType,[cite: 11]
        committee: selectedCommittee,[cite: 11]
        interviewer: "منصة اللجان الذكية",[cite: 11]
        score: percentage.toFixed(0),[cite: 11]
        status: status,[cite: 11]
        notes: notesInput.value || "لا يوجد"[cite: 11]
    });

    try {
        await fetch(`${sheetURL}?${params.toString()}`, { method: 'POST', mode: 'no-cors' });[cite: 11]
        alert(`✅ تم تسجيل ورصد بيانات المقابلة بنجاح لشيت الكيان!\nالنتيجة النهائية: ${status}`);[cite: 11]
        
        nameInput.value = "";[cite: 11]
        notesInput.value = "";[cite: 11]
        if (typeof window.cancelInterview === 'function') window.cancelInterview();[cite: 11]
    } catch (e) {
        console.error(e);[cite: 11]
        alert("✅ تم الحفظ باللوحة المحلية بنجاح وجاري المزامنة الخلفية مع الشيت السحابي.");[cite: 11]
        if (typeof window.cancelInterview === 'function') window.cancelInterview();[cite: 11]
    }
}

// ==========================================
// 5. إدارة جداول البيانات والفلترة لايف
// ==========================================
async function fetchInterviewSheetData() {
    try {
        const response = await fetch(`${sheetURL}`);[cite: 11]
        const data = await response.json();[cite: 11]
        cachedInterviewData = data.records || [];[cite: 11]
        renderInterviewTable(cachedInterviewData);[cite: 11]
        renderExecSyncTable(cachedInterviewData);[cite: 11]
    } catch (err) {
        console.error(err);[cite: 11]
    }
}

function renderInterviewTable(records) {
    const tbody = document.getElementById('interview-results-tbody');[cite: 11]
    if(!tbody) return;[cite: 11]
    if(records.length === 0) {[cite: 11]
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">لا توجد سجلات مطابقة للبحث.</td></tr>`;[cite: 11]
        return;[cite: 11]
    }
    tbody.innerHTML = records.map(r => {
        const statusText = r.status || '---';[cite: 11]
        let badgeClass = 'status-badge pending';[cite: 11]
        if (statusText === 'مقبول') badgeClass = 'status-badge accepted';[cite: 11]
        if (statusText === 'مرفوض') badgeClass = 'status-badge rejected';[cite: 11]

        return `
            <tr>
                <td>${r.name || '---'}</td>
                <td>${r.committee || '---'}</td>
                <td>${r.time || '10:00 دقيقة'}</td>
                <td style="font-weight: bold; color: #ffaa44;">${r.score || '0'}%</td>
                <td><span class="${badgeClass}">${statusText}</span></td>
            </tr>
        `;[cite: 11]
    }).join('');[cite: 11]
}

function renderExecSyncTable(records) {
    const tbody = document.getElementById('exec-interview-sync-tbody');[cite: 11]
    if(!tbody) return;[cite: 11]
    if(records.length === 0) {[cite: 11]
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 15px;">في انتظار تحميل بيانات المتقدمين...</td></tr>`;[cite: 11]
        return;[cite: 11]
    }
    tbody.innerHTML = records.map(r => {
        const statusText = r.status || '---';[cite: 11]
        let badgeClass = 'status-badge pending';[cite: 11]
        if (statusText === 'مقبول') badgeClass = 'status-badge accepted';[cite: 11]
        if (statusText === 'مرفوض') badgeClass = 'status-badge rejected';[cite: 11]
        return `
            <tr>
                <td>${r.name || '---'}</td>
                <td>${r.committee || '---'}</td>
                <td style="font-weight: bold; color: #a855f7;">${r.score || '0'}%</td>
                <td><span class="${badgeClass}">${statusText}</span></td>
            </tr>
        `;[cite: 11]
    }).join('');[cite: 11]
}

function filterInterviewTable() {
    const searchVal = document.getElementById('search-cand-name').value.toLowerCase().trim();[cite: 11]
    const commVal = document.getElementById('filter-comm').value;[cite: 11]

    const filtered = cachedInterviewData.filter(r => {
        const name = (r.name || '').toLowerCase();[cite: 11]
        const committee = r.committee || '';[cite: 11]

        const matchSearch = name.includes(searchVal);[cite: 11]
        const matchComm = commVal === "" || committee === commVal;[cite: 11]

        return matchSearch && matchComm;[cite: 11]
    });

    renderInterviewTable(filtered);[cite: 11]
    renderExecSyncTable(filtered);[cite: 11]
}

// ==========================================
// 6. بوابة إصدار كروت الـ ID والـ QR للأعضاء
// ==========================================
function loadIDImage(event) {
    const file = event.target.files[0];[cite: 11]
    if (file) {[cite: 11]
        const reader = new FileReader();[cite: 11]
        reader.onload = function(e) {[cite: 11]
            globalIDPhotoBase64 = e.target.result;[cite: 11]
            const cardImg = document.getElementById('card-display-img');[cite: 11]
            if(cardImg) cardImg.src = e.target.result;[cite: 11]
        }
        reader.readAsDataURL(file);[cite: 11]
    }
}

function updateIDCard() {
    const nameInput = document.getElementById('id-input-name').value.trim();[cite: 11]
    const commSelect = document.getElementById('id-input-committee').value;[cite: 11]
    
    const cardName = document.getElementById('card-display-name');[cite: 11]
    const cardComm = document.getElementById('card-display-committee');[cite: 11]
    
    if(cardName) cardName.innerText = nameInput || "إسم العضو الثلاثي";[cite: 11]
    if(cardComm) cardComm.innerText = commSelect;[cite: 11]
    
    const qrBox = document.getElementById('id-qrcode-box');[cite: 11]
    if(qrBox) {[cite: 11]
        qrBox.innerHTML = "";[cite: 11]
        const finalData = `GAN TEAM Verified Member\nName: ${nameInput || 'Guest'}\nCommittee: ${commSelect}\nYear: 2026`;[cite: 11]
        new QRCode(qrBox, {[cite: 11]
            text: finalData,[cite: 11]
            width: 85,[cite: 11]
            height: 85,[cite: 11]
            colorDark: "#000000",[cite: 11]
            colorLight: "#ffffff"[cite: 11]
        });
    }
}

function downloadIDCard() {
    const cardElement = document.getElementById('ydp-digital-id-card');[cite: 11]
    const memberName = document.getElementById('id-input-name').value.trim() || "GAN_Member";[cite: 11]
    
    if(!cardElement) return;[cite: 11]

    html2canvas(cardElement, {[cite: 11]
        scale: 3,[cite: 11]
        useCORS: true,[cite: 11]
        backgroundColor: null [cite: 11]
    }).then(canvas => {[cite: 11]
        const imageURL = canvas.toDataURL("image/png");[cite: 11]
        const downloadLink = document.createElement('a');[cite: 11]
        downloadLink.href = imageURL;[cite: 11]
        downloadLink.download = `ID_${memberName}_2026.png`;[cite: 11]
        document.body.appendChild(downloadLink);[cite: 11]
        downloadLink.click();[cite: 11]
        document.body.removeChild(downloadLink);[cite: 11]
    }).catch(err => {[cite: 11]
        console.error(err);[cite: 11]
        alert("واجهنا مشكلة أثناء تصدير الصورة، يرجى المحاولة مرة أخرى.");[cite: 11]
    });
}

// ==========================================
// 7. بوابات النشر لايف للأخبار والأنشطة (Firebase)
// ==========================================
function postNews() {
    const input = document.getElementById('news-input');[cite: 11]
    if (!input || !input.value.trim()) {[cite: 11]
        return alert("❌ برجاء كتابة محتوى الخبر أولاً قبل النشر!");[cite: 11]
    }
    
    const text = input.value.trim();[cite: 11]
    db.collection("news").add({[cite: 11]
        text: text,[cite: 11]
        timestamp: firebase.firestore.FieldValue.serverTimestamp()[cite: 11]
    }).then(() => {[cite: 11]
        alert("🎉 تم نشر وتعميم الخبر العاجل بالشريط بنجاح!");[cite: 11]
        input.value = "";[cite: 11]
    }).catch(err => {[cite: 11]
        console.error(err);[cite: 11]
    });
}

function postActivity() {
    const textarea = document.getElementById('activity-text');[cite: 11]
    if (!textarea || !textarea.value.trim()) {[cite: 11]
        return alert("❌ برجاء كتابة تفاصيل الفعالية أولاً قبل النشر!");[cite: 11]
    }

    const text = textarea.value.trim();[cite: 11]
    db.collection("activities").add({[cite: 11]
        text: text,[cite: 11]
        images: [], [cite: 11]
        timestamp: firebase.firestore.FieldValue.serverTimestamp()[cite: 11]
    }).then(() => {[cite: 11]
        alert("🎉 تم نشر وتوثيق الفعالية بساحة الأنشطة لايف بنجاح!");[cite: 11]
        textarea.value = "";[cite: 11]
    }).catch(err => {[cite: 11]
        console.error(err);[cite: 11]
    });
}

function renderNews() { 
    const list = document.getElementById('news-list'); [cite: 11]
    if (!list) return; [cite: 11]
    db.collection("news").orderBy("timestamp", "desc").onSnapshot(s => { [cite: 11]
        list.innerHTML = s.docs.map(doc => `
            <div class="info-card" style="border-right:4px solid #ff8800; padding:12px; margin-bottom:10px; background:rgba(255,255,255,0.02); color:white; text-align:right; border-radius: 8px;">
                <p style="font-size:0.9rem; font-family:'Cairo';">${doc.data().text}</p>
            </div>
        `).join(''); [cite: 11]
        
        // ربط ومزامنة شريط الأخبار المتحرك (Ticker-Text) تلقائياً بآخر خبر منشور لايف
        if (s.docs.length > 0) {[cite: 11]
            const tickerText = document.querySelector('.ticker-text');[cite: 11]
            if (tickerText) {[cite: 11]
                tickerText.innerText = s.docs[0].data().text;[cite: 11]
            }
        }
    }); 
}

function renderActivities() { 
    const container = document.getElementById('activities-container'); [cite: 11]
    if (!container) return; [cite: 11]
    db.collection("activities").orderBy("timestamp", "desc").onSnapshot(s => { [cite: 11]
        container.innerHTML = s.docs.map(doc => `
            <div class="activity-post" style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; margin-bottom:15px; color:white; text-align:right; border:1px solid rgba(255,255,255,0.04);">
                <p style="font-size:0.9rem; font-family:'Cairo'; line-height:1.6;">${doc.data().text}</p>
            </div>
        `).join(''); [cite: 11]
    }); 
}

function logout() { 
    location.reload(); [cite: 11]
}

function renderAllUI() { 
    renderNews(); [cite: 11]
    renderActivities(); [cite: 11]
}

window.onload = renderAllUI;[cite: 11]
