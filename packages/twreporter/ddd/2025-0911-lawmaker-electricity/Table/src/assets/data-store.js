import { writable, readable, derived } from 'svelte/store';
import membersSpeechData_10 from './4.1_第10屆排行.json';
import membersIdentityData_10 from './4.1_立委身分.json';
import membersSpeechData_11 from './4.2_第11屆排行.json';
import membersIdentityData_11 from './4.2_立委身分.json';

// 保留身分資料為可寫 store，供其他元件（例如透過 membersIdentityByName）訂閱使用
export let membersIdentity = writable(membersIdentityData_11);

// 由身分名單建立姓名索引的派生 store
export const membersIdentityByName = derived(membersIdentity, ($list) => {
    const map = new Map();
    if (Array.isArray($list)) {
        for (const m of $list) {
            if (m && m.姓名) map.set(m.姓名, m);
        }
    }
    return map;
});

// 各屆資料映射
const speechByTerm = {
    10: membersSpeechData_10,
    11: membersSpeechData_11
};

const identityByTerm = {
    10: membersIdentityData_10,
    11: membersIdentityData_11
};

export function membersSpeech(term = 11) {
    const t = Number(term);
    const speech = speechByTerm[t] ?? membersSpeechData_11;
    const identity = identityByTerm[t] ?? membersIdentityData_11;
    membersIdentity.set(identity);
    return readable(speech);
}

