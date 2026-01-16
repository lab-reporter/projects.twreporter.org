<script>
	import Header from './lib/Header.svelte';
	import Footer from './lib/Footer.svelte';
	import WordCloud from './lib/WordCloud.svelte';
	import rawData1A from './assets/1A_電力問題_文字雲.json';
	import rawData1B from './assets/1B_電力問題_文字雲.json';
	import rawData2A from './assets/2A_油電價格_文字雲.json';
	import rawData2B from './assets/2B_油電價格_文字雲.json';
	import rawData3A from './assets/3A_民眾黨_電力問題_文字雲.json';
	import rawData3B from './assets/3B_民眾黨_電力問題_文字雲.json';
	import rawData4A from './assets/4A_民眾黨_太陽光電發展_文字雲.json';
	import rawData4B from './assets/4B_民眾黨_太陽光電發展_文字雲.json';

	const searchParams = new URLSearchParams(window.location.search);
	const party = searchParams.get('party');

	let title = $derived(
		party === 'tpp'
			? '民眾黨近兩屆立委如何談電力問題與太陽光電發展？'
			: '2022年與2024年3月電力治理議題關鍵字差異'
	);
	let subtitle;
	let footer = $derived(
		party === 'tpp'
			? [
					'註1：截至2025年9月初，立法院第3會期公報未完整公布，本表僅統計2020年至2024年第2會期結束',
					'註2：文字雲下方黑字為各屆議題特色詞彙，方法論詳見報導內文',
					'資料來源：立法院議事公報、報導者觀測站',
					'資料整理：簡毅慧  ｜  設計：江世民'
				]
			: [
					'註：截至2025年9月初，立法院第3會期公報未完整公布，本表僅統計2020年至2024年第2會期結束',
					'資料來源：立法院議事公報、報導者觀測站',
					'資料整理：簡毅慧  ｜  設計：江世民'
				]
	);
	const formatWords = (data) =>
		data.map((d) => ({
			text: d.token,
			value: Number(d.count)
		}));

	const dataA = party === 'tpp' ? rawData3A : rawData1A;
	const dataB = party === 'tpp' ? rawData3B : rawData1B;
	const dataC = party === 'tpp' ? rawData4A : rawData2A;
	const dataD = party === 'tpp' ? rawData4B : rawData2B;
	const annotateA =
		party === 'tpp'
			? '【 電網、儲能、智慧、損失、用電大戶 】'
			: '【 關注303大停電、電網韌性等面向 】';
	const annotateB =
		party === 'tpp' ? '【 農業、儲能、減碳、碳費、轉型 】' : '【 關注電價調漲、台電虧損 】';
	const annotateC =
		party === 'tpp'
			? '【 弊案、日本九州、環評、防爆、電價 】'
			: '【 關注俄烏戰爭對油電價格的影響 】';
	const annotateD =
		party === 'tpp'
			? '【 電價、聯合再生、漏洞、弊案、台南 】'
			: '【 關注電價調漲，對物價及通膨的影響 】';
	const topicA = party === 'tpp' ? '電力問題' : '電力問題';
	const topicB = party === 'tpp' ? '太陽光電發展' : '油電價格';
	const timeA = party === 'tpp' ? '第10屆' : '2022年3月';
	const timeB = party === 'tpp' ? '第11屆' : '2024年3月';
	const colorA = party === 'tpp' ? '#b58f5b' : '#b58f5b';
	const colorB = party === 'tpp' ? '#A27DB5' : '#748B80';
	const colorAhue = party === 'tpp' ? 35 : 35;
	const colorBhue = party === 'tpp' ? 280 : 150;
	const wcHeight = party === 'tpp' ? 288 : 305;
	const wcWidth = party === 'tpp' ? 320 : 320;

	let bodyHeight = $state(window.document.body.clientHeight);
	$effect(() => {
		parent.postMessage({ bodyHeight, source: `twreporter-wordcloud-${party}` }, '*'); // 跟 iframe id 一樣
	});
</script>

<svelte:body bind:clientHeight={bodyHeight} />
<div class="container">
	<Header {title} {subtitle} />
	<div class="chartContainer">
		<div class="desktop-only">
			<table class="cloudsContainer">
				<thead>
					<tr>
						<th></th>
						<th>{timeA}</th>
						<th>{timeB}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th class="groupTopic" style="background-color:{colorA};">{topicA}</th>
						<td>
							<WordCloud
								words={formatWords(dataA)}
								height={wcHeight}
								width={wcWidth}
								colH={colorAhue}
								colS={65}
							/>
							<p>{annotateA}</p>
						</td>
						<td>
							<WordCloud
								words={formatWords(dataB)}
								height={wcHeight}
								width={wcWidth}
								colH={colorAhue}
								colS={65}
							/>
							<p>{annotateB}</p>
						</td>
					</tr>
					<tr>
						<th rowspan="4" class="groupTopic" style="background-color:{colorB};"
							>{topicB}</th
						>
						<td>
							<WordCloud
								words={formatWords(dataC)}
								height={wcHeight}
								width={wcWidth}
								colH={colorBhue}
								colS={15}
							/>
							<p>{annotateC}</p>
						</td>
						<td>
							<WordCloud
								words={formatWords(dataD)}
								height={wcHeight}
								width={wcWidth}
								colH={colorBhue}
								colS={15}
							/>
							<p>{annotateD}</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mobile-only">
			<table class="cloudsContainer">
				<thead>
					<tr>
						<th rowspan="4" class="groupTopic" style="background-color:{colorA};"
							>{topicA}</th
						>
						<th>{timeA}</th>
					</tr>
					<tr>
						<th>
							<WordCloud
								words={formatWords(dataA)}
								height={240}
								width={800}
								colH={colorAhue}
								colS={65}
							/>
							<p>{annotateA}</p>
						</th>
					</tr>
					<tr>
						<th>{timeB}</th>
					</tr>
					<tr>
						<th>
							<WordCloud
								words={formatWords(dataB)}
								height={240}
								width={800}
								colH={colorAhue}
								colS={65}
							/>
							<p>{annotateB}</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td rowspan="4" class="groupTopic" style="background-color:{colorB};"
							>{topicB}</td
						>
						<td>{timeA}</td>
					</tr>
					<tr>
						<td>
							<WordCloud
								words={formatWords(dataC)}
								height={240}
								width={800}
								colH={colorBhue}
								colS={15}
							/>
							<p>{annotateC}</p>
						</td>
					</tr>
					<tr>
						<td>{timeB}</td>
					</tr>
					<tr>
						<td>
							<WordCloud
								words={formatWords(dataD)}
								height={240}
								width={800}
								colH={colorBhue}
								colS={15}
							/>
							<p>{annotateD}</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<Footer {footer} />
</div>
