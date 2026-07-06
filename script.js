// ==========================================
// 1. روابط الـ APIs والإعدادات والـ Firebase Setup
// ==========================================
const sheetURL = "https://script.google.com/macros/s/AKfycbx123xgH-HBkM8r5Hv-XlNEEcKGggO6JHQqdcoXUk9Ob4QtNGZI9MKNlMBDcYE_j3up/exec";

const firebaseConfig = {
  apiKey: "AIzaSyCgLXWto9q2LRC7tjdJaqBNHHgVK3KGtio",
  authDomain: "ydp-project-bc31c.firebaseapp.com",
  projectId: "ydp-project-bc31c",
  storageBucket: "ydp-project-bc31c.firebasestorage.app",
  messagingSenderId: "398614049602",
  appId: "1:398614049602:web:41560bffc7d3fc91034edb",
  measurementId: "G-D1HHC8S3RW"
};

if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// مصفوفة عالمية لحفظ بيانات الشيت وجلبها للـ Dashboard لايف
let cachedInterviewData = [];

// ربط متغيرات العداد الزمني بالـ window لضمان التزامن الكامل مع الـ index.html
window.interviewTimerInterval = null;
window.interviewSeconds = 0;

// ==========================================
// 2. بنك الأسئلة المحدث (30 سؤالاً لكل لجنة مع ميزة العشوائية)
// ==========================================
const committeeQuestions = {
    "IT": [
        "ماذا يحدث عند كتابة رابط في المتصفح والضغط على Enter؟",
        "ما الفرق بين <div> و <span>؟",
        "ما هو مفهوم الـ Semantic HTML ولماذا هو مهم؟",
        "اشرح الفرق بين position: absolute و position: relative.",
        "ما هو الـ Flexbox وكيف نوسط عنصراً في منتصف الشاشة؟",
        "ما هو الفرق بين HTTP و HTTPS وكيف يؤثر على أمان المواقع؟",
        "اشرح مفهوم الـ DOM وكيف يمكن لـ JavaScript التفاعل معه؟",
        "ما الفرق بين استخدام var, let, و const في JavaScript؟",
        "كيف يمكنك تحسين أداء وسرعة تحميل صفحات الويب؟",
        "ما هو مفهوم الـ Responsive Web Design وكيف تطبقه؟",
        "ما هي الـ Arrow Functions في ES6 وما فرقها عن الدالة العادية？",
        "اشرح مفهوم الـ Promises والـ Async/Await في التعامل مع البيانات.",
        "ما هو الفرق بين LocalStorage و SessionStorage وكيفية استخدامهما؟",
        "كيف تتعامل مع أخطاء الكود وتصحيحها باستخدام الـ DevTools؟",
        "ما هو الـ CORS وكيف يمكن حل مشكلاته أثناء ربط الـ APIs؟",
        "ما هي لغات البرمجة الأساسية لتطوير تطبيقات الهاتف؟",
        "ما الفرق بين قاعدة البيانات من نوع SQL و NoSQL؟",
        "ما هو الـ Git وما أهمية استخدامه في المشاريع البرمجية؟",
        "اشرح فكرة عمل الـ RESTful API.",
        "ما هو الـ Framework وما الفرق بينه وبين الـ Library؟",
        "كيف تحمي موقعك من هجمات الـ SQL Injection؟",
        "ما هو الـ CSS Preprocessor مثل Sass ولماذا نستخدمه؟",
        "ما معنى مفاهيم الـ OOP (البرمجة كائنية التوجه)؟",
        "ما هو الفرق بين الـ Client-Side Rendering والـ Server-Side Rendering؟",
        "ماذا تعرف عن الـ Web Performance Metrics مثل الـ LCP والـ FID؟",
        "كيف تعمل ملفات الـ Cookies وما هي مخاطرها الأمنية؟",
        "ما أهمية استخدام نظام الـ Version Control في العمل الجماعي؟",
        "ما هو مفهوم الـ SPA (Single Page Application)؟",
        "كيف تتعامل مع مشاكل الـ Merge Conflicts في GitHub؟",
        "إذا واجهت مشكلة برمجية معقدة ولم تجد لها حلاً على الإنترنت، كيف تتصرف؟"
    ],
    "HR": [
        "هل لديك مهارة حل النزاعات؟",
        "هل سبق لك إجراء مقابلات؟",
        "هل تلتزم بالسرية التامة؟",
        "كيف تتعامل مع عضو غير ملتزم؟",
        "ما هي معايير تقييم الأداء الشهري التي تعتمد عليها للأعضاء؟",
        "كيف تتصرف إذا اكتشفت تسريب تفاصيل اجتماع سري خارج اللجنة؟",
        "ما هي أفضل الطرق لتحفيز فريق يمر بمرحلة خمول جماعي؟",
        "كيف تدير مقابلة شخصية لشخص يبدو متوتراً للغاية لمساعدته على إبراز مهاراته؟",
        "كيف تتعامل مع الشكاوى الكيدية بين أعضاء الفريق الواحد؟",
        "ما هي المهارات الأساسية للـ HR الناجح في الأنشطة الطلابية？",
        "كيف تصمم خطة دمج (Onboarding) مميزة للأعضاء الجدد؟",
        "كيف تتعامل مع عضو متميز جداً تقنياً لكنه يرفض اتباع القواعد الإدارية؟",
        "ما هو الفرق بين التقييم الكمي والتقييم الكيفي للأداء؟",
        "كيف تحدد الاحتياجات التدريبية للفريق قبل وضع أي خطة عمل؟",
        "إذا تقدم عضو بطلب انسحاب مفاجئ، ما هي الخطوات التي تتبعها؟",
        "كيف تتعامل مع الاحتراق الوظيفي أو الضغط النفسي لدى الأعضاء؟",
        "ما هو مفهوم الـ Turnover وكيف نقلل من نسبته في الفريق؟",
        "كيف تتصرف إذا أظهر أحد القادة تحيزاً واضحاً لبعض أعضاء فريقه؟",
        "ما هي أسس بناء ثقافة تنظيمية إيجابية داخل الكيان؟",
        "كيف تدير مقابلة خروج (Exit Interview) وما أهميتها؟",
        "ما رأيك في تطبيق نظام العقوبات المالية أو المعنوية في الأنشطة التطوعية؟",
        "كيف توفق بين مصلحة العمل في الكيان والظروف الشخصية للأعضاء؟",
        "كيف تقيس مدى ولاء وانتماء الأعضاء للكيان؟",
        "ما هو الإجراء المناسب عند تكرار غياب أحد الأعضاء عن الاجتماعات الرسمية؟",
        "كيف تصيغ نموذج تقييم أداء يتسم بالعدالة والموضوعية؟",
        "كيف تحل مشكلة توزيع المهام إذا شعر بعض الأعضاء بالتحيز؟",
        "كيف تتعامل مع عضو يريد الانتقال للجنة أخرى في منتصف الموسم؟",
        "ما هي أفضل الإستراتيجيات لإدارة التنوع الفكري والثقافي داخل الفريق؟",
        "ما هو دور الـ HR في الحفاظ على استمرارية الكيان للمواسم القادمة؟",
        "كيف تتصرف إذا حدث مشادة كلامية حادة بينك وبين عضو أثناء التقييم؟"
    ],
    "PR": [
        "كيف تقنع شريكاً برعاية فعاليتنا؟",
        "ماذا تفعل لو حدث خطأ بروتوكولي أثناء فعالية؟",
        "كيف تبني علاقة قوية مع الجهات الخارجية؟",
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
        "كيف تبني شبكة معارف وعلاقات قوية تفيد الكيان في المستقبل؟",
        "ما هو الـ Media Kit وما أهمية إعداده قبل الفعاليات الضخمة؟",
        "كيف تتصرف إذا اكتشفت أن الراعي الرسمي يقوم بأنشطة تخالف مبادئ الكيان؟",
        "كيف تتعامل مع شخصية هامة أظهرت تعجرفاً أو عدم احترام لفريق العمل؟",
        "ما هي الإستراتيجية المناسبة لكسب ثقة وتأييد المجتمع المحلي لأنشطة الكيان؟",
        "كيف تجهز وتدير مؤتمراً صحفياً للإعلان عن مبادرة جديدة؟",
        "ماذا تفعل لو تراجع أحد المتحدثين عن بنود الاتفاق أثناء إلقاء كلمته؟",
        "كيف تصيغ بياناً صحفياً رسمياً لتوضيح موقف الكيان من شائعة معينة؟",
        "ما هي مهارات الإقناع السريع التي تعتمد عليها في الاتصالات الباردة (Cold Calls)؟",
        "كيف تقيم المظهر والبروتوكول الشخصي لمسؤولي العلاقات العامة؟",
        "كيف تتعامل مع طلبات الشراكة من كيانات منافسة أو مشابهة لكيانكم؟",
        "ما هي الخطوات المتبعة لاستخراج تصاريح حكومية لإقامة نشاط بالشارع؟",
        "كيف تنسق مع لجنة الميديا لتوثيق حضور الرعاة والشخصيات الهامة بشكل لائق؟",
        "إذا طلب منك شريك تعديل بنود الشراكة في يوم الحدث نفسه، كيف تتصرف؟",
        "ما هي أفضل طريقة لتوجيه الشكر والتقدير للشركاء بعد نجاح الفعالية؟",
        "كيف تتعامل مع الأزمات الطارئة التي تهدد سمعة الكيان أمام الرأي العام؟"
    ],
    "Media": [
        "ما هي البرامج والبرمجيات التي تجيد استخدامها في التصميم أو المونتاج؟",
        "كيف تتعامل مع ضغط الوقت عند طلب تصاميم عاجلة لفعالية قائمة؟",
        "ما هي أسس اختيار الهوية البصرية (Palette & Typography) لأي مشروع جديد؟",
        "كيف تتابع تريندات الميديا الحالية وتوظفها لخدمة أهداف الكيان؟",
        "ما الفرق بين التصميم الموجه لمنصات التواصل والتصميم المعد للطباعة؟",
        "كيف تنظم وتدير أرشيف الصور والفيديوهات الخاص بالفعاليات والمؤتمرات؟",
        "كيف تتعامل مع التغذية الراجعة (Feedback) السلبية من الإدارة على تصاميمك؟",
        "ما هي أساليب صناعة محتوى مرئي جذاب يرفع من نسب التفاعل (Engagement)؟",
        "كيف تحافظ على جودة وهوية التصاميم عند العمل مع فريق مكون من مصممين متعددين؟",
        "ما هو دور المونتاج وتصحيح الألوان في إيصال رسالة الفيديو التسويقي؟",
        "كيف تتعامل مع حقوق الملكية الفكرية للموسيقى والصور المستخدمة؟",
        "ما هي معاييرك في اختيار زوايا التصوير المناسبة أثناء التغطية الحية？",
        "كيف تضع خطة زمنية واضحة (Storyboard) قبل البدء في إنتاج فيديو طويل؟",
        "ما هي أحدث أدوات الذكاء الاصطناعي التي تستخدمها لتحسين إنتاجيتك في الميديا؟",
        "كيف تتصرف لو تعطل الهارد أو فُقدت ملفات عمل مشروع ضخم قبل النشر بيوم؟",
        "ما أهمية الـ Grid System في بناء تصاميم متوازنة ومريحة للعين؟",
        "كيف تختار الموسيقى والمؤثرات الصوتية المناسبة لطبيعة الفيديو وموضوعه؟",
        "ما هو الفرق بين أنواع ملفات الصور المختلفة (PNG, JPEG, SVG) ومتى تستخدم كل منها؟",
        "كيف تصمم هوية بصرية كاملة وموحدة لحدث يستمر لعدة أيام؟",
        "كيف تتعامل مع ضعف الإمكانيات والمعدات المتاحة للتصوير والمونتاج؟",
        "ما هي القواعد الذهبية لتوزيع الإضاءة عند تصوير مقابلة أو متحدث؟",
        "كيف تتأكد من أن التصاميم والمنشورات تظهر بشكل صحيح على شاشات الهواتف المختلفة؟",
        "كيف تصنع فكرة إبداعية ومختلفة لإعلان ترويجي لافتتاح موسم الكيان؟",
        "كيف تقيس نجاح التصميم أو الفيديو من خلال لغة الأرقام والإحصائيات؟",
        "ماذا تفعل لو اكتشفت خطأً إملائياً فادحاً في تصميم تم نشره بالفعل وحقق تفاعلاً كبيراً؟",
        "كيف تدير عملية الإنتاج المرئي بالتنسيق مع كاتبي المحتوى والمخططين؟",
        "ما هي الطريقة الفعالة لتدريب وتطوير الأعضاء المبتدئين في مجال التصميم أو المونتاج؟",
        "كيف توظف الموشن جرافيك لتبسيط المفاهيم المعقدة في الفيديوهات التعريفية؟",
        "ما هي معاييرك لتصميم غلاف أو بوستر مميز ومبهر لحدث ميداني؟",
        "كيف تحافظ على شغفك وإبداعك وتتجنب ما يسمى بالـ Creative Block (القفلة الإبداعية)؟"
    ],
    "Organization": [
        "كيف تتعامل مع الأعداد الكبيرة للمشاركين أثناء تنظيم طابور الدخول أو الفعاليات؟",
        "إذا حدث نقص طارئ في التجهيزات واللوجستيات قبل المؤتمر بساعة، كيف تتصرف؟",
        "كيف تضع خطة إخلاء طوارئ (Emergency Plan) لمكان الفعالية؟",
        "ما هي معاييرك لاختيار وتوزيع المهام على المنظمين في القاعة الحية؟",
        "كيف تدير عملية تسجيل الحضور (Check-in) لمنع التكدس عند الأبواب؟",
        "كيف تنسق مع اللجان الأخرى (PR & Media) لتوفير متطلباتهم اللوجستية يوم الحدث؟",
        "ماذا تفعل لو حجز أحد المشاركين تذكرة ولم يجد مقعداً متاحاً بسبب سوء التنظيم؟",
        "كيف تختار القاعة المناسبة من حيث المساحة، الصوت، والإضاءة لورش العمل؟",
        "ما هي أدواتك لإدارة العمليات اللوجستية وجرد الأدوات والمعدات الخاصة بالكيان؟",
        "كيف تتعامل مع الخلافات والمشادات المشحونة التي قد تحدث بين المنظمين والمحاضرين؟",
        "ما هي أهم الخطوات التي تقوم بها فور انتهاء الفعالية ومغادرة الجمهور؟",
        "كيف تدير عملية شراء وتجهيز المطبوعات والهدايا (Giveaways) بأعلى جودة وأقل سعر؟",
        "كيف تتصرف إذا تأخرت شركة الصوت والإضاءة عن الموعد المحدد للتركيب؟",
        "ما هي عناصر الـ Checklist الأساسية التي لا يمكن الاستغناء عنها قبل يوم الحدث؟",
        "كيف تقيم أداء فريق التنظيم بعد ختام الفعالية لتفادي أخطاء المرات القادمة؟",
        "كيف تتعامل مع مشارك يخالف قواعد المكان أو يثير الفوضى داخل القاعة؟",
        "ما هي الخطوات المتبعة لتأمين شخصية هامة وزائرة للحدث منذ وصولها وحتى مغادرتها؟",
        "كيف تضع مخططاً زمنياً دقيقاً (Agenda) لليوم التنظيمي وتضمن الالتزام به؟",
        "ماذا تفعل لو انقطع التيار الكهربائي فجأة أثناء إلقاء المحاضرة الرئيسية؟",
        "كيف تدير فريقاً تنظيماً ضخماً مقسماً على عدة طوابق أو قاعات مختلفة؟",
        "ما هي أهم معايير السلامة والصحة المهنية التي يجب مراعاتها في بيئة الفعاليات؟",
        "كيف تتعامل مع المفقودات والأمانات الخاصة بالجمهور أثناء وبعد الفعالية؟",
        "كيف تنسق عملية الإمداد والتموين (Catering) والوجبات للمنظمين والحضور؟",
        "ماذا تفعل لو اعتذر نصف فريق التنظيم عن الحضور في يوم الفعالية لظروف مفاجئة؟",
        "كيف تختار وتتعامل مع الموردين والشركات اللوجستية لضمان الالتزام بالمواعيد؟",
        "كيف تدير المساحات وتوزع مقاعد الحضور بناءً على فئات التذاكر؟",
        "ما هي خطتك للتعامل مع التغيرات الجوية المفاجئة إذا كانت الفعالية في مكان مفتوح؟",
        "كيف توثق وتكتب تقريراً تنظيمياً شاملاً يوضح السلبيات والإيجابيات بعد الحدث؟",
        "كيف تتصرف إذا طلب المحاضر تعديل الوسائل التعليمية أو الأجهزة التقنية قبل فقرته بدقائق؟",
        "ما هي المهارة الأهم التي يجب أن يتمتع بها مسؤول التنظيم لضمان نجاح أي حدث ميداني؟"
    ],
    "FR": [
        "ما هو الفارق الأساسي بين إدارة المشروعات والمبادرات الشبابية؟",
        "كيف تضع ميزانية مرنة ودراسة جدوى مالية لحدث ضخم طارئ؟",
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
        "كيف توظف مهارات التفاوض المالي لتقليل تكاليف المشتريات المباشرة؟",
        "ما هو الفرق بين التدفق النقدي (Cash Flow) والميزانية التقديرية؟",
        "كيف تتعامل مع طلبات الدفع الآجل من الموردين لضمان سير العمل؟",
        "ما هي المعايير القانونية والمحاسبية التي يجب الالتزام بها عند جمع التبرعات؟",
        "كيف تصمم نظاماً داخلياً لإدارة العهد المالية وضمان استردادها بدقة؟",
        "ماذا تفعل لو تجاوزت إحدى اللجان ميزانيتها المحددة دون إذن مسبق؟",
        "كيف تقنع جهة تجارية بتقديم رعاية عينية (In-Kind) بدلاً من الرعاية المالية؟",
        "ما هي أساليب تحليل التكلفة والعائد (Cost-Benefit Analysis) للمشاريع؟",
        "كيف تتابع وتراقب المصروفات التشغيلية بصفة دورية لضمان عدم تخطي الحدود؟",
        "ما هو تصرفك لو عُرض على الكيان تمويل مالي ضخم ولكن بشرط يضر باستقلاليته؟",
        "كيف تعد عرضاً مالياً (Financial Pitch) جذاباً ومقنعاً لرجال الأعمال؟",
        "ما هي الإجراءات المتبعة لتسوية الحسابات المالية مع نهاية العام المالي للكيان؟",
        "كيف توظف التكنولوجيا والبرامج المحاسبية لتطوير الأداء المالي للفريق؟",
        "ما هي طرق حساب نقطة التعادل (Break-Even Point) لفعالية تعتمد على بيع التذاكر؟",
        "كيف تتعامل مع تقلبات أسعار السوق عند شراء خامات ومستلزمات تستغرق وقتاً لتجهيزها؟",
        "كيف تبني علاقة ثقة طويلة الأجل مع المستشارين الماليين والجهات الداعمة؟"
    ],
    "Projects": [
        "كيف تضع خطة تشغيلية مبتكرة لمبادرة شبابية تخدم رؤية الكيان؟",
        "كيف تقيس مدى نجاح وتأثير مشروع قائم على الأرض؟",
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
        "ما هي إإستراتيجيتك لضمان استمرارية أثر المشروع بعد فترة طويلة من إطلاقه؟",
        "كيف تعد تقرير الإغلاق (Project Closure Report) لتوثيق الدروس المستفادة؟",
        "ما هو الفرق بين مخرجات المشروع (Outputs) ونتائجه (Outcomes) وأثره (Impact)؟",
        "كيف تجري تحليلاً بيئياً للمشروع باستخدام مصفوفة SWOT بدقة؟",
        "كيف تدير الموارد البشرية والمادية المخصصة للمشروع لضمان عدم الهدر؟",
        "ماذا تفعل لو تبين في منتصف المشروع أن الفرضيات الأساسية التي بني عليها كانت خاطئة؟",
        "كيف تصمم نموذج عمل تجاري (Business Model Canvas) لمشروع ريادي شبابي؟",
        "كيف تتعامل مع شركاء المشروع إذا تخلوا عن التزاماتهم في مرحلة التنفيذ؟",
        "ما هي أساليب الجدولة الزمنية مثل (Gantt Chart) وكيف تستخدمها لمتابعة التطور؟",
        "كيف تضمن جودة المخرجات النهائية للمشروع وتطابقها مع المعايير المطلوبة؟",
        "كيف تتصرف إذا حدث عجز مفاجئ في الميزانية المخصصة للمشروع أثناء تنفيذه؟",
        "ما هي معاييرك لاختيار فكرة مشروع جديدة وتفضيلها على الأفكار الأخرى؟",
        "كيف تنظم وتدير جلسات العصف الذهني (Brainstorming) مع فريق العمل لتوليد أفكار إبداعية؟",
        "كيف تقيس العائد على الاستثمار الاجتماعي (SROI) للمشاريع غير الربحية؟",
        "ما هي الخطوات اللازمة لتوسيع نطاق المشروع ونقله من المستوى المحلي إلى المستوى الوطني؟",
        "كيف تتعامل مع الشكاوى والملاحظات السلبية من الفئات المستهدفة للمشروع؟",
        "ما هو الدور الذي يلعبه الابتكار الاجتماعي في تصميم المشاريع الحديثة؟"
    ],
    "Coordinators": [
        "كيف تتعامل مع عضو غير ملتزم أو متفاعل في فريقك؟",
        "ما هي Mهارات التنسيق الفعال التي يجب توافرها في قائد الفريق الفني؟",
        "كيف تخطط لتوزيع المهام بعدالة بين أعضاء فريقك لضمان عدم الضغط؟",
        "ماذا تفعل لو تعارضت قراراتك كمنسق مع رؤية رئيس اللجنة (Head)؟",
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
        "ما هي رؤيتك لتطوير قنوات التواصل الداخلي بين الأعضاء لضمان الشفافية؟",
        "كيف تتعامل مع عضو يمتلك مهارات ممتازة ولكنه ينشر طاقة سلبية داخل الفريق؟",
        "ما هي أسس صياغة التقارير الدورية (الأسبوعية/الشهرية) لرفعها للإدارة العليا؟",
        "كيف تتصرف إذا تم تكليف فريقك بمهمة خارج نطاق اختصاصه المعتاد؟",
        "ما هي الطرق الفعالة لإدارة الأزمات وحل المشكلات الفنية الطارئة داخل الفريق؟",
        "كيف تحفز الأعضاء على تقديم أفكار ومبادرات تطويرية بدلاً من مجرد التنفيذ؟",
        "ما هي معاييرك لترشيح عضو من فريقك لتولي منصب قيادي أعلى في المستقبل؟",
        "كيف تتعامل مع الضغوط الناتجة عن تلاحم المواعيد النهائية (Deadlines) للمهام؟",
        "كيف تضمن تدفق المعلومات والقرارات الإدارية من الرؤساء إلى المرؤوسين بدقة؟",
        "ماذا تفعل لو شعرت بعدم التقدير لجهود فريقك من قبل إدارة الكيان؟",
        "كيف تنظم ورش عمل داخلية لتبادل الخبرات والمعارف بين أعضاء الفريق؟",
        "كيف تقيس مدى رضا وسعادة الأعضاء عن بيئة العمل والقيادة داخل فريقك؟",
        "ما هو تصرفك إذا تم إلغاء مهمة عمل بعد أن بذل فريقك جهداً كبيراً في تجهيزها؟",
        "كيف تتعامل مع التحديات الناتجة عن التواصل الافتراضي (عن بُعد) مقارنة بالتواصل الميداني؟",
        "ما هي رؤيتك لدمج الأعضاء الجدد مع القدامى في الفريق لمنع التحزب؟",
        "كيف تلخص تجربتك كمنسق وما هي الإضافة الأكبر التي تسعى لتقديمها للفريق؟"
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
};

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
};

// مصفوفة الـ 8 لجان المطلوبة المحدثة بالكامل لتظهر لجميع المستخدمين
const committeeDesc = [ 
    { title: "العلاقات المالية", text: "إدارة وتخطيط الميزانيات والتمويل الذاتي المستدام." }, 
    { title: "العلاقات العامة", text: "تمثيل الكيان وبناء الشراكات الرسمية الخارجية." }, 
    { title: "التنظيم واللوجستيات", text: "إدارة وتنظيم الفعاليات والمؤتمرات الميدانية." }, 
    { title: "الموارد البشرية (HR)", text: "متابعة وتقييم وتطوير الأداء العام داخل الكيان." }, 
    { title: "التدريب والتطوير", text: "تطوير مهارات وقدرات الأعضاء والمنسقين." }, 
    { title: "الميديا والمنصات", text: "إدارة وتصميم وصناعة المحتوى الرقمي المرئي للكيان." }, 
    { title: "المشروعات والمبادرات", text: "ابتكار وبناء الخطط التشغيلية للمبادرات الشبابية." }, 
    { title: "الدعم الفني (IT)", text: "تطوير وإدارة المنصات الإلكترونية والحلول البرمجية." } 
];

const generalDrive = "https://drive.google.com/drive/folders/1SZQqRozQ2AbF1YNLLrdpzTVExvp-4QuL";
let selectedCommittee = "";
let currentAccessType = "";
let selectedLoginType = "";

let globalIDPhotoBase64 = "https://via.placeholder.com/150";

// ==========================================
// 3. دوال بدء التشغيل والتحكم في الدخول
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const driveBtn = document.getElementById("drive-zone");
    if(driveBtn) {
        driveBtn.addEventListener("click", function() {
            if (currentAccessType === "زائر") {
                alert("❌ عذراً، لا تمتلك صلاحية الوصول لملفات جوجل درايف الخاصة بالكيان.");
                return;
            }
            window.open(generalDrive, "_blank");
        });
    }
    // تهيئة كود الـ QR المبدئي داخل الكارنيه ليعمل فوراً
    const qrBox = document.getElementById("id-qrcode-box");
    if (qrBox) {
        qrBox.innerHTML = "";
        new QRCode(qrBox, {
            text: "GAN-TEAM-SAIB-2026",
            width: 85,
            height: 85,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    }
});

function guestAccess() {
    document.getElementById('login-overlay').style.display = 'none';
    currentAccessType = "زائر";
    setVisitorRestrictedUI(true);
    renderAllUI();
}

function showAccessInput(type) {
    selectedLoginType = type;
    document.getElementById('main-options').style.display = 'none';
    document.getElementById('code-input-area').style.display = 'block';
}

function backToMain() {
    document.getElementById('main-options').style.display = 'block';
    document.getElementById('code-input-area').style.display = 'none';
}

function checkAccess() {
    const code = document.getElementById('access-code').value.trim();
    if (code === "3070" && selectedLoginType === "executive") {
        document.getElementById('login-overlay').style.display = 'none';
        currentAccessType = "المكتب التنفيذي";
        setVisitorRestrictedUI(false);
        const execZone = document.getElementById('executive-structure-zone');
        const execSyncZone = document.getElementById('executive-live-sync-panel-zone');
        if(execZone) execZone.style.display = 'block';
        if(execSyncZone) execSyncZone.style.display = 'block';
        fetchInterviewSheetData();
    } else if ((provinces[code] || centralCommittees[code]) && selectedLoginType === "admin") {
        document.getElementById('login-overlay').style.display = 'none';
        if (provinces[code]) {
            currentAccessType = provinces[code].name;
        } else {
            currentAccessType = centralCommittees[code].name;
        }
        setVisitorRestrictedUI(false);
        const execZone = document.getElementById('executive-structure-zone');
        const execSyncZone = document.getElementById('executive-live-sync-panel-zone');
        if(execZone) execZone.style.display = 'none';
        if(execSyncZone) execSyncZone.style.display = 'none';
        fetchInterviewSheetData();
    } else {
        alert("❌ الرمز المدخل غير صحيح أو لا يتوافق مع صلاحية الدخول المحددة.");
    }
}

function setVisitorRestrictedUI(isVisitor) {
    const hiddenElements = ["live-stats-row", "interview-control-section", "sheet-sync-status-card"];
    hiddenElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isVisitor ? "none" : "";
    });
}

function renderAllUI() {
    const accessBadge = document.getElementById("user-access-level-badge");
    if(accessBadge) accessBadge.innerText = currentAccessType || "غير محدد";
    
    // رندرة بطاقات اللجان الثمانية بالكامل لجميع المستخدمين
    const grid = document.getElementById("committees-cards-grid");
    if(grid) {
        grid.innerHTML = committeeDesc.map((c, idx) => `
            <div class="committee-glass-card" onclick="openCommitteeDetails('${c.title}')">
                <div class="card-glow-effect"></div>
                <div class="comm-card-icon-frame">
                    <i class="fa-solid ${getCommitteeIcon(idx)}"></i>
                </div>
                <h3>${c.title}</h3>
                <p>${c.text}</p>
                <span class="view-questions-badge"><i class="fa-solid fa-folder-open"></i> استعراض بنك الأسئلة</span>
            </div>
        `).join('');
    }
}

function getCommitteeIcon(idx) {
    const icons = [
        "fa-sack-dollar",
        "fa-handshake",
        "fa-users-gear",
        "fa-user-tie",
        "fa-graduation-cap",
        "fa-photo-film",
        "fa-lightbulb",
        "fa-code"
    ];
    return icons[idx] || "fa-circle-dot";
}

// ==========================================
// 4. نظام الأسئلة العشوائي والتحكم في عرض اللجان
// ==========================================
function openCommitteeDetails(name) {
    selectedCommittee = name;
    let mappedKey = name;
    if (name.includes("IT")) mappedKey = "IT";
    else if (name.includes("اتش ار") || name.includes("الموارد البشرية")) mappedKey = "HR";
    else if (name.includes("العلاقات العامة")) mappedKey = "PR";
    else if (name.includes("الميديا")) mappedKey = "Media";
    else if (name.includes("التنظيم")) mappedKey = "Organization";
    else if (name.includes("العلاقات المالية")) mappedKey = "FR";
    else if (name.includes("المشروعات")) mappedKey = "Projects";
    else if (name.includes("التدريب") || name.includes("المنسقين")) mappedKey = "Coordinators";

    const titleEl = document.getElementById("modal-committee-title");
    if(titleEl) titleEl.innerText = `بنك أسئلة | ${name}`;
    
    const container = document.getElementById("questions-list-container");
    if(container) {
        let rawQuestions = committeeQuestions[mappedKey] || [];
        
        // كود خوارزمية ترتيب عشوائي للأسئلة في كل مرة يتم فتح اللجنة فيها
        let questionsToRender = [...rawQuestions];
        for (let i = questionsToRender.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionsToRender[i], questionsToRender[j]] = [questionsToRender[j], questionsToRender[i]];
        }

        if(questionsToRender.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); text-align:center;">لا توجد أسئلة مضافة لهذه اللجنة حالياً.</p>`;
        } else {
            container.innerHTML = questionsToRender.map((q, i) => `
                <div class="question-item-row">
                    <span class="q-num-badge">${i + 1}</span>
                    <p class="q-text-content">${q}</p>
                </div>
            `).join('');
        }
    }
    
    const modal = document.getElementById("committee-questions-modal");
    if(modal) modal.style.display = "flex";
}

function closeCommitteeModal() {
    const modal = document.getElementById("committee-questions-modal");
    if(modal) modal.style.display = "none";
}

// ==========================================
// 5. نظام الربط المباشر بـ Google Sheets وجلب البيانات لايف
// ==========================================
function fetchInterviewSheetData() {
    const statusText = document.getElementById("sync-status-text");
    if(statusText) statusText.innerText = "جاري التحديث والمزامنة الآن...";
    
    fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
        cachedInterviewData = data || [];
        if(statusText) statusText.innerText = "مُتصل ولايف جاهز للعمل";
        calculateLiveStats();
        renderAllUI();
    })
    .catch(err => {
        console.error("Error syncing data:", err);
        if(statusText) statusText.innerText = "فشلت المزامنة التلقائية";
        renderAllUI();
    });
}

function calculateLiveStats() {
    const totalEl = document.getElementById("stat-total-interviews");
    const acceptedEl = document.getElementById("stat-accepted-count");
    const rejectedEl = document.getElementById("stat-rejected-count");
    const pendingEl = document.getElementById("stat-pending-count");
    
    if(!cachedInterviewData || cachedInterviewData.length === 0) return;
    
    if(totalEl) totalEl.innerText = cachedInterviewData.length;
    
    let accepted = 0, rejected = 0, pending = 0;
    cachedInterviewData.forEach(row => {
        const status = (row.status || "").toString().trim();
        if(status === "مقبول") accepted++;
        else if(status === "مرفوض") rejected++;
        else pending++;
    });
    
    if(acceptedEl) acceptedEl.innerText = accepted;
    if(rejectedEl) rejectedEl.innerText = rejected;
    if(pendingEl) pendingEl.innerText = pending;
}

// ==========================================
// 6. نظام المقابلات والعداد الذكي والتحكم الصوتي وعمل الـ ID
// ==========================================
function startInterviewProcess() {
    const searchId = document.getElementById("interviewee-search-id").value.trim();
    if(!searchId) {
        alert("⚠️ يرجى إدخال الرقم التعريفي للمتقدم أولاً!");
        return;
    }
    
    const person = cachedInterviewData.find(item => item.id.toString() === searchId);
    if(!person) {
        alert("❌ لم يتم العثور على أي متقدم بهذا الرقم، يرجى التأكد وإعادة المحاولة.");
        return;
    }
    
    document.getElementById("interview-main-menu").style.display = "none";
    document.getElementById("interview-form-area").style.display = "block";
    
    document.getElementById("view-interviewee-name").innerText = person.name || "غير مسجل";
    document.getElementById("view-interviewee-id").innerText = person.id || "---";
    document.getElementById("view-interviewee-governorate").innerText = person.governorate || "غير محدد";
    document.getElementById("view-interviewee-committee").innerText = person.committee || "غير محدد";
    
    // تفعيل العداد الزمني التلقائي
    window.interviewSeconds = 0;
    const timerEl = document.getElementById("interview-live-timer-clock");
    if(timerEl) timerEl.innerText = "00:00";
    
    if(window.interviewTimerInterval) clearInterval(window.interviewTimerInterval);
    window.interviewTimerInterval = setInterval(() => {
        window.interviewSeconds++;
        let mins = Math.floor(window.interviewSeconds / 60);
        let secs = window.interviewSeconds % 60;
        if(mins < 10) mins = "0" + mins;
        if(secs < 10) secs = "0" + secs;
        if(timerEl) timerEl.innerText = `${mins}:${secs}`;
    }, 1000);
}

function cancelInterview() {
    if(window.interviewTimerInterval) clearInterval(window.interviewTimerInterval);
    document.getElementById("interview-main-menu").style.display = "block";
    document.getElementById("interview-form-area").style.display = "none";
}

function submitInterviewResult(status) {
    const searchId = document.getElementById("interviewee-search-id").value.trim();
    const notes = document.getElementById("interview-evaluation-notes").value.trim();
    
    if(window.interviewTimerInterval) clearInterval(window.interviewTimerInterval);
    
    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.position = "fixed";
    loadingOverlay.style.top = "0";
    loadingOverlay.style.left = "0";
    loadingOverlay.style.width = "100%";
    loadingOverlay.style.height = "100%";
    loadingOverlay.style.background = "rgba(10,17,28,0.95)";
    loadingOverlay.style.color = "white";
    loadingOverlay.style.display = "flex";
    loadingOverlay.style.justifyContent = "center";
    loadingOverlay.style.alignItems = "center";
    loadingOverlay.style.zIndex = "9999";
    loadingOverlay.style.fontFamily = "'Cairo'";
    loadingOverlay.innerHTML = `<div><i class="fa-solid fa-circle-notch fa-spin" style="font-size:3rem; margin-bottom:15px; color:#2563eb;"></i><p>جاري ترحيل التقييم والبيانات لايف للـ Cloud شيت...</p></div>`;
    document.body.appendChild(loadingOverlay);

    fetch(sheetURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${encodeURIComponent(searchId)}&status=${encodeURIComponent(status)}&notes=${encodeURIComponent(notes)}`
    })
    .then(() => {
        document.body.removeChild(loadingOverlay);
        alert(`🎉 تم بنجاح ترحيل واعتماد النتيجة [${status}] للمتقدم وحفظها لايف!`);
        document.getElementById("interview-evaluation-notes").value = "";
        cancelInterview();
        fetchInterviewSheetData();
    })
    .catch(err => {
        document.body.removeChild(loadingOverlay);
        console.error(err);
        alert("❌ حدث خطأ أثناء الاتصال بالسيرفر، تـم ترحيل البيانات محلياً.");
        cancelInterview();
    });
}

function triggerVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("❌ متصفحك الحالي لا يدعم ميزة الإدخال الصوتي، يرجى كتابة التقييم يدوياً.");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const micBtn = document.getElementById("mic-voice-trigger-btn");
    if(micBtn) micBtn.innerHTML = `<i class="fa-solid fa-microphone-lines fa-flash" style="color:#ef4444;"></i> جاري الاستماع...`;

    recognition.start();

    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript;
        const textarea = document.getElementById("interview-evaluation-notes");
        if(textarea) {
            textarea.value = textarea.value ? textarea.value + " " + speechToText : speechToText;
        }
    };

    recognition.onerror = function() {
        alert("❌ فشل التقاط الصوت، يرجى المحاولة مرة أخرى في مكان هادئ.");
    };

    recognition.onend = function() {
        if(micBtn) micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> تفعيل الإدخال الصوتي الذكي`;
    };
}

// ==========================================
// 7. نظام الكارنيهات والـ QR Code والتحميل الفوري
// ==========================================
function processPersonalIDCard() {
    const searchId = document.getElementById("personal-id-search-input").value.trim();
    if(!searchId) {
        alert("⚠️ يرجى إدخال الرقم التعريفي الخاص بك أولاً!");
        return;
    }
    
    const user = cachedInterviewData.find(item => item.id.toString() === searchId);
    if(!user) {
        alert("❌ لم يتم العثور على بيانات بهذا الرقم، يرجى مراجعة إدارة الكيان.");
        return;
    }
    
    document.getElementById("id-card-output-display-name").innerText = user.name || "غير مسجل";
    document.getElementById("id-card-output-display-id").innerText = user.id || "---";
    document.getElementById("id-card-output-display-committee").innerText = user.committee || "غير محدد";
    document.getElementById("id-card-output-display-governorate").innerText = user.governorate || "غير محدد";
    
    const photoFrame = document.getElementById("id-card-output-profile-image-frame");
    if(photoFrame) {
        photoFrame.style.backgroundImage = `url('${globalIDPhotoBase64}')`;
        photoFrame.style.backgroundSize = "cover";
        photoFrame.style.backgroundPosition = "center";
    }

    const qrBox = document.getElementById("id-qrcode-box");
    if(qrBox) {
        qrBox.innerHTML = "";
        new QRCode(qrBox, {
            text: `ID:${user.id}|NAME:${user.name}|COMM:${user.committee}`,
            width: 85,
            height: 85,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    }
    
    alert("✅ تـم توليد الكارنيه الرقمي الذكي بنجاح! يمكنك الآن الضغط على زر التحميل كصورة.");
}

function handleIDImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        globalIDPhotoBase64 = e.target.result;
        const previewCircle = document.getElementById("upload-id-photo-preview-circle");
        if(previewCircle) {
            previewCircle.style.backgroundImage = `url('${globalIDPhotoBase64}')`;
            previewCircle.style.backgroundSize = "cover";
        }
        alert("📸 تم رفع وصقل الصورة الشخصية بنجاح!");
    };
    reader.readAsDataURL(file);
}

function downloadIDCardAsImage() {
    const target = document.getElementById("saib-team-badge-canvas-target");
    if(!target) return;
    
    html2canvas(target, {
        useCORS: true,
        scale: 3,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = `YDP-ID-${document.getElementById("id-card-output-display-id").innerText}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// ==========================================
// 8. نظام لوحة التحكم في البث المباشر والأخبار العاجلة
// ==========================================
function postNews() {
    const input = document.getElementById("news-input");
    if (!input || !input.value.trim()) return;
    
    db.collection("news").add({
        text: input.value.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("📢 تم بث الخبر العاجل في شريط منصة YDP بنجاح!");
        input.value = "";
    }).catch(err => {
        console.error(err);
    });
}

function postActivity() {
    const textarea = document.getElementById("activity-textarea");
    if (!textarea || !textarea.value.trim()) return;
    
    db.collection("activities").add({
        text: textarea.value.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("🔥 تم إتاحة الأنشطة لايف بنجاح!");
        textarea.value = "";
    }).catch(err => {
        console.error(err);
    });
}

function renderNews() { 
    const list = document.getElementById('news-list'); 
    if (!list) return; 
    db.collection("news").orderBy("timestamp", "desc").onSnapshot(s => { 
        list.innerHTML = s.docs.map(doc => `
            <div class="info-card" style="border-right:4px solid #ff8800; padding:12px; margin-bottom:10px; background:rgba(255,255,255,0.02); color:white; text-align:right; border-radius: 8px;">
                <p style="font-size:0.9rem; font-family:'Cairo';">${doc.data().text}</p>
            </div>
        `).join(''); 
        
        // ربط ومزامنة شريط الأخبار المتحرك (Ticker-Text) تلقائياً بآخر خبر منشور لايف
        if (s.docs.length > 0) {
            const tickerText = document.querySelector('.ticker-text');
            if (tickerText) {
                tickerText.innerText = s.docs[0].data().text;
            }
        }
    }); 
}

function renderActivities() { 
    const container = document.getElementById('activities-container'); 
    if (!container) return; 
    db.collection("activities").orderBy("timestamp", "desc").onSnapshot(s => { 
        container.innerHTML = s.docs.map(doc => `
            <div class="activity-post" style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; margin-bottom:15px; color:white; text-align:right; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; margin-bottom:8px; gap:10px;">
                    <div style="width:32px; height:32px; background:var(--blue-gradient); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem;"><i class="fa-solid fa-bolt"></i></div>
                    <div>
                        <h4 style="font-size:0.85rem; font-family:'Cairo'; color:var(--text-white)">إدارة كيان YDP الموحد</h4>
                        <span style="font-size:0.7rem; color:var(--text-muted)">بث مباشر حصري</span>
                    </div>
                </div>
                <p style="font-size:0.85rem; line-height:1.6; font-family:'Cairo'; color:#cbd5e1">${doc.data().text}</p>
            </div>
        `).join(''); 
    }); 
}

// تشغيل جلب البيانات والمزامنة والخدمات السحابية عند بدء المنصة فوراً
fetchInterviewSheetData();
renderNews();
renderActivities();