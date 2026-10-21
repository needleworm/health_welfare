// 보건복지부 웹 앱 프론트엔드 인터랙션 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // 1. 맞춤 지원 자가진단 체크리스트 기능
  initChecker();

  // 2. 생애주기별 탭 전환 기능
  initTabs();

  // 3. 부드러운 스크롤 & 헤더 액티브 링크 동기화
  initScrollNav();

  // 4. 키워드 정책 검색/필터 기능
  initSearch();
});

/* ====================================================
   맞춤 복지 지원 혜택 데이터베이스 (자가진단 매핑)
   ==================================================== */
const BENEFIT_DB = {
  // 1. 생애주기 관련
  pregnant_baby: [
    {
      id: 'parent_pay',
      category: '임신·영유아',
      org: '보건복지부 / 읍면동 주민센터',
      title: '부모급여 (만 0~1세)',
      desc: '출산 초기 가정의 양육 부담을 덜기 위해 만 0세(0~11개월) 월 100만 원, 만 1세(12~23개월) 월 50만 원을 현금 지급합니다.',
      benefit: '월 최대 100만 원 현금 지원',
      link: 'https://www.bokjiro.go.kr',
      contact: '보건복지상담센터 129'
    },
    {
      id: 'first_meet',
      category: '출산·초기지원',
      org: '보건복지부',
      title: '첫만남이용권 바우처',
      desc: '출생 아동에게 국민행복카드 바우처 포인트(첫째아 200만원, 둘째아 이상 300만원)를 지급하여 산후조리, 육아용품 구매를 돕습니다.',
      benefit: '첫째아 200만 원 / 둘째아 이상 300만 원',
      link: 'https://www.bokjiro.go.kr',
      contact: '관할 읍·면·동 주민센터'
    },
    {
      id: 'preg_medical',
      category: '임산부 건강',
      org: '국민건강보험공단',
      title: '임신·출산 진료비 지원 (국민행복카드)',
      desc: '임산부 및 2세 미만 영유아의 진료비 및 약제·치료재료 구입비를 이용권 형태로 지원합니다.',
      benefit: '단태아 100만 원 / 다태아 140만 원 바우처',
      link: 'https://www.nhis.or.kr',
      contact: '건강보험공단 1577-1000'
    }
  ],
  child: [
    {
      id: 'child_pay',
      category: '아동 양육',
      org: '보건복지부',
      title: '아동수당 (만 8세 미만)',
      desc: '부모의 소득과 재산에 관계없이 만 8세 미만(0~95개월) 모든 아동에게 매달 25일 10만 원씩 기본 지급합니다.',
      benefit: '매월 10만 원 현금 지급',
      link: 'https://www.bokjiro.go.kr',
      contact: '보건복지상담센터 129'
    },
    {
      id: 'child_care_center',
      category: '돌봄 서비스',
      org: '보건복지부 / 지자체',
      title: '다함께돌봄센터 방과 후 돌봄',
      desc: '초등학생 방과 후 돌봄 사각지대를 해소하기 위해 지역사회 중심의 맞춤형 돌봄 서비스와 급식·간식을 제공합니다.',
      benefit: '상시·일시 방과 후 돌봄 및 학습·놀이 프로그램',
      link: 'https://www.bokjiro.go.kr',
      contact: '거주지 시·군·구청 복지과'
    }
  ],
  youth: [
    {
      id: 'youth_mind',
      category: '청년 마음건강',
      org: '보건복지부',
      title: '청년마음건강지원 바우처',
      desc: '만 19~34세 청년의 심리 정서 지원 및 건강성 회복을 위해 3개월간 전문 1:1 심리상담(총 10회)을 제공합니다.',
      benefit: '전문 심리상담 10회 바우처 (본인부담금 10% 이하)',
      link: 'https://www.bokjiro.go.kr',
      contact: '관할 주민센터 또는 129'
    },
    {
      id: 'youth_savings',
      category: '자산형성',
      org: '보건복지부',
      title: '청년내일저축계좌',
      desc: '일하는 저소득 청년이 매월 10만 원 저축 시 정부가 매달 10만~30만 원을 매칭 지원하여 3년 후 목돈을 마련해 드립니다.',
      benefit: '3년간 최대 1,080만 원 정부지원금 매칭',
      link: 'https://www.bokjiro.go.kr',
      contact: '자산형성지원 콜센터 1522-3690'
    },
    {
      id: 'independent_youth',
      category: '자립준비청년',
      org: '아동권리보장원 / 복지부',
      title: '자립준비청년 자립수당 & 정착지원',
      desc: '보호종료 5년 이내 청년에게 매월 자립수당을 지급하고, 주거지원 통합서비스 및 전담 멘토링을 연계합니다.',
      benefit: '매월 자립수당 50만 원 + 자립정착금',
      link: 'https://www.ncrc.or.kr',
      contact: '자립지원전담기관 1522-1823'
    }
  ],
  senior: [
    {
      id: 'basic_pension',
      category: '어르신 노후소득',
      org: '보건복지부 / 국민연금공단',
      title: '기초연금 지원 (만 65세 이상)',
      desc: '만 65세 이상 어르신 중 소득인정액 기준 하위 70% 어르신에게 안정적인 노후생활을 지원하기 위해 매달 연금을 지급합니다.',
      benefit: '단독가구 기준 월 최대 약 33만 4천 원',
      link: 'https://basicpension.mohw.go.kr',
      contact: '국민연금공단 1355'
    },
    {
      id: 'longterm_care',
      category: '요양·간병',
      org: '국민건강보험공단',
      title: '노인장기요양보험',
      desc: '치매나 뇌혈관 질환 등으로 혼자 거동하기 어려운 어르신에게 요양보호사 방문요양, 목욕, 주야간보호 및 요양원 입소비용을 80~85% 지원합니다.',
      benefit: '재가 및 시설 요양급여비용 80~85% 공단 부담',
      link: 'https://www.longtermcare.or.kr',
      contact: '국민건강보험공단 1577-1000'
    },
    {
      id: 'dementia_center',
      category: '치매관리',
      org: '전국 보건소 치매안심센터',
      title: '치매안심센터 원스톱 케어',
      desc: '만 60세 이상 누구나 무료 기억력 치매 선별검사를 받을 수 있으며, 치매환자 등록 시 치료약제비 지원, 배회감지기 무상 보급, 쉼터 프로그램을 제공합니다.',
      benefit: '무료 조기검진 + 월 3만원 치료관리비 지원',
      link: 'https://www.nid.or.kr',
      contact: '치매상담콜센터 1899-9988'
    },
    {
      id: 'senior_job',
      category: '사회참여',
      org: '한국노인인력개발원',
      title: '노인 일자리 및 사회활동 지원',
      desc: '활기차고 건강한 노후생활을 영위할 수 있도록 공익활동형, 사회서비스형, 시장형 등 다양한 시니어 맞춤 일자리를 제공합니다.',
      benefit: '월 29만~76만원 수준 활동수당 및 급여',
      link: 'https://www.kordi.or.kr',
      contact: '노인일자리상담 1544-3388'
    }
  ],
  adult_general: [
    {
      id: 'nhis_general',
      category: '건강보장',
      org: '국민건강보험공단',
      title: '국민건강보험 급여 혜택 & 일반검진',
      desc: '일상적 질병·부상에 대한 진료비 경감과 만 20세 이상 국민 대상 2년 주기 국가 무료 일반건강검진을 제공합니다.',
      benefit: '병원 진료비 대폭 감면 + 2년마다 무료 기본검진',
      link: 'https://www.nhis.or.kr',
      contact: '국민건강보험 1577-1000'
    },
    {
      id: 'nps_retirement',
      category: '노후준비',
      org: '국민연금공단',
      title: '국민연금 가입 및 크레딧 제도',
      desc: '국민연금 가입을 통해 평생 노후연금을 준비하고, 출산 및 군복무 시 추가 가입 기간을 인정하는 크레딧 혜택을 제공합니다.',
      benefit: '평생 물가연동 노령연금 + 출산/군복무 크레딧',
      link: 'https://www.nps.or.kr',
      contact: '국민연금 콜센터 1355'
    }
  ],

  // 2. 건강/의료 상황 관련
  heavy_medical_bills: [
    {
      id: 'catastrophic_medical',
      category: '의료비 부담 경감',
      org: '국민건강보험공단 / 복지부',
      title: '재난적 의료비 지원사업',
      desc: '중증질환, 수술 등으로 가계 부담을 넘는 과도한 의료비가 발생했을 때 본인부담 의료비의 최대 50~80%를 국가가 환급 지원합니다.',
      benefit: '연간 최대 5,000만 원 한도 의료비 지원',
      link: 'https://www.nhis.or.kr',
      contact: '건강보험공단 1577-1000'
    },
    {
      id: 'ceiling_refund',
      category: '의료안전망',
      org: '국민건강보험공단',
      title: '건강보험 본인부담상한제',
      desc: '환자가 부담한 연간 건강보험 본인부담금 총액이 개인별 소득수준에 따른 상한액을 초과할 경우, 초과금을 공단이 전액 환급합니다.',
      benefit: '소득구간별 상한액 초과 전액 사후환급',
      link: 'https://www.nhis.or.kr',
      contact: '건강보험공단 1577-1000'
    }
  ],
  dementia_mobility: [
    {
      id: 'integrated_community_care',
      category: '재택의료·돌봄',
      org: '보건복지부 / 지자체',
      title: '장기요양 재택의료센터 & 통합돌봄',
      desc: '거동이 불편해 병원에 방문하기 어려운 어르신 댁으로 의사·간호사·사회복지사가 직접 찾아가 진료와 간호 돌봄을 통합 제공합니다.',
      benefit: '가정 방문 왕진 진료 및 맞춤 간호 서비스',
      link: 'https://www.mohw.go.kr',
      contact: '관할 보건소 및 129'
    }
  ],
  mental_health: [
    {
      id: 'all_mind_invest',
      category: '정신건강',
      org: '보건복지부',
      title: '전국민 마음투자 지원사업',
      desc: '우울, 불안 등 정신적 어려움을 겪는 국민에게 전문적인 1:1 심리상담을 받을 수 있는 바우처(총 8회)를 제공합니다.',
      benefit: '전문 심리상담 8회 지원 바우처 (최대 64만 원 상당)',
      link: 'https://www.mohw.go.kr',
      contact: '보건복지상담센터 129'
    },
    {
      id: 'crisis_hotline',
      category: '응급심리상담',
      org: '보건복지부',
      title: '24시간 정신건강 위기상담전화',
      desc: '마음의 위기나 극단적 생각이 들 때 365일 언제든 전문가의 심리 상담과 긴급출동 지원을 받을 수 있습니다.',
      benefit: '24시간 무료 전화상담 (109 / 1577-0199)',
      link: 'https://www.mohw.go.kr',
      contact: '위기상담전화 109'
    }
  ],
  checkup: [
    {
      id: 'cancer_screen',
      category: '질병 예방',
      org: '국민건강보험공단',
      title: '국가 6대 암검진 사업',
      desc: '발생률이 높고 조기진단 시 치료율이 높은 6대 암(위암, 대장암, 간암, 유방암, 자궁경부암, 폐암) 검진을 무료 또는 10% 본인부담으로 지원합니다.',
      benefit: '위·자궁경부암 등 무료 또는 본인부담 10%',
      link: 'https://www.nhis.or.kr',
      contact: '건강보험공단 1577-1000'
    }
  ],

  // 3. 경제/가구 상황 관련
  emergency_crisis: [
    {
      id: 'emergency_welfare',
      category: '긴급구호',
      org: '보건복지부 / 시·군·구',
      title: '긴급복지지원제도',
      desc: '주소득자의 사망, 중한 질병·부상, 실직, 화재 등으로 갑작스러운 위기상황에 처했을 때 현장확인 후 72시간 내 신속하게 생계·주거비를 지원합니다.',
      benefit: '4인가구 기준 월 약 183만 원 긴급 생계지원금 + 의료비 최대 300만원',
      link: 'https://www.129.go.kr',
      contact: '보건복지상담센터 129 (연중무휴)'
    }
  ],
  basic_livelihood: [
    {
      id: 'basic_living_security',
      category: '기초생활보장',
      org: '보건복지부',
      title: '국민기초생활보장 (생계·의료·주거·교육급여)',
      desc: '소득인정액이 기준 중위소득 이하인 가구에 최저생활을 보장하고 자립을 유도하기 위해 맞춤형 급여를 지원합니다.',
      benefit: '생계급여 4인가구 최대 월 195만원 + 의료급여(병원비 본인부담 대폭 면제)',
      link: 'https://www.bokjiro.go.kr',
      contact: '관할 읍면동 행정복지센터 / 129'
    },
    {
      id: 'energy_voucher',
      category: '취약계층 난방/냉방',
      org: '정부합동 / 복지부',
      title: '에너지바우처 지원',
      desc: '생계·의료급여 수급 가구 중 노인, 장애인, 영유아, 임산부 등이 포함된 가구에 냉·난방 에너지 비용을 바우처로 지원합니다.',
      benefit: '하절기·동절기 전기/가스/등유 요금 바우처',
      link: 'https://www.energyv.or.kr',
      contact: '에너지바우처 콜센터 1600-3190'
    }
  ],
  disabled_person: [
    {
      id: 'disability_support',
      category: '장애인 자립',
      org: '보건복지부 / 국민연금공단',
      title: '장애인 활동지원 서비스',
      desc: '일상생활과 사회생활이 어려운 등록 장애인에게 활동지원사를 파견하여 신체활동, 가사활동, 외출 이동 등을 보조합니다.',
      benefit: '월 60~480시간 활동지원 바우처 제공',
      link: 'https://www.ableservice.or.kr',
      contact: '국민연금공단 1355 / 관할 주민센터'
    },
    {
      id: 'disability_pension',
      category: '장애인 소득보장',
      org: '보건복지부',
      title: '장애인연금 & 장애수당',
      desc: '중증장애인에게는 매월 장애인연금을, 경증장애인에게는 장애수당을 지급하여 장애로 인한 추가비용과 생활안정을 돕습니다.',
      benefit: '기초급여 + 부가급여 합산 매월 연금 지급',
      link: 'https://www.bokjiro.go.kr',
      contact: '보건복지상담센터 129'
    }
  ],
  single_parent: [
    {
      id: 'single_parent_support',
      category: '한부모가족',
      org: '여성가족부 / 보건복지부 협력',
      title: '한부모가족 아동양육비 지원',
      desc: '기준 중위소득 63% 이하 한부모가족에게 자녀 1인당 월 21만 원의 아동양육비와 학용품비를 지원합니다.',
      benefit: '자녀 1인당 월 21만 원 양육비 + 학용품비',
      link: 'https://www.bokjiro.go.kr',
      contact: '한부모상담전화 1644-6621'
    }
  ],
  standard_worker: [
    {
      id: 'national_pension_support',
      category: '근로자 지원',
      org: '국민연금공단',
      title: '두루누리 사회보험료 지원 & 국민연금',
      desc: '소규모 사업장 저소득 근로자와 예술인 등에게 국민연금·고용보험료의 80%를 국가가 직접 지원합니다.',
      benefit: '국민연금 보험료 최대 80% 지원',
      link: 'https://insurancesupport.or.kr',
      contact: '국민연금공단 1355'
    }
  ]
};

/* ====================================================
   자가진단 체크리스트 컨트롤러
   ==================================================== */
function initChecker() {
  const form = document.getElementById('checkerForm');
  const btnDiagnose = document.getElementById('btnDiagnose');
  const btnReset = document.getElementById('btnResetChecker');
  const resultBox = document.getElementById('checkerResultBox');
  const resultContainer = document.getElementById('resultCardsContainer');
  const countText = document.getElementById('resultSummaryCount');
  const stepItems = document.querySelectorAll('.step-item');
  const optionCards = document.querySelectorAll('.option-card');

  if (!form || !btnDiagnose) return;

  // 체크박스 클릭 시 시각적 카드 선택 피드백
  optionCards.forEach(card => {
    const chk = card.querySelector('input[type="checkbox"]');
    if (!chk) return;

    card.addEventListener('click', (e) => {
      // 라벨 클릭 시 기본 체크박스 변경 외 중복 방지
      if (e.target !== chk) {
        chk.checked = !chk.checked;
      }
      toggleCardSelected(card, chk.checked);
      updateStepProgress();
    });
  });

  function toggleCardSelected(card, isChecked) {
    if (isChecked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  }

  // 스텝 인디케이터 동적 활성화
  function updateStepProgress() {
    const q1Checked = form.querySelectorAll('input[name="lifeStage"]:checked').length > 0;
    const q2Checked = form.querySelectorAll('input[name="healthCond"]:checked').length > 0;
    const q3Checked = form.querySelectorAll('input[name="econCond"]:checked').length > 0;

    stepItems[0].classList.toggle('active', true);
    stepItems[1].classList.toggle('active', q1Checked);
    stepItems[2].classList.toggle('active', q1Checked && q2Checked);
  }

  // 진단 버튼 실행
  btnDiagnose.addEventListener('click', () => {
    const checkedInputs = form.querySelectorAll('input[type="checkbox"]:checked');

    if (checkedInputs.length === 0) {
      alert('하나 이상의 상황이나 관심 항목을 선택해 주세요!');
      return;
    }

    const matchedBenefits = [];
    const addedIds = new Set();

    checkedInputs.forEach(input => {
      const key = input.value;
      if (BENEFIT_DB[key]) {
        BENEFIT_DB[key].forEach(item => {
          if (!addedIds.has(item.id)) {
            addedIds.add(item.id);
            matchedBenefits.push(item);
          }
        });
      }
    });

    // 만약 일반 체크만 있어 매칭이 적더라도 공통 복지혜택 기본 포함
    if (matchedBenefits.length === 0) {
      matchedBenefits.push(
        ...BENEFIT_DB.adult_general,
        ...BENEFIT_DB.checkup
      );
    }

    // 결과 렌더링
    renderResults(matchedBenefits);

    // 결과창 보이기 및 스크롤
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function renderResults(list) {
    countText.innerHTML = `선택하신 상황을 종합 분석한 결과, <strong>총 ${list.length}개의 맞춤 복지 제도</strong>를 이용하실 수 있습니다.`;
    resultContainer.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'res-card';
      card.innerHTML = `
        <div>
          <div class="res-head">
            <span class="res-tag">${escapeHtml(item.category)}</span>
            <span class="res-org">${escapeHtml(item.org)}</span>
          </div>
          <h4 class="res-name">${escapeHtml(item.title)}</h4>
          <p class="res-desc">${escapeHtml(item.desc)}</p>
        </div>
        <div>
          <div class="res-benefit">🎁 지원 내용: ${escapeHtml(item.benefit)}</div>
          <div class="res-action">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="res-link">온라인 신청 안내 ↗</a>
            <span class="res-contact">📞 ${escapeHtml(item.contact)}</span>
          </div>
        </div>
      `;
      resultContainer.appendChild(card);
    });
  }

  // 초기화 버튼
  btnReset.addEventListener('click', () => {
    form.reset();
    optionCards.forEach(card => card.classList.remove('selected'));
    stepItems.forEach((item, idx) => item.classList.toggle('active', idx === 0));
    resultBox.style.display = 'none';
    resultContainer.innerHTML = '';
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ====================================================
   생애주기별 탭 전환 기능
   ==================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = 'panel-' + btn.getAttribute('data-target');
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ====================================================
   스크롤 내비게이션 하이라이트 동기화
   ==================================================== */
function initScrollNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ====================================================
   키워드 검색 기능
   ==================================================== */
function initSearch() {
  const searchInput = document.getElementById('policySearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const summaryBox = document.getElementById('searchResultSummary');

  if (!searchInput) return;

  const cards = [
    ...document.querySelectorAll('.benefit-item'),
    ...document.querySelectorAll('.role-card'),
    ...document.querySelectorAll('.trend-box'),
    ...document.querySelectorAll('.news-item')
  ];

  function performSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (!keyword) {
      cards.forEach(card => (card.style.display = ''));
      summaryBox.textContent = '';
      return;
    }

    let matchCount = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(keyword)) {
        card.style.display = '';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    summaryBox.textContent = `검색 결과: "${keyword}" 관련 항목 ${matchCount}건이 표시되었습니다.`;
  }

  searchInput.addEventListener('input', performSearch);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    performSearch();
    searchInput.focus();
  });
}
