export const EXERCISE_DB = [
    // 가슴
    { id: 'bench_press', name: '벤치 프레스', group: '가슴' },
    { id: 'incline_bench_press', name: '인클라인 벤치 프레스', group: '가슴' },
    { id: 'chest_press', name: '체스트 프레스 (해머/호이스트)', group: '가슴' },
    { id: 'pec_deck_fly', name: '펙 덱 플라이', group: '가슴' },
    { id: 'cable_crossover', name: '케이블 크로스오버', group: '가슴' },
    { id: 'dip', name: '딥스', group: '가슴' },
    { id: 'incline_press_machine', name: '인클라인 프레스 머신', group: '가슴' },

    // 등
    { id: 'deadlift', name: '데드리프트', group: '등' },
    { id: 'lat_pulldown', name: '랫 풀 다운', group: '등' },
    { id: 'mag_grip_pulldown', name: '맥그립 랫 풀 다운', group: '등' },
    { id: 'pull_up', name: '풀업 (턱걸이)', group: '등' },
    { id: 'barbell_row', name: '바벨 로우', group: '등' },
    { id: 'seated_row', name: '시티드 로우 (케이블/머신)', group: '등' },
    { id: 't_bar_row', name: '티바 로우 (머신/프리)', group: '등' },
    { id: 'high_row_machine', name: '하이 로우 머신', group: '등' },
    { id: 'mid_row_machine', name: '미드 로우 머신', group: '등' },
    { id: 'low_row_machine', name: '로우 로우 머신', group: '등' },
    { id: 'straight_arm_pulldown', name: '암 풀 다운', group: '등' },

    // 하체
    { id: 'squat', name: '스쿼트', group: '하체' },
    { id: 'front_squat', name: '프론트 스쿼트', group: '하체' },
    { id: 'v_squat', name: 'V-스쿼트 머신', group: '하체' },
    { id: 'hack_squat', name: '핵 스쿼트 머신', group: '하체' },
    { id: 'pendulum_squat', name: '펜듈럼 스쿼트', group: '하체' },
    { id: 'leg_press', name: '레그 프레스', group: '하체' },
    { id: 'leg_extension', name: '레그 익스텐션', group: '하체' },
    { id: 'leg_curl', name: '레그 컬 (라잉/시티드)', group: '하체' },
    { id: 'hip_thrust', name: '힙 쓰러스트 머신', group: '하체' },
    { id: 'inner_thigh', name: '이너 타이 (어덕터)', group: '하체' },
    { id: 'outer_thigh', name: '아우터 타이 (앱덕터)', group: '하체' },

    // 어깨
    { id: 'overhead_press', name: '오버헤드 프레스', group: '어깨' },
    { id: 'shoulder_press_machine', name: '숄더 프레스 머신', group: '어깨' },
    { id: 'lateral_raise', name: '사이드 레터럴 레이즈', group: '어깨' },
    { id: 'lateral_raise_machine', name: '레터럴 레이즈 머신', group: '어깨' },
    { id: 'reverse_pec_deck', name: '리버스 펙 덱 (후면)', group: '어깨' },
    { id: 'face_pull', name: '페이스 풀 (후면)', group: '어깨' },

    // 팔
    { id: 'barbell_curl', name: '바벨 컬', group: '팔' },
    { id: 'dumbbell_curl', name: '덤벨 컬', group: '팔' },
    { id: 'hammer_curl', name: '해머 컬', group: '팔' },
    { id: 'arm_curl_machine', name: '암 컬 머신', group: '팔' },
    { id: 'triceps_pushdown', name: '트라이셉스 푸시다운', group: '팔' },
    { id: 'overhead_triceps_extension', name: '오버헤드 익스텐션', group: '팔' },
    { id: 'triceps_extension_machine', name: '트라이셉스 머신', group: '팔' },

    // 코어/기타
    { id: 'crunch', name: '크런치', group: '코어' },
    { id: 'plank', name: '플랭크', group: '코어' },
    { id: 'leg_raise', name: '레그 레이즈', group: '코어' },
    { id: 'ab_rollout', name: '앱 롤아웃', group: '코어' }
]

export const GROUP_COLORS = {
    '하체': '#FF6B6B',
    '가슴': '#4ECDC4',
    '등': '#45B7D1',
    '어깨': '#96CEB4',
    '팔': '#FFD166',
    '코어': '#A06CD5'
}

export const DEFAULT_TEMPLATE = [
    { id: 'leg_press', name: '레그 프레스', group: '하체', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'leg_extension', name: '레그 익스텐션', group: '하체', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'chest_press', name: '체스트 프레스 (해머/호이스트)', group: '가슴', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'pec_deck_fly', name: '펙 덱 플라이', group: '가슴', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'lat_pulldown', name: '랫 풀 다운', group: '등', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'seated_row', name: '시티드 로우 (케이블/머신)', group: '등', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'shoulder_press_machine', name: '숄더 프레스 머신', group: '어깨', sets: 3, defaultReps: 10, defaultWeight: 20 },
    { id: 'reverse_pec_deck', name: '리버스 펙 덱 (후면)', group: '어깨', sets: 3, defaultReps: 10, defaultWeight: 20 },
]

export const PRESET_TEMPLATES = [
    {
        id: 'beginner_5',
        name: '👑 입문자용 전신 (가벼운 5종)',
        template: [
            { id: 'leg_press', name: '레그 프레스', group: '하체', sets: 3, defaultReps: 15, defaultWeight: 20 },
            { id: 'chest_press', name: '체스트 프레스 (해머/호이스트)', group: '가슴', sets: 3, defaultReps: 15, defaultWeight: 15 },
            { id: 'lat_pulldown', name: '랫 풀 다운', group: '등', sets: 3, defaultReps: 15, defaultWeight: 20 },
            { id: 'shoulder_press_machine', name: '숄더 프레스 머신', group: '어깨', sets: 3, defaultReps: 15, defaultWeight: 10 },
            { id: 'crunch', name: '크런치', group: '코어', sets: 3, defaultReps: 15, defaultWeight: 0 }
        ]
    },
    {
        id: 'beginner_8',
        name: '👑 초보자용 전신 (기본 8종)',
        template: [...DEFAULT_TEMPLATE]
    },
    {
        id: 'push_day',
        name: '🔥 미는 날 (가슴/어깨/삼두)',
        template: [
            { id: 'bench_press', name: '벤치 프레스', group: '가슴', sets: 5, defaultReps: 10, defaultWeight: 40 },
            { id: 'incline_press_machine', name: '인클라인 프레스 머신', group: '가슴', sets: 4, defaultReps: 12, defaultWeight: 30 },
            { id: 'pec_deck_fly', name: '펙 덱 플라이', group: '가슴', sets: 4, defaultReps: 15, defaultWeight: 20 },
            { id: 'overhead_press', name: '오버헤드 프레스', group: '어깨', sets: 4, defaultReps: 10, defaultWeight: 30 },
            { id: 'lateral_raise', name: '사이드 레터럴 레이즈', group: '어깨', sets: 5, defaultReps: 15, defaultWeight: 5 },
            { id: 'triceps_pushdown', name: '트라이셉스 푸시다운', group: '팔', sets: 4, defaultReps: 12, defaultWeight: 15 },
        ]
    },
    {
        id: 'pull_day',
        name: '🦍 당기는 날 (등/후면/이두)',
        template: [
            { id: 'deadlift', name: '데드리프트', group: '등', sets: 5, defaultReps: 5, defaultWeight: 80 },
            { id: 'lat_pulldown', name: '랫 풀 다운', group: '등', sets: 4, defaultReps: 12, defaultWeight: 40 },
            { id: 'seated_row', name: '시티드 로우 (케이블/머신)', group: '등', sets: 4, defaultReps: 12, defaultWeight: 40 },
            { id: 'straight_arm_pulldown', name: '암 풀 다운', group: '등', sets: 4, defaultReps: 15, defaultWeight: 20 },
            { id: 'face_pull', name: '페이스 풀 (후면)', group: '어깨', sets: 4, defaultReps: 15, defaultWeight: 15 },
            { id: 'dumbbell_curl', name: '덤벨 컬', group: '팔', sets: 4, defaultReps: 12, defaultWeight: 10 },
        ]
    },
    {
        id: 'leg_day',
        name: '🦵 하체 집중',
        template: [
            { id: 'squat', name: '스쿼트', group: '하체', sets: 5, defaultReps: 8, defaultWeight: 60 },
            { id: 'v_squat', name: 'V-스쿼트 머신', group: '하체', sets: 4, defaultReps: 10, defaultWeight: 40 },
            { id: 'leg_press', name: '레그 프레스', group: '하체', sets: 4, defaultReps: 12, defaultWeight: 100 },
            { id: 'leg_extension', name: '레그 익스텐션', group: '하체', sets: 4, defaultReps: 15, defaultWeight: 35 },
            { id: 'leg_curl', name: '레그 컬 (라잉/시티드)', group: '하체', sets: 4, defaultReps: 15, defaultWeight: 35 },
            { id: 'hip_thrust', name: '힙 쓰러스트 머신', group: '하체', sets: 4, defaultReps: 12, defaultWeight: 40 },
        ]
    }
]

// 기존 프리셋 배열을 요일별 객체(월수금)로 쉽게 변환해주는 유틸 함수
export function createWeeklyTemplateFromPreset(presetArray) {
    return {
        0: [], // 일
        1: [...presetArray], // 월
        2: [], // 화
        3: [...presetArray], // 수
        4: [], // 목
        5: [...presetArray], // 금
        6: []  // 토
    }
}

