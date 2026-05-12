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
