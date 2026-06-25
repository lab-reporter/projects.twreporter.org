# Data Pre-processing

## 地形資料準備

- 下載[內政部 20 公尺網格數值地形模型資料](https://data.gov.tw/dataset/35430)中，全台灣的地形資料 `.tif` 檔
- 使用[`tum-gis/cesium-terrain-builder-docker`](https://github.com/tum-gis/cesium-terrain-builder-docker)專案，將 `.tif` 檔案，切分成圖磚格式的 `.terrain` 檔案

````bash
docker run -it --name ctb \
    -v "./data:/data" \
  tumgis/ctb-quantized-mesh # 開啟 Docker 容器

ctb-tile -f Mesh -C -N -o terrain dem_20m.tif # 切分檔案
ctb-tile -f Mesh -C -N -o -l terrain dem_20m.tif # 生成圖層敘述檔 `layer.json`
```s
````

- 上傳到 GCS，網址會是：`https://{base}/terrain/{level}/{x}/{y}.terrain`，注意因為 CTB 產出的高度圖磚經過 gzip，所以需要設定 `content-encoding` Header 為 gzip

```bash
gcloud storage cp -r * gs://{bucket}/terrain/ --content-encoding=gzip
```
