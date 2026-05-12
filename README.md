# Emotion Interaction System

Hybrid Facial Emotion Recognition with Ensemble, Threshold Calibration, and GPT-based Interactive Feedback

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

![workflow](assets/workflow.png)

### 전체 흐름

사용자 입력  
→ 얼굴 전처리  
→ Ensemble 감정 분석  
→ GPT 피드백 생성  
→ 반복형 인터랙션 진행

---

# Model Architecture

### Core Models

- Vision Transformer (ViT)
- SigLIP
- EfficientNet
- ResNet50

### Applied Techniques

- Ensemble Voting
- Threshold Calibration
- MTCNN Face Crop
- EXIF Orientation Normalize
- Test Time Augmentation (TTA)

---

# Final Performance

| Metric | Result |
|---|---|
| Final Accuracy | 0.8358 |
| Validation Images | 1200 |
| Classes | anger / happy / panic / sadness |

### Main Improvements

- panic / sadness confusion reduction
- anger bias mitigation
- threshold-based probability recalibration

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

## Emotion Analysis Result

![result](assets/service_result.png)

### Output Information

- 기대 감정 출력
- 예측 감정 분석
- confidence score 제공
- 감정 기반 피드백 생성

---

## Feedback Branching

![feedback](assets/service_feedback.png)

### Feedback Logic

- 감정 일치 여부에 따라
  피드백 방향 변화

- 공감 / 긍정 강화 /
  감정 상태 고려 반응 생성

- 이전 감정 흐름 기반
  상호작용 확장 고려

---

## Final Summary

![summary](assets/service_summary.png)

### Final Interaction Goal

- 반복형 감정 인터랙션
- 감정 흐름 기록
- 종합 감정 피드백 제공
- 사용자 참여 강화

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

# Project Structure

```bash
emotion-interaction-system
├── emotion-api
│   ├── app.py
│   ├── predict.py
│   ├── models/
│   └── .env
│
├── emotion-react
│   ├── src/
│   ├── public/
│   └── assets/
│
├── assets
│   ├── workflow.png
│   ├── service_main.png
│   ├── service_result.png
│   ├── service_feedback.png
│   └── service_summary.png
│
└── README.md
