# TRELLIS.2 분석 보고서: Image-to-3D 생성 모델

## 1. 개요 (Overview)
**TRELLIS.2**는 Microsoft에서 발표한 최신 3D 생성 인공지능 모델로, 이미지를 입력받아 고품질의 3D 자산(Asset)을 생성합니다. 40억 개의 파라미터를 가진 대규모 모델이며, 기존의 복잡한 3D 표현 방식의 한계를 극복하기 위해 'O-Voxel'이라는 새로운 구조를 도입했습니다.

## 2. 주요 기술적 특징
*   **O-Voxel 구조**: 전통적인 SDF(Signed Distance Field) 방식 대신 스파스 복셀(Sparse Voxel) 방식을 사용하여 옷감, 나뭇잎 같은 얇고 열린 표면이나 복잡한 내부 구조를 정확하게 표현할 수 있습니다.
*   **PBR(Physically Based Rendering) 재질**: 단순히 표면 색상만 입히는 것이 아니라, 금속성(Metallic), 거칠기(Roughness), 투명도(Opacity) 정보를 포함하여 렌더링 시 매우 사실적인 결과물을 제공합니다.
*   **압도적인 속도**: 최적화 단계 없이 직접 생성이 가능하여, NVIDIA H100 GPU 기준 약 3초(512 해상도)에서 60초(1536 해상도) 내에 결과물을 뽑아냅니다.

## 3. 설치 가이드 (Installation)

### 시스템 요구 사항
*   **운영체제**: Linux (Windows 미지원)
*   **GPU**: NVIDIA GPU, VRAM 24GB 이상 필수 (A100, H100 권장)
*   **필수 소프트웨어**: CUDA Toolkit 12.4, Python 3.8 이상, Conda

### 설치 단계
1.  **리포지토리 복제**:
    ```bash
    git clone -b main https://github.com/microsoft/TRELLIS.2.git --recursive
    cd TRELLIS.2
    ```
2.  **자동 설치 스크립트 실행**:
    기존 환경을 오염시키지 않도록 새로운 Conda 환경을 생성하며 설치하는 것을 권장합니다.
    ```bash
    . ./setup.sh --new-env --basic --flash-attn --nvdiffrast --nvdiffrec --cumesh --o-voxel --flexgemm
    ```

## 4. 사용 방법 (Usage)

### 이미지-to-3D 파이프라인 (Python)
```python
from PIL import Image
from trellis2.pipelines import Trellis2ImageTo3DPipeline
import o_voxel

# 모델 로드 (HuggingFace에서 4B 모델 자동 다운로드)
pipeline = Trellis2ImageTo3DPipeline.from_pretrained("microsoft/TRELLIS.2-4B")
pipeline.cuda()

# 이미지 생성 실행
image = Image.open("input_image.png")
mesh = pipeline.run(image)[0]

# GLB 파일로 내보내기
glb = o_voxel.postprocess.to_glb(
    vertices=mesh.vertices,
    faces=mesh.faces,
    attr_volume=mesh.attrs,
    coords=mesh.coords,
    attr_layout=mesh.layout,
    voxel_size=mesh.voxel_size,
    remesh=True
)
glb.export("output.glb")
```

## 5. 결론 및 제언
TRELLIS.2는 상업적 수준의 3D 자산을 빠르게 생성해야 하는 환경에 매우 적합합니다. 다만, **24GB 이상의 높은 VRAM**과 **Linux 환경**이 필수적이므로, 일반 데스크탑보다는 워크스테이션이나 클라우드 GPU(A100 등) 환경에서 구동하는 것이 바람직합니다.
