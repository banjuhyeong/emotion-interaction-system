# Emotion Interaction System

Hybrid Facial Emotion Recognition with Ensemble, Threshold Calibration, and GPT-based Interactive Feedback

![workflow](assets/workflow.png)

본 프로젝트는 비정형 얼굴 이미지 기반 감정 인식 모델을 활용해  
상황과 감정 결과에 따라 서로 다른 피드백을 제공하는  
감정 기반 인터랙션 시스템입니다.

---

# Project Overview

단순 감정 분류를 넘어,

- GPT 기반 상황 생성
- 감정 기반 피드백 생성
- 반복형 감정 흐름 분석
- 인터랙션 구조 확장

까지 연결하는 것을 목표로 했습니다.

---

# System Workflow

전체 흐름

사용자 입력  
→ 얼굴 전처리  
→ Ensemble 감정 분석  
→ GPT 피드백 생성  
→ 반복형 인터랙션 진행

---

# Service Implementation

## Main Interaction Screen

![main](assets/service_main.png)

### Features

- GPT 기반 상황 제시
- 감정 힌트 기능
- 사용자 이미지 업로드
- 반복형 인터랙션 구조

---

# Emotion Analysis Result

![result](assets/service_result.png)

### Output Information

- 기대 감정 출력
- 예측 감정 분석
- confidence score 제공
- 감정 기반 피드백 생성

---

# Feedback Branching

![feedback](assets/service_feedback.png)

### Feedback Logic

- 감정 일치 여부에 따라
  피드백 방향 변화

- 공감 / 긍정 강화 /
  감정 상태 고려 반응 생성

- 이전 감정 흐름 기반
  상호작용 확장 고려

---

# Final Summary

![summary](assets/service_summary.png)

### Final Interaction Goal

- 반복형 감정 인터랙션
- 감정 흐름 기록
- 종합 감정 피드백 제공
- 사용자 참여 강화

---

# Key Improvements

## Emotion Interaction Expansion

기존 단순 감정 분류 구조에서:

Emotion Classification  
→ GPT Feedback  
→ Multi-turn Interaction  
→ Emotion Flow Tracking

구조로 확장했습니다.

---

## Threshold Calibration

panic / sadness가 anger로 집중되는 문제를 해결하기 위해:

- confidence 기반 재판단
- threshold tuning
- class balance correction

을 적용했습니다.

---

## UX / UI Improvements

- 감정 힌트 기능
- 카드형 피드백 UI
- 반복형 인터랙션 구조
- 종합 감정 리포트

기능을 추가했습니다.

---

# Model Architecture

## Core Models

- Vision Transformer (ViT)
- SigLIP
- EfficientNet
- ResNet50

---

## Applied Techniques

- Ensemble Voting
- Threshold Calibration
- MTCNN Face Crop
- EXIF Orientation Normalize
- Test Time Augmentation (TTA)

---

# Modeling Process

## 1. Baseline

초기 baseline은 ResNet50 기반 CNN 모델로 시작했습니다.

초기 성능:

val_acc ≈ 0.36

CNN 기반 구조만으로는:

- 감정 간 관계 표현
- 미묘한 표정 차이 구분

에 한계가 존재했습니다.

---

## 2. Transformer Backbone Expansion

이후 Transformer 기반 구조를 도입했습니다.

적용 backbone:

- ViT
- SigLIP
- EfficientNet
- ResNet

특히 ViT 구조를 통해:

- 전역 관계 표현
- 얼굴 전체 분위기 학습
- 감정 간 관계 표현

을 강화했습니다.

단일 모델 성능:

≈ 0.72

까지 향상되었습니다.

---

## 3. Ensemble Structure

단일 모델 한계를 극복하기 위해:

ViT + SigLIP + EfficientNet + ResNet

구조 기반 weighted ensemble을 적용했습니다.

추가 적용:

- threshold calibration
- TTA
- face crop
- augmentation
- learning rate tuning

---

# Final Performance

| Metric | Result |
|---|---|
| Final Accuracy | 0.8358 |
| Validation Images | 1200 |
| Classes | anger / happy / panic / sadness |

---

# Tech Stack

| Category | Stack |
|---|---|
| Frontend | React + Vite |
| Backend | Flask |
| AI Framework | PyTorch / TensorFlow |
| Model | ViT / SigLIP / EfficientNet |
| Face Detection | MTCNN |
| API | OpenAI GPT API |

---

# Environment

| Item | Version |
|---|---|
| Python | 3.10 |
| Node.js | 18+ |
| npm | 9+ |

---

# Installation

## Backend

```bash
cd emotion-api

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

---

## Frontend

```bash
cd emotion-react

npm install
```

---

# OpenAI API Key Setup

프로젝트 실행 전 `.env` 파일 생성 필요

경로:

```bash
emotion-api/.env
```

내용:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

# Run Project

## Backend 실행

```bash
cd emotion-api

venv\Scripts\activate

python app.py
```

기본 실행 주소:

```text
http://127.0.0.1:5000
```

---

## Frontend 실행

```bash
cd emotion-react

npm run dev
```

기본 실행 주소:

```text
http://localhost:5173
```

---

# Project Structure

| Folder        | Description                  |
| ------------- | ---------------------------- |
| emotion-api   | Flask backend                |
| emotion-react | React frontend               |
| assets        | Workflow / service images    |
| docs          | Modeling & project documents |

---

# Research Continuation

본 프로젝트는 아래 공개 repository의 일부 모델링 구조와 inference pipeline 아이디어를 참고했습니다.

Reference:

```text
https://github.com/moneyally/yua-encoder
```

프로젝트 진행 과정에서:

- 팀 참여 중단
- 모델 실험 중단
- repository 업데이트 중단

상황이 발생했습니다.

이후:

- threshold calibration
- ensemble tuning
- GPT interaction flow
- Flask / React integration
- multi-turn interaction structure
- UX/UI interaction design

등을 별도로 연구 및 확장하여 프로젝트를 진행했습니다.

---

# Future Improvements

- Multi-turn interaction enhancement
- Emotion flow tracking
- Personalized GPT feedback
- Real-time webcam inference
- Expanded emotion categories

---
# Model Weights

Due to GitHub file size limitations, model weight files are not included in this repository.

Model weights were managed separately during the project due to server-based training and large file sizes.

This project uses an ensemble-based emotion recognition pipeline composed of:

- ResNet50
- EfficientNet
- Vision Transformer (ViT)
- SigLIP

Required model files:

- exp02_resnet50_ft_crop_aug.h5
- exp04_effnet_ft_balanced.h5
- exp05_vit_b16_two_stage.pt
- exp09_siglip_kd_tsoff_T4_a07_uf4.pt
- ensemble_with_kd.json

Place all files under:

models/

The final inference pipeline loads the ensemble configuration through:

predict.py

# Conclusion


본 프로젝트는 감정을 단순 분류 결과가 아닌  
다음 상호작용을 위한 입력값으로 활용하는 것을 목표로 진행되었습니다.

감정 인식 모델과 GPT 기반 피드백을 결합해  
사용자 경험 중심 인터랙션 구조를 구현했습니다.


# Presentation

Project presentation slides and demo video:

[View Canva Presentation](https://www.canva.com/design/DAHHFsDaKds/QSTJeOQx3I_2eNREPj7nzQ/edit)
