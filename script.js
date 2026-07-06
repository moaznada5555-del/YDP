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

// متغيرات العداد الزمني للمقابلات
let interviewTimerInterval = null;
let interviewSeconds = 0;

// ==========================================
// 2. المصفوفات وبنك الأسئلة وهيكل الكيان (بدون أي حذف)
// ==========================================
const committeeQuestions = {
    "IT": [
        "ماذا يحدث عند كتابة رابط في المتصفح والضغط على Enter؟",
        "ما الفرق بين <div> و <span>؟",
        "ما هو مفهوم الـ Semantic HTML ولماذا هو مهم؟",
        "اشرح الفرق بين position: absolute و position: relative.",
        "ما هو الـ Flexbox وكيف نوسط عنصراً في منتصف الشاشة؟"
    ],
    "HR": ["هل لديك مهارة حل النزاعات؟", "هل سبق لك إجراء مقابلات？", "هل تلتزم بالسرية التامة؟", "كيف تتعامل مع عضو غير ملتزم؟"],
    "PR": ["كيف تقنع شريكاً برعاية فعاليتنا؟", "ماذا تفعل لو حدث خطأ بروتوكولي أثناء فعالية؟", "كيف تبني علاقة قوية مع الجهات الخارجية؟"],
    "Media": ["ما هي البرامج والبرمجيات التي تجيد استخدامها في التصميم أو المونتاج؟", "كيف تتعامل مع ضغط الوقت عند طلب تصاميم عاجلة لفعالية قائمة؟"],
    "Organization": ["كيف تتعامل مع الأعداد الكبيرة للمشاركين أثناء تنظيم طابور الدخول أو الفعاليات؟", "إذا حدث نقص طارئ في التجهيزات واللوجستيات قبل المؤتمر بساعة، كيف تتصرف؟"],
    "FR": ["ما هو الفارق الأساسي بين إدارة المشروعات والمبادرات الشبابية؟", "كيف تضع ميزانية مرنة ودراسة جدوى مالية لحدث ضخم طارئ؟"],
    "Projects": ["كيف تضع خطة تشغيلية مبتكرة لمبادرة شبابية تخدم رؤية الكيان؟", "كيف تقيس مدى نجاح وتأثير مشروع قائم على الأرض؟"],
    
    // القسم الخاص بالمنسقين
    "Coordinators": [
        "كيف تتعامل مع عضو غير ملتزم أو متفاعل في فريقك؟",
        "ما هي المهارات الأساسية التي يجب أن تتوفر في المنسق الناجح؟",
        "كيف تخطط لتوزيع المهام بعدالة بين أعضاء فريقك لضمان عدم الضغط؟",
        "ماذا تفعل لو تعارضت قراراتك كمنسق مع رؤية رئيس اللجنة (Head)؟"
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

const committeeDesc = [ 
    { title: "العلاقات العامة", text: "تمثيل الكيان وبناء الشراكات الرسمية." }, 
    { title: "التدريب والتطوير", text: "تطوير مهارات وقدرات الأعضاء." }, 
    { title: "السوشيال ميديا والمنصات", text: "إدارة صناعة المحتوى الرقمي للكيان." }, 
    { title: "التنظيم واللوجستيات", text: "إدارة الفعاليات والمؤتمرات الميدانية." }, 
    { title: "المشروعات والمبادرات", text: "ابتكار وبناء الخطط التشغيلية للمبادرات." }, 
    { title: "الموارد البشرية", text: "متابعة وتقييم الأداء العام داخل الكيان." } 
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
        
        // إظهار اللوحات الإضافية الخاصة بالمكتب التنفيذي والأمانة العامة
        const execZone = document.getElementById('executive-structure-zone');
        const execSyncZone = document.getElementById('executive-live-sync-panel-zone');
        if(execZone) execZone.style.display = 'block';
        if(execSyncZone) execSyncZone.style.display = 'block';
        
        fetchInterviewSheetData(); 
    } else if ((provinces[code] && selectedLoginType === 'provinces') || (centralCommittees[code] && selectedLoginType === 'committees')) {
        const data = provinces[code] || centralCommittees[code];
        document.getElementById('login-overlay').style.display = 'none';
        currentAccessType = data.name;
        setVisitorRestrictedUI(false); 
    } else { 
        alert("❌ الكود السري الذي أدخلته غير صحيح أو لا يطابق البوابة المختارة!"); 
    }
    
    const roleDisplay = document.getElementById('user-role-display');
    if (roleDisplay) {
        roleDisplay.innerText = `نطاق الوصول: ${currentAccessType}`;
    }
    renderAllUI();
}

function setVisitorRestrictedUI(isVisitor) {
    const elementsToHide = [
        'workspace-section',       
        'interview-section',       
        'admin-dashboard-section'
    ];
    elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isVisitor ? 'none' : 'block';
    });
}

// ==========================================
// 4. غرفة المقابلات والعداد الزمني الذكي
// ==========================================
function startInterview(comm) {
    selectedCommittee = comm;
    document.getElementById('interview-main-menu').style.display = 'none';
    document.getElementById('interview-form-area').style.display = 'block';
    
    const container = document.getElementById('questions-container');
    
    // التحقق ما إذا كانت الاستمارة المطلوبة هي استمارة المنسقين لتشغيل الواجهة المخصصة لها
    if (comm === "Coordinators" && typeof window.initializeCoordinatorsFormLayout === 'function') {
        window.initializeCoordinatorsFormLayout(container);
    } else {
        const questions = committeeQuestions[comm] || ["سؤال تقييمي عام 1", "سؤال تقييمي عام 2"];
        container.innerHTML = questions.map((q, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px; direction: rtl;">
                <span style="font-size:0.9rem; flex:1; text-align:right; font-weight:600; color:#e2e8f0;">${i+1}. ${q}</span>
                <div style="display:flex; gap:12px; margin-right: 10px;">
                    <label style="cursor:pointer; font-weight:bold; color:#22c55e;"><input type="radio" name="q${i}" value="1"> صح</label>
                    <label style="cursor:pointer; font-weight:bold; color:#ef4444;"><input type="radio" name="q${i}" value="0"> خطأ</label>
                </div>
            </div>
        `).join('');
    }

    // تشغيل العداد الزمني
    clearInterval(interviewTimerInterval);
    interviewSeconds = 0;
    const timerDisplay = document.getElementById('interview-timer');
    interviewTimerInterval = setInterval(() => {
        interviewSeconds++;
        let mins = Math.floor(interviewSeconds / 60).toString().padStart(2, '0');
        let secs = (interviewSeconds % 60).toString().padStart(2, '0');
        if(timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
}

async function submitInterviewData() {
    const nameInput = document.getElementById('cand-name');
    const notesInput = document.getElementById('cand-notes');
    const questions = committeeQuestions[selectedCommittee] || [];
    
    let percentage = 0;
    let status = "مرفوض";
    
    if (selectedCommittee === "Coordinators") {
        const totalRadioGroups = questions.length;
        let correctAnswersCount = 0;
        let answeredCount = 0;
        
        // مصفوفة الإجابات الصحيحة لاستمارة المنسقين المدمجة
        const coorAnswers = [0, 1, 1, 0]; 
        
        for (let i = 0; i < totalRadioGroups; i++) {
            const checkedRadio = document.querySelector(`input[name="coor_q_${i}"]:checked`);
            if (checkedRadio) {
                answeredCount++;
                if (parseInt(checkedRadio.value) === coorAnswers[i]) {
                    correctAnswersCount++;
                }
            }
        }
        
        if (!nameInput.value || answeredCount < totalRadioGroups) {
            return alert("❌ برجاء كتابة اسم الشخص المستهدف والإجابة على بنود الاستمارة كاملة!");
        }
        
        percentage = (correctAnswersCount / totalRadioGroups) * 100;
    } else {
        const checked = document.querySelectorAll('#questions-container input[type="radio"]:checked');
        if(!nameInput.value || checked.length < questions.length) {
            return alert("❌ برجاء كتابة اسم الشخص المستهدف والإجابة على بنود الاستمارة كاملة!");
        }
        
        let scoreValue = 0;
        checked.forEach(r => scoreValue += parseInt(r.value));
        percentage = (scoreValue / questions.length) * 100;
    }

    clearInterval(interviewTimerInterval);
    status = percentage >= 50 ? "مقبول" : "مرفوض";
    let timeTaken = document.getElementById('interview-timer').innerText + " دقيقة";

    const newRecord = {
        name: nameInput.value,
        committee: selectedCommittee,
        score: percentage.toFixed(0),
        status: status,
        time: timeTaken,
        notes: notesInput.value || "لا يوجد"
    };

    cachedInterviewData.unshift(newRecord);
    
    renderInterviewTable(cachedInterviewData);
    renderExecSyncTable(cachedInterviewData);

    const params = new URLSearchParams({
        name: nameInput.value,
        gov: currentAccessType,
        committee: selectedCommittee,
        interviewer: "منصة الجان الذكية",
        score: percentage.toFixed(0),
        status: status,
        notes: notesInput.value || "لا يوجد"
    });

    try {
        await fetch(`${sheetURL}?${params.toString()}`, { method: 'POST', mode: 'no-cors' });
        alert(`✅ تم تسجيل ورصد بيانات المقابلة بنجاح لشيت الكيان!\nالنتيجة النهائية: ${status}`);
        
        nameInput.value = "";
        notesInput.value = "";
        cancelInterview();
    } catch (e) {
        console.error(e);
        alert("✅ تم الحفظ باللوحة المحلية بنجاح وجاري المزامنة الخلفية مع الشيت السحابي.");
        cancelInterview();
    }
}

// ==========================================
// 5. إدارة جداول البيانات والفلترة لايف
// ==========================================
async function fetchInterviewSheetData() {
    try {
        const response = await fetch(`${sheetURL}`);
        const data = await response.json();
        cachedInterviewData = data.records || [];
        renderInterviewTable(cachedInterviewData);
        renderExecSyncTable(cachedInterviewData);
    } catch (err) {
        console.error(err);
    }
}

function renderInterviewTable(records) {
    const tbody = document.getElementById('interview-results-tbody');
    if(!tbody) return;
    if(records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">لا توجد سجلات مطابقة للبحث.</td></tr>`;
        return;
    }
    tbody.innerHTML = records.map(r => {
        const statusText = r.status || '---';
        let badgeClass = 'status-badge pending';
        if (statusText === 'مقبول') badgeClass = 'status-badge accepted';
        if (statusText === 'مرفوض') badgeClass = 'status-badge rejected';

        return `
            <tr>
                <td>${r.name || '---'}</td>
                <td>${r.committee || '---'}</td>
                <td>${r.time || '10:00 دقيقة'}</td>
                <td style="font-weight: bold; color: #ffaa44;">${r.score || '0'}%</td>
                <td><span class="${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

function renderExecSyncTable(records) {
    const tbody = document.getElementById('exec-interview-sync-tbody');
    if(!tbody) return;
    if(records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 15px;">في انتظار تحميل بيانات المتقدمين...</td></tr>`;
        return;
    }
    tbody.innerHTML = records.map(r => {
        const statusText = r.status || '---';
        let badgeClass = 'status-badge pending';
        if (statusText === 'مقبول') badgeClass = 'status-badge accepted';
        if (statusText === 'مرفوض') badgeClass = 'status-badge rejected';
        return `
            <tr>
                <td>${r.name || '---'}</td>
                <td>${r.committee || '---'}</td>
                <td style="font-weight: bold; color: #a855f7;">${r.score || '0'}%</td>
                <td><span class="${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

function filterInterviewTable() {
    const searchVal = document.getElementById('search-cand-name').value.toLowerCase().trim();
    const commVal = document.getElementById('filter-comm').value;

    const filtered = cachedInterviewData.filter(r => {
        const name = (r.name || '').toLowerCase();
        const committee = r.committee || '';

        const matchSearch = name.includes(searchVal);
        const matchComm = commVal === "" || committee === commVal;

        return matchSearch && matchComm;
    });

    renderInterviewTable(filtered);
    renderExecSyncTable(filtered);
}

// ==========================================
// 6. بوابة إصدار كروت الـ ID والـ QR للأعضاء
// ==========================================
function loadIDImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            globalIDPhotoBase64 = e.target.result;
            const cardImg = document.getElementById('card-display-img');
            if(cardImg) cardImg.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function updateIDCard() {
    const nameInput = document.getElementById('id-input-name').value.trim();
    const commSelect = document.getElementById('id-input-committee').value;
    
    const cardName = document.getElementById('card-display-name');
    const cardComm = document.getElementById('card-display-committee');
    
    if(cardName) cardName.innerText = nameInput || "إسم العضو الثلاثي";
    if(cardComm) cardComm.innerText = commSelect;
    
    const qrBox = document.getElementById('id-qrcode-box');
    if(qrBox) {
        qrBox.innerHTML = "";
        const finalData = `GAN TEAM Verified Member\nName: ${nameInput || 'Guest'}\nCommittee: ${commSelect}\nYear: 2026`;
        new QRCode(qrBox, {
            text: finalData,
            width: 85,
            height: 85,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    }
}

function downloadIDCard() {
    const cardElement = document.getElementById('ydp-digital-id-card');
    const memberName = document.getElementById('id-input-name').value.trim() || "GAN_Member";
    
    if(!cardElement) return;

    html2canvas(cardElement, {
        scale: 3, 
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
        console.error(err);
        alert("واجهنا مشكلة أثناء تصدير الصورة، يرجى المحاولة مرة أخرى.");
    });
}

// ==========================================
// 7. بوابات النشر لايف للأخبار والأنشطة (Firebase)
// ==========================================
function postNews() {
    const input = document.getElementById('news-input');
    if (!input || !input.value.trim()) {
        return alert("❌ برجاء كتابة محتوى الخبر أولاً قبل النشر!");
    }
    
    const text = input.value.trim();
    db.collection("news").add({
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("🎉 تم نشر وتعميم الخبر العاجل بالشريط بنجاح!");
        input.value = "";
    }).catch(err => {
        console.error(err);
    });
}

function postActivity() {
    const textarea = document.getElementById('activity-text');
    if (!textarea || !textarea.value.trim()) {
        return alert("❌ برجاء كتابة تفاصيل الفعالية أولاً قبل النشر!");
    }

    const text = textarea.value.trim();
    db.collection("activities").add({
        text: text,
        images: [], 
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("🎉 تم نشر وتوثيق الفعالية بساحة الأنشطة لايف بنجاح!");
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
    }); 
}

function renderActivities() { 
    const container = document.getElementById('activities-container'); 
    if (!container) return; 
    db.collection("activities").orderBy("timestamp", "desc").onSnapshot(s => { 
        container.innerHTML = s.docs.map(doc => `
            <div class="activity-post" style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; margin-bottom:15px; color:white; text-align:right; border:1px solid rgba(255,255,255,0.04);">
                <p style="font-size:0.9rem; font-family:'Cairo'; line-height:1.6;">${doc.data().text}</p>
            </div>
        `).join(''); 
    }); 
}

function logout() { 
    location.reload(); 
}

function renderAllUI() { 
    renderNews(); 
    renderActivities(); 
}

window.onload = renderAllUI;
