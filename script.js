// 1. رابط الـ Google Sheets
const sheetURL = "https://script.google.com/macros/s/AKfycbx123xgH-HBkM8r5Hv-XlNEEcKGggO6JHQqdcoXUk9Ob4QtNGZI9MKNlMBDcYE_j3up/exec";

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

// مصفوفة عالمية لحفظ بيانات الشيت وجلبها مرة واحدة للفلترة الفورية والـ Live Dashboard
let cachedInterviewData = [];

// 3. بنك أسئلة المقابلات الموحد للكيان (مبتدئين وقادة)
const committeeQuestions = {
    "IT": [
        "ماذا يحدث عند كتابة رابط في المتصفح والضغط على Enter؟",
        "ما الفرق بين <div> و <span>؟",
        "ما هو مفهوم الـ Semantic HTML ولماذا هو مهم？",
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
        "كيف تضمن ولاء واستمرارية الأعضاء والمنسقين داخل لجنتك ومنع تسربهم？",
        "ما هو التصرف الأمثل إذا كُلفت لجنتك بمهمة طارئة وضخمة قبل الفعالية بـ 24 ساعة؟"
    ]
};

const centralCommittees = { "HR-C": { name: "لجنة الموارد البشرية المركزية" }, "PR-C": { name: "لجنة العلاقات العامة المركزية" }, "SM-C": { name: "لجنة السوشيال ميديا المركزية" }, "ORG-C": { name: "لجنة التنظيم المركزية" }, "TR-C": { name: "لجنة التدريب المركزية" }, "PROJ-C": { name: "لجنة المشروعات والمبادرات المركزية" }, "FIN-C": { name: "لجنة الإدارة المالية المركزية" } };
const provinces = { "2024": { name: "محافظة القاهرة" }, "2030": { name: "محافظة الجيزة" }, "2050": { name: "محافظة الدقهلية" }, "2065": { name: "محافظة الفيوم" }, "2080": { name: "محافظة الغربية" }, "2100": { name: "محافظة الإسماعيلية" }, "2400": { name: "محافظة سوهاج" }, "2600": { name: "محافظة أسيوط" }, "2700": { name: "محافظة الأقصر" }, "2200": { name: "محافظة المنيا" }, "2300": { name: "محافظة بني سويف" }, "2500": { name: "محافظة قنا" } };
const committeeDesc = [ { title: "العلاقات العامة", text: "تمثيل الكيان وبناء الشراكات الرسمية." }, { title: "التدريب والتطوير", text: "تطوير مهارات وقدرات الأعضاء." }, { title: "السوشيال ميديا والمنصات", text: "إدارة صناعة المحتوى الرقمي للكيان." }, { title: "التنظيم واللوجستيات", text: "إدارة الفعاليات والمؤتمرات الميدانية." }, { title: "المشروعات والمبادرات", text: "ابتكار وبناء الخطط التشغيلية للمبادرات." }, { title: "الموارد البشرية", text: "متابعة وتقييم الأداء العام داخل الكيان." } ];
const generalDrive = "https://drive.google.com/drive/folders/1SZQqRozQ2AbF1YNLLrdpzTVExvp-4QuL";
let selectedCommittee = "";
let currentAccessType = "";
let selectedLoginType = ""; 

// متغيرات الـ Pagination الخاصة ببوابة الأعضاء
let currentWorkspacePage = 1;
const itemsPerPage = 3; 
let totalWorkspaceItems = []; 

// ربط الزر العريض والخاص بسحابة جوجل درايف لايف من واجهة النيون
document.addEventListener("DOMContentLoaded", function() {
    const driveBtn = document.getElementById("drive-zone");
    if(driveBtn) {
        driveBtn.addEventListener("click", function() {
            window.open(generalDrive, "_blank");
        });
    }
});

// --- وظائف التحكم بالدخول والدوال المصلحة ---
function guestAccess() { 
    document.getElementById('login-overlay').style.display = 'none'; 
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
        if(document.getElementById('admin-controls')) document.getElementById('admin-controls').style.display = 'block';
        if(document.getElementById('admin-activity-controls')) document.getElementById('admin-activity-controls').style.display = 'block';
        if(document.getElementById('interview-section')) document.getElementById('interview-section').style.display = 'block';
        if(document.getElementById('nav-interview')) document.getElementById('nav-interview').style.display = 'inline-block';
        if(document.getElementById('exec-questions-area')) document.getElementById('exec-questions-area').style.display = 'block';
        
        // إظهار تبويب لوحة عرض نتائج المقابلات لايف للمكتب التنفيذي فقط
        if(document.getElementById('admin-dashboard-section')) document.getElementById('admin-dashboard-section').style.display = 'block';
        if(document.getElementById('nav-admin-dashboard')) document.getElementById('nav-admin-dashboard').style.display = 'inline-block';

        currentAccessType = "إدارة";
        loadWorkspace("لوحة التحكم الإدارية للمكتب التنفيذي");
        fetchInterviewSheetData(); // جلب وربط كشوفات جوجل شيت لايف
    } else if ((provinces[code] && selectedLoginType === 'provinces') || (centralCommittees[code] && selectedLoginType === 'committees')) {
        const data = provinces[code] || centralCommittees[code];
        document.getElementById('login-overlay').style.display = 'none';
        if(document.getElementById('interview-section')) document.getElementById('interview-section').style.display = 'block';
        if(document.getElementById('nav-interview')) document.getElementById('nav-interview').style.display = 'inline-block';
        if(document.getElementById('exec-questions-area')) document.getElementById('exec-questions-area').style.display = 'none';
        if(document.getElementById('admin-dashboard-section')) document.getElementById('admin-dashboard-section').style.display = 'none';
        if(document.getElementById('nav-admin-dashboard')) document.getElementById('nav-admin-dashboard').style.display = 'none';
        
        currentAccessType = data.name;
        loadWorkspace(data.name);
    } else { 
        alert("❌ الكود السري الذي أدخلته غير صحيح أو لا يطابق البوابة المختارة!"); 
    }
    renderAllUI();
}

// --- وظائف المقابلات الموحدة ---
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
            <span style="font-size:0.95rem; flex:1; text-align:right; font-weight:bold; color:#e2e8f0;">${i+1}. ${q}</span>
            <div style="display:flex; gap:12px;">
                <label style="cursor:pointer; font-weight:bold; color:#22c55e;"><input type="radio" name="q${i}" value="1"> صح</label>
                <label style="cursor:pointer; font-weight:bold; color:#ef4444;"><input type="radio" name="q${i}" value="0"> خطأ</label>
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

// --- وظائف الـ Live Dashboard وجلب كشوفات المقابلات من شيت جوجل ---
async function fetchInterviewSheetData() {
    const tbody = document.getElementById('interview-results-tbody');
    if(!tbody) return;
    try {
        const response = await fetch(`${sheetURL}`);
        const data = await response.json();
        cachedInterviewData = data.records || [];
        renderInterviewTable(cachedInterviewData);
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--gold-light); padding: 15px; font-weight: bold;">⚠️ تنبيه: نظام عرض البيانات يعتمد على ربط دالة doGet(e) داخل الـ Apps Script لإرجاع كود JSON التفاعلي.</td></tr>`;
    }
}

function renderInterviewTable(records) {
    const tbody = document.getElementById('interview-results-tbody');
    if(!tbody) return;
    if(records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #64748b;">لا توجد سجلات مطابقة للبحث.</td></tr>`;
        return;
    }
    tbody.innerHTML = records.map(r => {
        const statusText = r.status || r.الحالة || '---';
        let badgeClass = 'status-badge pending';
        if (statusText === 'مقبول') badgeClass = 'status-badge accepted';
        if (statusText === 'مرفوض') badgeClass = 'status-badge rejected';

        return `
            <tr>
                <td style="padding: 12px; font-weight: 700; color: #fff;">${r.name || r.الاسم || '---'}</td>
                <td style="padding: 12px; color: #8a99ad;">${r.committee || r.اللجنة || '---'}</td>
                <td style="padding: 12px; font-weight: bold; color: var(--gold-light);">${r.score || r.النتيجة || '0'}%</td>
                <td style="padding: 12px;"><span class="${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

function filterInterviewTable() {
    const searchVal = document.getElementById('search-cand-name').value.toLowerCase().trim();
    const commVal = document.getElementById('filter-comm').value;
    const statusVal = document.getElementById('filter-status') ? document.getElementById('filter-status').value : "";

    const filtered = cachedInterviewData.filter(r => {
        const name = (r.name || r.الاسم || '').toLowerCase();
        const committee = r.committee || r.اللجنة || '';
        const status = r.status || r.الحالة || '';

        const matchSearch = name.includes(searchVal);
        const matchComm = commVal === "" || committee === commVal;
        const matchStatus = statusVal === "" || status === statusVal;

        return matchSearch && matchComm && matchStatus;
    });

    renderInterviewTable(filtered);
}

// --- سكشن بناء وتوثيق الكارنيه الطولي الفخم حماية من التكرار مع الـ Pagination ---
function loadWorkspace(title) {
    const section = document.getElementById('workspace-section');
    if(section) section.style.display = 'block';
    document.getElementById('ws-title').innerText = `بوابة الأعضاء | ${title}`;
    fetchAndRenderWorkspaceCards();
}

async function fetchAndRenderWorkspaceCards() {
    const grid = document.getElementById('members-grid');
    
    let baseHTML = `
    <div style="width: 100%; margin-top: 10px;">
        <div style="background: rgba(13, 22, 33, 0.4); padding: 25px; border-radius: 20px; border: 1px dashed rgba(212, 175, 55, 0.3); color: #fff;" class="id-form-container">
            <h3 style="text-align: center; color: var(--gold-light); margin-bottom: 20px; font-weight:900;"><i class="fas fa-fingerprint"></i> إصدار بطاقة العضوية الذكية (ID)</h3>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 420px; margin: 0 auto 25px auto;">
                <input type="text" id="input-name" placeholder="الاسم الثلاثي بالكامل" oninput="updateIDCard()">
                <input type="text" id="input-national" maxlength="14" placeholder="الرقم القومي (14 رقم)" oninput="updateIDCard()">
                <input type="text" id="input-gov" placeholder="المحافظة" oninput="updateIDCard()">
                <input type="text" id="input-pos" placeholder="المنصب (مثال: منسق، رئيس لجنة...)" oninput="updateIDCard()">
                <input type="text" id="input-comm" placeholder="اللجنة التابع لها" oninput="updateIDCard()">
                
                <div style="text-align:right; margin:5px 0;">
                    <label style="font-size:0.85rem; color:#8a99ad; font-weight:bold; display:block; margin-bottom:5px;">الصورة الشخصية الرسمية للعضو:</label>
                    <input type="file" accept="image/*" onchange="previewImage(event)" style="width:100%; color: white;">
                </div>
                
                <button onclick="checkAndVerifyID()" class="btn-verify-id">
                    <i class="fas fa-check-circle"></i> فحص وتوثيق الكارنيه بالسيستم
                </button>
                
                <div style="display: flex; gap: 10px; margin-top: 10px; width: 100%;">
                    <button id="btnPrintCard" onclick="window.print()" class="btn-print-id" style="flex: 1;">
                        <i class="fas fa-print"></i> طباعة الكارنيه
                    </button>
                    <button id="btnDownloadCard" onclick="downloadIDCardAsImage()" style="flex: 1; display: none; background: var(--gold-gradient); color: white; padding: 14px; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-family:'Cairo'; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fas fa-download"></i> تحميل كصورة PNG
                    </button>
                </div>
            </div>

            <div id="id-card-preview" class="id-card-view">
                <div class="id-card-header-v">
                    <h3>رواد التطوير والتنمية الشبابية</h3>
                    <p>منصة الجان الموحدة • GAN TEAM</p>
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

                <div id="id-qrcode-box">
                    <img id="id-qrcode-img" src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=SAIB-GAN-2026" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                
                <div class="id-card-footer-v">
                    بطاقة عضوية رقمية موثقة لعام 2026
                </div>
            </div>
        </div>
    </div>`;

    try {
        const snapshot = await db.collection("registered_ids").orderBy("timestamp", "desc").get();
        totalWorkspaceItems = [];
        snapshot.forEach(doc => {
            totalWorkspaceItems.push(doc.data());
        });
        
        grid.innerHTML = baseHTML;
        renderPaginationControls();
    } catch (err) {
        grid.innerHTML = baseHTML;
        console.error("خطأ في تحميل الكروت: ", err);
    }
}

function renderPaginationControls() {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    if (totalWorkspaceItems.length === 0) {
        container.innerHTML = "<p style='color: #64748b; font-size: 0.9rem; text-align: center; width: 100%;'>لا يوجد أعضاء موثقين مسجلين حالياً.</p>";
        return;
    }

    const totalPages = Math.ceil(totalWorkspaceItems.length / itemsPerPage);
    let html = '';
    if (currentWorkspacePage > 1) {
        html += `<button onclick="changeWorkspacePage(${currentWorkspacePage - 1})">السابق</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        const activeStyle = i === currentWorkspacePage ? 'background: var(--gold-gradient); color: white; border-color: var(--gold-light);' : '';
        html += `<button onclick="changeWorkspacePage(${i})" style="${activeStyle}">${i}</button>`;
    }
    
    if (currentWorkspacePage < totalPages) {
        html += `<button onclick="changeWorkspacePage(${currentWorkspacePage + 1})">التالي</button>`;
    }
    
    container.innerHTML = html;
    
    const existingCards = document.querySelectorAll('.dynamic-member-card');
    existingCards.forEach(card => card.remove());
    
    const startIndex = (currentWorkspacePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = totalWorkspaceItems.slice(startIndex, endIndex);
    
    const grid = document.getElementById('members-grid');
    paginatedItems.forEach(item => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'info-card dynamic-member-card';
        cardDiv.style = "background: rgba(255,255,255,0.02); color: white; padding: 15px; border-radius: 15px; border-bottom: 3px solid var(--gold); border-top: 1px solid rgba(255,255,255,0.04); margin-top: 12px; text-align: right; width: 100%;";
        cardDiv.innerHTML = `
            <h4 style="color: var(--gold-light); margin-bottom: 6px;"><i class="fas fa-user"></i> ${item.fullName}</h4>
            <p style="font-size: 0.85rem; margin: 4px 0; color:#e2e8f0;"><strong>المحافظة:</strong> ${item.governorate}</p>
            <p style="font-size: 0.85rem; margin: 4px 0; color:#8a99ad;"><strong>المنصب:</strong> ${item.position} / ${item.committee}</p>
        `;
        grid.appendChild(cardDiv);
    });
}

function changeWorkspacePage(pageNumber) {
    currentWorkspacePage = pageNumber;
    renderPaginationControls();
    document.getElementById('workspace-section').scrollIntoView({ behavior: 'smooth' });
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
            alert("❌ عذراً، هذا الرقم القومي مسجل ومصدر له ID مسبقاً!");
            document.getElementById('btnPrintCard').style.display = 'none';
            document.getElementById('btnDownloadCard').style.display = 'none';
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

        const finalQrData = `SAIB GAN TEAM Verified Member\n-------------------------\nName: ${name}\nNational ID: ${nationalId}\nRole: ${pos} / ${comm}\nGovernorate: ${gov}\nSecure Portal 2026`;
        const qrImg = document.getElementById('id-qrcode-img');
        if (qrImg) {
            qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(finalQrData)}`;
        }

        alert("✅ ممتاز! تم توثيق وحفظ بيانات العضوية وتوليد الباركود الذكي بنجاح.");
        document.getElementById('btnPrintCard').style.display = 'inline-block';
        document.getElementById('btnDownloadCard').style.display = 'inline-block';
        fetchAndRenderWorkspaceCards();

    } catch (error) {
        console.error("Firebase Error: ", error);
        alert("حدث عطل أثناء الاتصال بالنظام الرقمي، أعد المحاولة.");
    }
}

function downloadIDCardAsImage() {
    const cardElement = document.getElementById('id-card-preview');
    const memberName = document.getElementById('input-name').value.trim() || "GAN-Member";
    
    if(!cardElement) return;

    html2canvas(cardElement, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: null 
    }).then(canvas => {
        const imageURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = `ID_${memberName}_2026.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch(err => {
        console.error("حدث خطأ أثناء تحميل الكارت كصورة: ", err);
        alert("⚠️ عذراً، واجهنا مشكلة أثناء تصدير الصورة، تأكد من استقرار المتصفح.");
    });
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
    const nameText = document.getElementById('input-name') ? document.getElementById('input-name').value.trim() : "";
    const nationalText = document.getElementById('input-national') ? document.getElementById('input-national').value.trim() : "";
    const govText = document.getElementById('input-gov') ? document.getElementById('input-gov').value.trim() : "";
    
    if(document.getElementById('display-name')) document.getElementById('display-name').innerText = nameText || "---"; 
    if(document.getElementById('display-gov')) document.getElementById('display-gov').innerText = govText || "---"; 
    if(document.getElementById('input-pos')) {
        const posText = document.getElementById('input-pos').value || "---";
        const commText = document.getElementById('input-comm') ? document.getElementById('input-comm').value : "";
        document.getElementById('display-pos').innerText = commText ? posText + " / " + commText : posText;
    }

    if(nameText || nationalText) {
        const qrData = `GAN Member: ${nameText} | ID: ${nationalText} | Verified 2026`;
        const qrImg = document.getElementById('id-qrcode-img');
        if (qrImg) {
            qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(qrData)}`;
        }
    }
}

// --- باقي وظائف السيستم واللوحات المساعدة لضمان عمل الأزرار بالملي ---
function renderCommittees() { const grid = document.getElementById('committees-grid'); if (grid) grid.innerHTML = committeeDesc.map(c => `<div class="info-card" style="background:rgba(255,255,255,0.02); color:white; padding:20px; border-radius:15px; border-bottom:3px solid var(--gold); border-top:1px solid rgba(255,255,255,0.04); text-align:right;"><h3>${c.title}</h3><p style="color:#8a99ad; font-size:0.85rem; margin-top:5px;">${c.text}</p></div>`).join(''); }
function renderNews() { const list = document.getElementById('news-list'); if (!list) return; db.collection("news").orderBy("timestamp", "desc").onSnapshot(s => { list.innerHTML = s.docs.map(doc => `<div class="info-card" style="border-right:4px solid var(--red-ministry); padding:12px; margin-bottom:10px; background:rgba(255,255,255,0.02); color:white; text-align:right;"><p>${doc.data().text}</p></div>`).join(''); }); }
function renderActivities() { const container = document.getElementById('activities-container'); if (!container) return; db.collection("activities").orderBy("timestamp", "desc").onSnapshot(s => { container.innerHTML = s.docs.map(doc => { const images = doc.data().images || []; return `<div class="activity-post" style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; margin-bottom:20px; color:white; text-align:right; border:1px solid rgba(255,255,255,0.04);">${images[0] ? `<img src="${images[0]}" style="width:100%; border-radius:8px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.05);">` : ''}<p>${doc.data().text}</p></div>`; }).join(''); }); }
function logout() { location.reload(); }
function renderAllUI() { renderNews(); renderActivities(); renderCommittees(); }
window.onload = renderAllUI;
