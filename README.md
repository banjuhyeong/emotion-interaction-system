# Emotion Interaction System

Hybrid Facial Emotion Recognition with Ensemble, Threshold Calibration, and GPT-based Interactive Feedback

## Overview

본 프로젝트는 비정형 얼굴 이미지 기반 감정 인식 모델을 활용해  
사용자의 표정 감정을 분석하고, 상황과 감정 결과에 따라 서로 다른 피드백을 제공하는  
감정 기반 인터랙션 시스템입니다.

단순 감정 분류를 넘어,

- GPT 기반 상황 생성
- 감정 기반 피드백 생성
- 반복형 감정 흐름 분석
- 인터랙션 구조 확장

까지 연결하는 것을 목표로 했습니다.

---

## System Workflow
![Uploading workflow.png…]()

```text
[1] GPT 상황 생성
    ↓
[2] 사용자 표정 이미지 업로드
    ↓
[3] 얼굴 검출 및 crop
    ↓
[4] 감정 인식 모델 추론
    - ViT
    - SigLIP
    - EfficientNet
    - ResNet Ensemble
    ↓
[5] Threshold 기반 후처리
    ↓
[6] 감정별 결과 분기
    ↓
[7] GPT 기반 감정 피드백 생성
    ↓
[8] 결과 출력 및 다음 상호작용 진행

Modeling
Baseline
ResNet50 baseline
validation accuracy ≈ 0.36
Backbone Expansion
ViT
EfficientNet
SigLIP
ResNet
Final Ensemble
ViT + SigLIP + EfficientNet + ResNet
weighted ensemble
threshold calibration
TTA
face crop
Final Performance
validation accuracy ≈ 0.8358
panic / sadness confusion 개선
Key Features
Emotion-based interaction
GPT feedback generation
Threshold calibration
Ensemble modeling
Face crop preprocessing
Interactive feedback flow
Tech Stack
Backend
Flask
Python
OpenAI API
Frontend
React
Vite
AI / Deep Learning
PyTorch
TensorFlow
Transformers
ViT
SigLIP
EfficientNet
Service Demo

서비스 화면 및 workflow 이미지는 assets 폴더에 포함 예정.

Additional Analysis
confusion matrix analysis
threshold calibration
ensemble ablation
latency benchmark
GPT comparison
Future Work
반복형 감정 인터랙션 강화
이전 감정 반응 기반 다음 상황 생성
감정 흐름 분석 리포트 생성
GPT 기반 동적 상호작용 확장
Reference

Some modeling workflows and inference pipeline ideas were referenced from:

https://github.com/moneyally/yua-encoder

The interaction flow, GPT feedback structure, frontend/backend integration, and service implementation were independently extended for this project.


---

# 5. 아래로 스크롤

클릭:

```text id="8knmdo"
Commit changes


