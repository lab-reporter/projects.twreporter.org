# twreporter-layered-photos

## Import script tag

```html
<script src="https://projects.twreporter.org/twreporter/ddd/2025-12-roundabouts/js/index.js"></script>
```

## Usage

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
