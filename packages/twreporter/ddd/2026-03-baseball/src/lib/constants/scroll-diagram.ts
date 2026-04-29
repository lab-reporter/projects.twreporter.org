export type NodeMeta = {
  id: string;
  label: string;
  youtube?: string;
};

export type NodeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

export type PathType = "direct" | "overview";

export type ScrollStep = {
  to: string;
  path: PathType;
  scale?: number;
  text?: string;
  audios?: { src: string; name: string }[];
};

export const nodes: NodeMeta[] = [
  // ── 1. 影視配樂 ──
  { id: "node__1", label: "影視配樂" },
  { id: "node__1-a", label: "布袋戲" },
  {
    id: "node__1-a-1",
    label: "陳金鋒",
    youtube: "https://www.youtube.com/watch?v=qQ6saII8jpI",
  },
  {
    id: "node__1-a-2",
    label: "蔣少宏",
    youtube: "https://www.youtube.com/watch?v=Vh-RyAqICzo",
  },
  { id: "node__1-b", label: "動作電影" },
  {
    id: "node__1-b-1",
    label: "吉力吉撈・鞏冠",
    youtube: "https://www.youtube.com/watch?v=KavXuXfNRRI",
  },
  {
    id: "node__1-b-2",
    label: "林安可",
    youtube: "https://www.youtube.com/watch?v=J03Fqg2mEp4",
  },
  {
    id: "node__1-b-3",
    label: "林智勝",
    youtube: "https://www.youtube.com/watch?v=NIjbvfAI32E",
  },
  { id: "node__1-c", label: "日本動漫與電玩" },
  {
    id: "node__1-c-1",
    label: "林立",
    youtube: "https://www.youtube.com/watch?v=zg81d2OoLng",
  },
  {
    id: "node__1-c-2",
    label: "戴培峰",
    youtube: "https://www.youtube.com/watch?v=L_E1t-rxpX4",
  },
  {
    id: "node__1-c-3",
    label: "朱育賢",
    youtube: "https://www.youtube.com/watch?v=LwRkCUYS3q0",
  },
  {
    id: "node__1-c-4",
    label: "高志綱",
    youtube: "https://www.youtube.com/watch?v=D15POH1zy4M",
  },
  {
    id: "node__1-c-5",
    label: "葉君璋",
    youtube: "https://www.youtube.com/watch?v=EAw8bbP7Aa4",
  },

  // ── 2. 現代流行樂 ──
  { id: "node__2", label: "現代流行樂" },
  { id: "node__2-a", label: "韓國流行" },
  {
    id: "node__2-a-1",
    label: "陳晨威",
    youtube: "https://www.youtube.com/watch?v=RVgwPh5_i7w",
  },
  {
    id: "node__2-a-2",
    label: "樂天桃猿〈勝利飛船〉",
    youtube: "https://www.youtube.com/watch?v=ZP23iaWXDh8",
  },
  { id: "node__2-b", label: "日本流行" },
  {
    id: "node__2-b-1",
    label: "林子偉",
    youtube: "https://www.youtube.com/watch?v=j4Eg-pWYs7g",
  },
  {
    id: "node__2-b-2",
    label: "吳念庭",
    youtube: "https://www.youtube.com/watch?v=wVAyLHw611o",
  },
  {
    id: "node__2-b-3",
    label: "張政禹",
    youtube: "https://www.youtube.com/watch?v=AFDo_aDQh5c",
  },
  {
    id: "node__2-b-4",
    label: "高國輝",
    youtube: "https://www.youtube.com/watch?v=YYeNHy0p7rM",
  },
  { id: "node__2-c", label: "華語流行" },
  {
    id: "node__2-c-1",
    label: "李凱威",
    youtube: "https://www.youtube.com/watch?v=6YgSjoa9Vs8",
  },
  {
    id: "node__2-c-2",
    label: "林佳緯",
    youtube: "https://www.youtube.com/watch?v=RMoRZ0bTT-8",
  },
  {
    id: "node__2-c-3",
    label: "彭政閔",
    youtube: "https://www.youtube.com/watch?v=5ed1CfOXrvQ",
  },
  {
    id: "node__2-c-4",
    label: "周思齊",
    youtube:
      "https://www.youtube.com/watch?v=GYbY3CakZ90&pp=ygUT5ZGo5oCd6b2KIOaHieaPtOabsg%3D%3D",
  },

  // ── 3. 世界音樂 ──
  { id: "node__3", label: "世界音樂" },
  { id: "node__3-a", label: "台灣民謠、民俗音樂" },
  {
    id: "node__3-a-1",
    label: "丟丟銅仔",
    youtube:
      "https://www.youtube.com/watch?v=ENZXGMJRLuw&pp=ygUM5Lif5Lif6YqF5LuU",
  },
  {
    id: "node__3-a-2",
    label: "燒肉粽",
    youtube: "https://www.youtube.com/watch?v=m45fUda0xP4&pp=ygUJ54eS6IKJ57K9",
  },
  {
    id: "node__3-a-3",
    label: "四季紅",
    youtube: "https://www.youtube.com/watch?v=P_0vgHZDRoM&pp=ygUJ5Zub5a2j57SF",
  },
  { id: "node__3-b", label: "拉丁" },
  {
    id: "node__3-b-1",
    label: "潘傑楷",
    youtube: "https://www.youtube.com/watch?v=EaMusW9DM6I",
  },
  {
    id: "node__3-b-2",
    label: "李宗賢",
    youtube: "https://www.youtube.com/watch?v=Iqa1-myBLVk",
  },
  { id: "node__3-c", label: "印度" },
  {
    id: "node__3-c-1",
    label: "統一7-ELEVEn獅〈登峰造極〉",
    youtube: "https://www.youtube.com/watch?v=thGYmaQn4D0",
  },
  {
    id: "node__3-c-2",
    label: "台鋼雄鷹〈氣蓋山河〉",
    youtube: "https://www.youtube.com/watch?v=X1fxomeRgTk",
  },
  { id: "node__3-d", label: "俄羅斯" },
  {
    id: "node__3-d-1",
    label: "台鋼雄鷹〈氣蓋山河〉",
    youtube: "https://www.youtube.com/watch?v=X1fxomeRgTk",
  },

  // ── 4. 古典 ──
  { id: "node__4", label: "古典" },
  { id: "node__4-a", label: "進行曲" },
  {
    id: "node__4-a-1",
    label: "張育成",
    youtube: "https://www.youtube.com/watch?v=ZdAvmv8cXvg",
  },
  {
    id: "node__4-a-2",
    label: "江坤宇",
    youtube: "https://www.youtube.com/watch?v=gIdvP3d4oWY",
  },
  {
    id: "node__4-a-3",
    label: "岳東華",
    youtube: "https://www.youtube.com/watch?v=oJKuMWYG_rs",
  },
  {
    id: "node__4-a-4",
    label: "高宇杰",
    youtube: "https://www.youtube.com/watch?v=-DbCVWVngZ0",
  },
  {
    id: "node__4-a-5",
    label: "中信兄弟〈戰歌〉",
    youtube: "https://www.youtube.com/watch?v=GBxFcKwrxN8",
  },
  {
    id: "node__4-a-6",
    label: "布雷T.B",
    youtube: "https://www.youtube.com/watch?v=RbQK-L5uFl8",
  },

  // ── 5. 鄉村 ──
  { id: "node__5", label: "鄉村" },
  {
    id: "node__5-1",
    label: "統一7-ELEVEn獅〈必勝吞霸歌〉",
    youtube: "https://www.youtube.com/watch?v=IX6JFcVTfzQ",
  },
  {
    id: "node__5-2",
    label: "陳重羽",
    youtube: "https://www.youtube.com/watch?v=CyunR-cb1Uw",
  },
  { id: "node__5-a", label: "兒歌" },
  {
    id: "node__5-a-1",
    label: "大力水手",
    youtube: "https://www.youtube.com/watch?v=jzSddlZKc8M",
  },
  {
    id: "node__5-a-2",
    label: "王老先生有塊地",
    youtube:
      "https://www.youtube.com/watch?v=_6HzoUcx3eo&pp=ygUYT2xkIE1hY0RvbmFsZCBIYWQgYSBGYXJt",
  },
  {
    id: "node__5-a-3",
    label: "伊比呀呀",
    youtube: "https://www.youtube.com/watch?v=CeXXT2MRlv8",
  },

  // ── 6. 藍調 ──
  { id: "node__6", label: "藍調" },
  {
    id: "node__6-a",
    label: "搖滾",
  },
  {
    id: "node__6-a-i",
    label: "硬式搖滾",
    youtube:
      "https://www.youtube.com/watch?v=rMbATaj7Il8&list=PLb15rbk6I4pP7uge-Rg8Y9nTut0Xj_AIE",
  },
  {
    id: "node__6-a-i-1",
    label: "中信兄弟〈黃潮降臨〉",
    youtube: "https://www.youtube.com/watch?v=cEggZPRUk2o",
  },
  {
    id: "node__6-a-i-2",
    label: "味全龍〈Red不可擋〉",
    youtube: "https://www.youtube.com/watch?v=SX4B4GOv_ng",
  },
  {
    id: "node__6-a-i-3",
    label: "陳文杰",
    youtube: "https://www.youtube.com/watch?v=bEASXlL8aqk",
  },
  {
    id: "node__6-a-i-4",
    label: "邱智呈",
    youtube: "https://www.youtube.com/watch?v=zdDfiFrKA7U",
  },
  {
    id: "node__6-a-i-5",
    label: "中信兄弟〈戰歌〉",
    youtube: "https://www.youtube.com/watch?v=GBxFcKwrxN8",
  },
  {
    id: "node__6-a-i-6",
    label: "張建銘（富邦時期）",
    youtube: "https://www.youtube.com/watch?v=EwJ8aaVEaGw",
  },
  {
    id: "node__6-a-i-7",
    label: "陳江和",
    youtube: "https://www.youtube.com/watch?v=5fxg6aoNosA",
  },
  {
    id: "node__6-a-ii",
    label: "金屬樂",
    youtube:
      "https://www.youtube.com/watch?v=9kgQQuPZ8K0&list=PLb15rbk6I4pNEl9_7vATYhtyrCc0NcPR7",
  },
  {
    id: "node__6-a-ii-1",
    label: "王博玄",
    youtube: "https://www.youtube.com/watch?v=gKmnK_griFc",
  },
  {
    id: "node__6-a-ii-2",
    label: "味全龍〈遍地開花〉",
    youtube: "https://www.youtube.com/watch?v=1Shq2Z-U0f0",
  },
  { id: "node__6-a-iii", label: "流行搖滾" },
  {
    id: "node__6-a-iii-1",
    label: "陳傑憲",
    youtube: "https://www.youtube.com/watch?v=wy1aD9rCL-M",
  },
  {
    id: "node__6-a-iii-2",
    label: "宋晟睿",
    youtube: "https://www.youtube.com/watch?v=Ypyo3T820ck",
  },
  {
    id: "node__6-a-iii-3",
    label: "統一7-ELEVEn獅〈統一尚勇〉",
    youtube: "https://www.youtube.com/watch?v=rXIBzxbTctk",
  },
  { id: "node__6-b", label: "放克" },
  { id: "node__6-b-i", label: "迪斯可" },
  {
    id: "node__6-b-i-1",
    label: "張建銘（興農時期）",
    youtube:
      "https://www.youtube.com/watch?v=ARABESYBOig&pp=ygUa5by15bu66YqYIOiIiOi-siDmh4nmj7Tmm7I%3D",
  },
  { id: "node__6-b-i-1-a", label: "電子" },
  {
    id: "node__6-b-i-1-a-1",
    label: "Eurobeat",
    youtube: "https://www.youtube.com/watch?v=NNaJxMutEIE",
  },
  {
    id: "node__6-b-i-1-a-1-1",
    label: "富邦悍將〈藍色狂潮〉",
    youtube: "https://www.youtube.com/watch?v=veHNDZ3lFCA",
  },
  {
    id: "node__6-b-i-1-a-2",
    label: "Trance",
    youtube: "https://www.youtube.com/watch?v=y6120QOlsfU",
  },
  {
    id: "node__6-b-i-1-a-2-1",
    label: "富邦悍將〈超強一擊〉",
    youtube: "https://www.youtube.com/watch?v=-lxvOIzqMxY",
  },
];

export const steps: ScrollStep[] = [
  // Section 1
  { to: "node__", path: "direct" },
  {
    to: "node__1-b",
    path: "direct",
    text: "從吉力吉撈・鞏冠的「西部牛仔」風到大師兄林智勝《少林足球》主題曲、林立《洛克人2》電玩配樂，影視與動漫、電玩一直是台灣應援曲的靈感來源大宗。",
    audios: [
      {
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/D01/02.mp3",
        name: "統一獅「林安可」應援曲",
      },
    ],
  },
  { to: "node__1", path: "direct" },
  { to: "node__2", path: "direct" },

  // Section 2
  {
    to: "node__3",
    path: "direct",
    text: "其實台灣應援曲中，不只有本土元素，還藏著世界各文化圈獨有的音色、節奏、音程結構。",
  },
  { to: "node__3", path: "direct" },

  // Section 3
  {
    to: "node__4",
    path: "direct",
    text: "進一步以「樂種」進行分類，台灣重砲手們，以及歷史悠久的中信兄弟，依然保持著從古典樂延伸的進行曲、軍歌風格。",
    audios: [
      {
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/D01/03.mp3",
        name: "中信兄弟「江坤宇」應援曲",
      },
    ],
  },
  { to: "node__4", path: "direct" },

  // Section 4
  {
    to: "node__5",
    path: "direct",
    text: "構成台灣應援曲的一大根基，還有職棒早期大量由歐美民謠、童謠改編的「傳統應援」。",
  },
  { to: "node__5", path: "direct" },

  // Section 5
  {
    to: "node__6-a",
    path: "direct",
    text: "美國「藍調音樂」身為現代流行樂種的根源，自然也是棒球應援曲的重要支派，尤其在台灣進入「現代應援」時期後，大量以電吉他編曲的音樂，成為當代棒球場的核心聲響。",
  },
  { to: "node__6-a", path: "direct" },

  // Section 6
  {
    to: "node__6-b-i-1-a",
    path: "direct",
    text: "近年球場硬體設備提升，應援又有舞蹈需求，以電子樂構成主旋律，融合電吉他、爵士鼓加強熱血感的樂曲也開始出現。",
  },
  { to: "node__6-b-i-1-a", path: "direct" },
  { to: "node__", path: "direct" },
  { to: "node__", path: "direct" },
];
