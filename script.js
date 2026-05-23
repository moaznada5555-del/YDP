// 1. رابط الـ Google Sheets
const sheetURL = "https://script.google.com/macros/s/AKfycbxsrOa2SbSLKgLlTYHvgGi4On7bbBxblH7wCAUZa9BDQd4RgOnDGFyIsZfYNOj5q9wh/exec";

// 2. إعدادات قاعدة البيانات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgLXWto9q2LRC7tjdJaqBNHHgVK3KGtio",
  authDomain: "ydp-project-bc31c.firebaseapp.com",
  projectId: "ydp-project-bc31c",
  storageBucket: "ydp-project-bc31c.firebasestorage.app",
  messagingSenderId: "398614049602",
  appId: "1:398614049602:web:41560bffc7d3fc91034edb",
  measurementId: "G-D1HHC8S3RW"
};

// تهيئة قاعدة البيانات والتأكد من عدم وجود أخطاء تمنع عمل الأزرار
if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}
const db = firebase.firestore();

// 3. بنك أسئلة المقابلات الموحد للكيان (مبتدئين وقادة)
const committeeQuestions = {
    "IT": [
        "ماذا يحدث عند كتابة رابط في المتصفح والضغط على Enter؟",
        "ما الفرق بين <div> و <span>؟",
        "ما هو مفهوم الـ Semantic HTML ولماذا هو مهم؟",
        "اشرح الفرق بين position: absolute و position: relative.",
        "ما هو الـ Flexbox وكيف نوسط عنصراً في منتصف الشاشة؟"
    ],
    "HR": ["هل لديك مهارة حل النزاعات؟", "هل سبق لك إجراء مقابلات؟", "هل تلتزم بالسرية التامة؟", "كيف تتعامل مع عضو غير ملتزم؟"],
    "PR": ["كيف تقنع شريكاً برعاية فعاليتنا؟", "ماذا تفعل لو حدث خطأ بروتوكولي أثناء فعالية؟", "كيف تبني علاقة قوية مع الجهات الحكومية؟"],
    "Media": ["ما هي البرامج والبرمجيات التي تجيد استخدامها في التصميم أو المونتاج؟", "كيف تتعامل مع ضغط الوقت عند طلب تصاميم عاجلة لفعالية قائمة؟"],
    "OR": ["كيف تتعامل مع الأعداد الكبيرة للمشاركين أثناء تنظيم طابور الدخول أو الفعاليات؟", "إذا حدث نقص طارئ في التجهيزات واللوجستيات قبل المؤتمر بساعة، كيف تتصرف؟"],
    "PI": ["ما هو الفارق الأساسي بين إدارة المشروعات والمبادرات الشبابية؟", "كيف تضع جدولاً زمنياً وخطة تشغيلية لمشروع تدريبي متكامل للكيان؟"],
    
    // الأسئلة القيادية المطلوبة
    "Coordinators": [
        "كيف تتعامل مع عضو غير ملتزم أو متفاعل في فريقك؟",
        "ما هي المهارات الأساسية التي يجب أن تتوفر في المنسق الناجح؟",
        "كيف تخطط لتوزيع المهام بعدالة بين أعضاء فريقك لضمان عدم الضغط؟",
        "ماذا تفعل لو تعارضت قراراتك كمنسق مع رؤية رئيس اللجنة (Head)؟"
    ],
    "Heads": [
        "إذا حدث خلاف حاد بين منسقين داخل لجنتك، كيف تديره وتحله؟",
        "كيف تضع خطة استراتيجية مرنة لإدارة اللجنة طوال الموسم الجديد؟",
        "كيف تضمن ولاء واستمرارية الأعضاء والمنسقين داخل لجنتك ومنع تسربهم؟",
        "ما هو التصرف الأمثل إذا كُلفت لجنتك بمهمة طارئة وضخمة قبل الفعالية بـ 24 ساعة؟"
    ]
};

const centralCommittees = { "HR-C": { name: "لجنة الموارد البشرية المركزية" }, "PR-C": { name: "لجنة العلاقات العامة المركزية" }, "SM-C": { name: "لجنة السوشيال ميديا المركزية" }, "ORG-C": { name: "لجنة التنظيم المركزية" }, "TR-C": { name: "لجنة التدريب المركزية" }, "PROJ-C": { name: "لجنة المشروعات والمبادرات المركزية" }, "FIN-C": { name: "لجنة الإدارة المالية المركزية" } };
const provinces = { "2024": { name: "محافظة القاهرة" }, "2030": { name: "محافظة الجيزة" }, "2050": { name: "محافظة الدقهلية" }, "2065": { name: "محافظة الفيوم" }, "2080": { name: "محافظة الغربية" }, "2100": { name: "محافظة الإسماعيلية" }, "2400": { name: "محافظة سوهاج" }, "2600": { name: "محافظة أسيوط" }, "2700": { name: "محافظة الأقصر" }, "2200": { name: "محافظة المنيا" }, "2300": { name: "محافظة بني سويف" }, "2500": { name: "محافظة قنا" } };
const committeeDesc = [ { title: "العلاقات العامة", text: "تمثيل الكيان وبناء الشراكات الرسمية." }, { title: "التدريب والتطوير", text: "تطوير مهارات وقدرات الأعضاء." }, { title: "السوشيال ميديا والمنصات", text: "إدارة صناعة المحتوى الرقمي للكيان." }, { title: "التنظيم واللوجستيات", text: "إدارة الفعاليات والمؤتمرات الميدانية." }, { title: "المشروعات والمبادرات", text: "ابتكار وبناء الخطط التشغيلية للمبادرات." }, { title: "الموارد البشرية", text: "متابعة وتقييم الأداء العام داخل الكيان." } ];
const generalDrive = "https://drive.google.com/drive/folders/1SZQqRozQ2AbF1YNLLrdpzTVExvp-4QuL";
let selectedCommittee = "";
let currentAccessType = "";

// --- وظائف التحكم بالدخول والدوال المصلحة ---
function guestAccess() { 
    document.getElementById('login-overlay').style.display = 'none'; 
    renderAllUI(); 
}

function showAccessInput() { 
    document.getElementById('main-options').style.display = 'none'; 
    document.getElementById('code-input-area').style.display = 'block'; 
}

function backToMain() { 
    document.getElementById('main-options').style.display = 'grid'; 
    document.getElementById('code-input-area').style.display = 'none'; 
}

function checkAccess() {
    const code = document.getElementById('access-code').value.trim();
    if (code === "3070") {
        document.getElementById('login-overlay').style.display = 'none';
        if(document.getElementById('admin-controls')) document.getElementById('admin-controls').style.display = 'block';
        if(document.getElementById('admin-activity-controls')) document.getElementById('admin-activity-controls').style.display = 'block';
        if(document.getElementById('interview-section')) document.getElementById('interview-section').style.display = 'block';
        if(document.getElementById('nav-interview')) document.getElementById('nav-interview').style.display = 'inline-block';
        currentAccessType = "إدارة";
        loadWorkspace("لوحة التحكم الإدارية للمكتب التنفيذي");
    } else if (provinces[code] || centralCommittees[code]) {
        const data = provinces[code] || centralCommittees[code];
        document.getElementById('login-overlay').style.display = 'none';
        if(document.getElementById('interview-section')) document.getElementById('interview-section').style.display = 'block';
        if(document.getElementById('nav-interview')) document.getElementById('nav-interview').style.display = 'inline-block';
        currentAccessType = data.name;
        loadWorkspace(data.name);
    } else { 
        alert("❌ الكود السري الذي أدخلته غير صحيح!"); 
    }
    renderAllUI();
}

// --- وظائف المقابلات ---
function startInterview(comm) {
    selectedCommittee = comm;
    document.getElementById('interview-main-menu').style.display = 'none';
    document.getElementById('interview-form-area').style.display = 'block';
    
    let displayTitle = comm;
    if (comm === "Coordinators") displayTitle = "أسئلة وتقييم المنسقين";
    if (comm === "Heads") displayTitle = "أسئلة وتقييم رؤساء اللجان (Heads)";
    
    document.getElementById('current-comm-title').innerText = "فحص ومقابلة: " + displayTitle;
    const container = document.getElementById('questions-container');
    const questions = committeeQuestions[comm] || ["سؤال تقييمي عام 1", "سؤال تقييمي عام 2"];
    
    container.innerHTML = questions.map((q, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:6px;">
            <span style="font-size:0.95rem; flex:1; text-align:right; font-weight:bold; color:#444;">${i+1}. ${q}</span>
            <div style="display:flex; gap:12px;">
                <label style="cursor:pointer; font-weight:bold; color:green;"><input type="radio" name="q${i}" value="1"> صح</label>
                <label style="cursor:pointer; font-weight:bold; color:red;"><input type="radio" name="q${i}" value="0"> خطأ</label>
            </div>
        </div>
    `).join('');
}

function backToInterviewMenu() {
    document.getElementById('interview-main-menu').style.display = 'block';
    document.getElementById('interview-form-area').style.display = 'none';
}

async function submitInterviewData() {
    const nameInput = document.getElementById('cand-name');
    const notesInput = document.getElementById('cand-notes');
    const accessCode = document.getElementById('access-code').value;
    const questions = committeeQuestions[selectedCommittee] || [];
    const checked = document.querySelectorAll('#questions-container input[type="radio"]:checked');
    
    if(!nameInput.value || checked.length < questions.length) {
        return alert("❌ برجاء كتابة اسم الشخص المستهدف والإجابة على بنود الاستمارة كاملة!");
    }

    let scoreValue = 0;
    checked.forEach(r => scoreValue += parseInt(r.value));
    const percentage = (scoreValue / questions.length) * 100;
    const status = percentage >= 50 ? "مقبول" : "مرفوض";
    const params = new URLSearchParams({
        name: nameInput.value,
        gov: currentAccessType,
        committee: selectedCommittee,
        interviewer: "كود " + accessCode,
        score: percentage.toFixed(0),
        status: status,
        notes: notesInput.value || "لا يوجد"
    });
    try {
        await fetch(`${sheetURL}?${params.toString()}`, { method: 'POST', mode: 'no-cors' });
        alert(`✅ تم تسجيل ورصد بيانات المقابلة بنجاح لشيت الكيان!\nالنتيجة النهائية: ${status}`);
        location.reload();
    } catch (e) {
        console.error(e);
        alert("حدث عطل في الإرسال، تأكد من إعدادات الـ Deployment للشيت");
    }
}

// --- سكشن بناء وتوثيق الكارنيه الطولي الفخم حماية من التكرار ---
function loadWorkspace(title) {
    const section = document.getElementById('workspace-section');
    const grid = document.getElementById('members-grid');
    if(section) section.style.display = 'block';
    document.getElementById('ws-title').innerText = `بوابة الأعضاء | ${title}`;
    
    grid.innerHTML = `
    <div style="grid-column: 1 / -1; width: 100%;">
        <div style="text-align: center; margin-bottom: 30px;">
            <a href="${generalDrive}" target="_blank" class="btn-drive"><i class="fas fa-folder-open"></i> الدخول إلى ملفات سحابة الدرايف الموحدة</a>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 24px; border: 2px dashed var(--gold); color: #333; margin-top: 20px; box-shadow: var(--card-shadow);" class="id-form-container">
            <h3 style="text-align: center; color: var(--blue); margin-bottom: 25px; font-weight:900;"><i class="fas fa-fingerprint"></i> إصدار وتوثيق بطاقة العضوية الذكية (ID)</h3>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 420px; margin: 0 auto 30px auto;">
                <input type="text" id="input-name" placeholder="الاسم الثلاثي بالكامل" oninput="updateIDCard()">
                <input type="text" id="input-national" maxlength="14" placeholder="الرقم القومي (14 رقم لمنع التكرار)">
                <input type="text" id="input-gov" placeholder="المحافظة" oninput="updateIDCard()">
                <input type="text" id="input-pos" placeholder="المنصب (مثال: منسق، رئيس لجنة...)" oninput="updateIDCard()">
                <input type="text" id="input-comm" placeholder="اللجنة التابع لها" oninput="updateIDCard()">
                
                <div style="text-align:right; margin:5px 0;">
                    <label style="font-size:0.85rem; color:#555; font-weight:bold; display:block; margin-bottom:5px;">الصورة الشخصية الرسمية للعضو:</label>
                    <input type="file" accept="image/*" onchange="previewImage(event)" style="width:100%;">
                </div>
                
                <button onclick="checkAndVerifyID()" class="btn-verify-id">
                    <i class="fas fa-check-circle"></i> فحص وتوثيق الكارنيه بالسيستم
                </button>
                
                <button id="btnPrintCard" onclick="window.print()" class="btn-print-id">
                    <i class="fas fa-print"></i> طباعة الكارنيه الطولي الآن
                </button>
            </div>

            <div id="id-card-preview" class="id-card-view">
                <div class="id-card-header-v">
                    <h3>رواد التطوير والتنمية الشبابية</h3>
                    <p>وزارة الشباب والرياضة • YDP</p>
                </div>
                
                <div class="member-photo-box-v">
                    <img id="id-photo-preview" src="https://via.placeholder.com/110x135" alt="الصورة">
                </div>
                
                <div class="id-info-v">
                    <div class="id-info-group">
                        <span>الاسم الكامل</span>
                        <p id="display-name">---</p>
                    </div>
                    <div class="id-info-group">
                        <span>المحافظة النيابية</span>
                        <p id="display-gov">---</p>
                    </div>
                    <div class="id-info-group" style="border:none;">
                        <span>المنصب / اللجنة التخصصية</span>
                        <p id="display-pos">---</p>
                    </div>
                </div>
                
                <div class="id-card-footer-v">
                    بطاقة عضوية رقمية موثقة لعام 2026
                </div>
            </div>
        </div>
    </div>`;
}

async function checkAndVerifyID() {
    const name = document.getElementById('input-name').value.trim();
    const nationalId = document.getElementById('input-national').value.trim();
    const gov = document.getElementById('input-gov').value.trim();
    const pos = document.getElementById('input-pos').value.trim();
    const comm = document.getElementById('input-comm').value.trim();

    if(!name || !nationalId || !gov || !pos || !comm) {
        return alert("❌ يرجى تعبئة كافة الحقول المطلوبة لإصدار بطاقة العضوية!");
    }
    if(nationalId.length !== 14 || isNaN(nationalId)) {
        return alert("❌ الرقم القومي غير صحيح! يجب أن يتكون من 14 رقم كاملة.");
    }

    try {
        const snapshot = await db.collection("registered_ids").where("nationalId", "==", nationalId).get();
        if (!snapshot.empty) {
            alert("❌ عذراً، هذا الرقم القومي مسجل ومصدر له ID مسبقاً! النظام يمنع تكرار الحسابات لشخص واحد.");
            document.getElementById('btnPrintCard').style.display = 'none';
            return;
        }

        await db.collection("registered_ids").add({
            fullName: name,
            nationalId: nationalId,
            governorate: gov,
            position: pos,
            committee: comm,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("✅ ممتاز! تم توثيق وحفظ بيانات العضوية بنجاح بنظام الفايربيز الموحد. يمكنك الطباعة الآن.");
        document.getElementById('btnPrintCard').style.display = 'inline-block';

    } catch (error) {
        console.error("Firebase Error: ", error);
        alert("حدث عطل أثناء الاتصال بالنظام الرقمي، أعد المحاولة.");
    }
}

function previewImage(event) { 
    const file = event.target.files[0]; 
    if (file) { 
        const reader = new FileReader(); 
        reader.onload = () => document.getElementById('id-photo-preview').src = reader.result; 
        reader.readAsDataURL(file); 
    } 
}

function updateIDCard() { 
    if(document.getElementById('input-name')) document.getElementById('display-name').innerText = document.getElementById('input-name').value || "---"; 
    if(document.getElementById('input-gov')) document.getElementById('display-gov').innerText = document.getElementById('input-gov').value || "---"; 
    if(document.getElementById('input-pos')) {
        const posText = document.getElementById('input-pos').value || "---";
        const commText = document.getElementById('input-comm') ? document.getElementById('input-comm').value : "";
        document.getElementById('display-pos').innerText = commText ? posText + " / " + commText : posText;
    }
}

// --- باقي وظائف السيستم واللوحات المساعدة للعمل المباشر ---
function renderCommittees() { const grid = document.getElementById('committees-grid'); if (grid) grid.innerHTML = committeeDesc.map(c => `<div class="info-card" style="background:white; color:black; padding:20px; border-radius:15px; border-bottom:3px solid #b8860b; box-shadow:0 4px 10px rgba(0,0,0,0.05);"><h3>${c.title}</h3><p>${c.text}</p></div>`).join(''); }
function renderNews() { const list = document.getElementById('news-list'); if (!list) return; db.collection("news").orderBy("timestamp", "desc").onSnapshot(s => { list.innerHTML = s.docs.map(doc => `<div class="info-card" style="border-right:4px solid #b8860b; padding:15px; margin-bottom:10px; background:white; color:black; text-align:right;"><p>${doc.data().text}</p></div>`).join(''); }); }
function renderActivities() { const container = document.getElementById('activities-container'); if (!container) return; db.collection("activities").orderBy("timestamp", "desc").onSnapshot(s => { container.innerHTML = s.docs.map(doc => { const images = doc.data().images || []; return `<div class="activity-post" style="background:white; padding:15px; border-radius:12px; margin-bottom:20px; color:black; text-align:right;">${images[0] ? `<img src="${images[0]}" style="width:100%; border-radius:8px; margin-bottom:10px;">` : ''}<p>${doc.data().text}</p></div>`; }).join(''); }); }
function logout() { location.reload(); }
function renderAllUI() { renderNews(); renderActivities(); renderCommittees(); }
window.onload = renderAllUI;
