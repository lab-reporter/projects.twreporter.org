# 2025-12-roundabouts

## 使用文章／專題

- [【Data Reporter】全台圓環大體檢（上）：哪些圓環頻傳傷亡事故？癥結怎解？](https://www.twreporter.org/a/taiwan-roundabouts-reckoning-1)
- [【Data Reporter】全台圓環大體檢（下）：從首座螺旋圓環誕生，看人本交通新設計如何落地](https://www.twreporter.org/a/taiwan-roundabouts-reckoning-2)

## twreporter-layered-photos

### Usage

#### Import script tag

```html
<script src="https://projects.twreporter.org/twreporter/ddd/2025-12-roundabouts/js/index-{timestamp}.js"></script>
```

#### Use in HTML

This is a standard [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), you can use it directly in your html like so:

```html
<div>... Existing html</div>

<h3>Tabs</h3>

<twreporter-layered-photos
    name="<title>"
    base="<base_img_src>"
    layers="
        <tab_name_1> <img_src_1> <legend_src_1>,
        <tab_name_2> <img_src_2> <legend_src_2>,
    "
    footnotes="<text_1>,<text_2>"
></twreporter-layered-photos>

<h3>Groups & Tabs</h3>

<twreporter-layered-photos
    name="<title>"
    groups="<group_id_1> <group_name_1>, <group_id_2> <group_name_2>"
    base-group_id_1="<base_img_src>"
    layers-group_id_1="
        <tab_name_1> <img_src_1> <legend_src_1>,
        <tab_name_2> <img_src_2> <legend_src_2>,
    "
    base-group_id_2="<base_img_src>"
    layers-group_id_2="
        <tab_name_1> <img_src_1> <legend_src_1>,
        <tab_name_2> <img_src_2> <legend_src_2>,
    "
    footnotes="<text_1>,<text_2>"
></twreporter-layered-photos>

<div>... Existing html</div>
```
