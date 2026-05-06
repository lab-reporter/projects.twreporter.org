<script>
    import ActionButton from './ActionButton.svelte'
    import Button from './Button.svelte'
    import MaterialSymbols from './icons/MaterialSymbols.svelte'
    import Panel from './Panel.svelte'
</script>

<Panel variant="top"
    ><div class="tools">
        <div>
            <ActionButton label="儲存">
                <MaterialSymbols name="save" />
            </ActionButton>
            <ActionButton label="復原">
                <MaterialSymbols name="undo" />
            </ActionButton>
            <ActionButton label="重做">
                <MaterialSymbols name="redo" />
            </ActionButton>
        </div>
        <div>
            <ActionButton label="Popup">
                <MaterialSymbols name="right_click" />
            </ActionButton>
            <ActionButton label="像素｜比例"></ActionButton>
            <ActionButton label="電腦">
                <MaterialSymbols name="computer" />
            </ActionButton>
            <ActionButton label="行動裝置">
                <MaterialSymbols name="mobile" />
            </ActionButton>
            <ActionButton label="社群圖卡">
                <MaterialSymbols name="contacts" />
            </ActionButton>
        </div>
        <div>
            <Button variant="outlined">匯出圖檔</Button>
            <Button variant="filled">嵌入碼</Button>
        </div>
    </div></Panel
>

<style>
    .tools {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tools > div {
        display: flex;
        gap: 10px;
    }
</style>
