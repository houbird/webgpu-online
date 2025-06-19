# 系統規劃：webgpu-online

## 一、專案願景與目標
- **願景**：打造可在瀏覽器中高效渲染並評測 GPU 效能的 3D 前端應用，並針對 NVIDIA Orin 平台進行特殊最佳化。  
- **主要目標**  
  1. 即時載入並渲染 glTF/OBJ 模型（預設 models/water-bottle.glb），並持續自轉展示。  
  2. 顯示即時 FPS（畫面左上）與渲染模式切換（畫面右上：OpenGL/WebGPU）。  
  3. 實作 GPU 性能跑分（benchmarking），支援 WebGPU API，並優化 Orin 平台。  
  4. 採用原生 WebGPU API 結合 Three.js 或 Babylon.js，並以 Tailwind CSS（CDN）快速構建響應式界面。  
  5. 部署於 GitHub Pages，實現零維運維的靜態網站託管。

---

## 二、功能需求
1. **模型管理**  
   - 自動載入 models/water-bottle.glb  
   - 支援 glTF、OBJ 兩種格式擴展  
2. **渲染控制**  
   - 初始自轉動畫，可透過 UI 停止／調速  
   - 左上顯示即時 FPS；右上切換 OpenGL(WebGL)／WebGPU 模式  
3. **效能跑分**  
   - 在指定模式下執行標準化測試場景（多物件、Compute Shader）  
   - 顯示帧率平均值、最高值、最低值、渲染時間分佈  
   - 針對 NVIDIA Orin 平台進行 Shader 與渲染管線優化  
4. **響應式介面**  
   - Tailwind CSS（CDN）實現桌面／行動裝置適配  
   - 模組化 UI 元件：切換按鈕、數據面板、加載進度指示  

---

## 三、技術架構

```mermaid
flowchart LR
  subgraph UI 層
    A[Index.html + Tailwind CSS] --> B[Mode 切換按鈕]
    A --> C[FPS 顯示面板]
  end

  subgraph 應用層
    D[Main.js] --> E[ModelLoader 模組]
    D --> F[Renderer 控制器]
    D --> G[BenchmarkEngine]
    D --> H[UIController]
  end

  subgraph GPU 層
    F --> I[WebGPU API]
    F --> J[WebGL (OpenGL) 實現]
    G --> I
  end

  E --> K[models/water-bottle.glb]
````

* **UI 層**：

  * `index.html`：靜態頁面骨架
  * Tailwind CSS（CDN）：響應式樣式
  * UI 元件：FPS 面板、模式切換按鈕、Benchmark 按鈕、加載指示
* **應用層**：

  * `Main.js`：入口，初始化各模組與渲染迴圈
  * `ModelLoader`：3D 模型載入與格式支援 (glTF/OBJ)
  * `Renderer`：根據使用者選擇呼叫 WebGPU / WebGL 渲染管線
  * `BenchmarkEngine`：整合 Compute Shader、渲染場景，收集跑分數據
  * `UIController`：綁定 UI 事件與應用層邏輯
* **GPU 層**：

  * **WebGPU API**：原生調用，進行 Buffer、Shader、Pipeline 管理
  * **WebGL (OpenGL)**：兼容模式，可作為性能對比

---

## 四、模組分工與檔案結構

```
/
├── index.html
├── styles/  
│   └── tailwind.css (CDN 引入)
├── src/
│   ├── main.js
│   ├── modules/
│   │   ├── ModelLoader.js
│   │   ├── Renderer.js
│   │   ├── BenchmarkEngine.js
│   │   └── UIController.js
│   └── shaders/
│       ├── compute_orin.wgsl
│       └── standard_vertex.wgsl
├── models/
│   └── water-bottle.glb
├── assets/ (可擴充材質、貼圖)
└── .github/
    └── workflows/
        └── deploy.yml
```

* **ModelLoader.js**：封裝 glTF/OBJ 解析、緩存、錯誤處理。
* **Renderer.js**：動態建立 WebGPU Pipeline／WebGL Context，管理繪製迴圈。
* **BenchmarkEngine.js**：定義場景、Compute Shader 測試腳本，計算統計數據。
* **UIController.js**：監聽 DOM 事件，更新參數、觸發渲染模式與跑分流程。

---

## 五、持續整合與部署

1. **GitHub Actions (deploy.yml)**

   * 觸發條件：`push` 至 `main` 分支
   * 步驟：

     1. Checkout
     2. 安裝依賴（如有）
     3. 簡易測試（Lint、型別檢查）
     4. 部署到 GitHub Pages (`peaceiris/actions-gh-pages@v3`)
2. **版本管理**

   * `semver`：標記版本，搭配 Releases
   * `CHANGELOG.md`：記錄功能新增與修正

---

## 六、最佳化策略（針對 NVIDIA Orin）

* **Compute Shader 優化**

  * 使用 WGSL 實作並行度高的運算任務
  * 減少 Pipeline 切換，整合多重渲染通道
* **記憶體管理**

  * 預先分配大 buffer，避免動態擴容
  * 合理使用 Mappable Buffer 加速資料傳輸
* **效能監測**

  * 收集時間戳、CommandBuffer 執行時間
  * 分析瓶頸，微調束縛點（BindGroup）

---

## 七、測試計畫

* **單元測試**：ModelLoader、UIController 行為驗證 (Jest)
* **效能測試**：自動化跑分腳本，將結果輸出 JSON
* **跨瀏覽器驗證**：Chrome（Canary、Stable）、Edge、Firefox

---

## 八、安全與維運

* **CSP（Content Security Policy）**：防止外部腳本注入
* **HTTPS 強制**：GitHub Pages 預設啟用
* **版本回滾**：保留前 5 筆部署紀錄，必要時快速回退

---

## 九、可擴展性

* **多模型支援**：UI 下拉選單動態載入 models/ 目錄清單
* **場景模式**：新增多種跑分場景 (光影、Compute-heavy)
* **後端連接**：可選擇串接分析伺服器，上傳 benchmark 資料
