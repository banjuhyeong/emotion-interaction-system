# Modeling Log

## Baseline

- ResNet50 baseline
- validation accuracy ≈ 0.36

CNN 기반 구조만으로는
복잡한 감정 표현을 충분히 구분하는 데 한계가 존재했습니다.

---

## Transformer Backbone

### ViT

- Vision Transformer 기반 구조 도입
- validation accuracy ≈ 0.72

이미지를 부분 특징이 아닌
전체적인 관계로 해석하도록 개선했습니다.

---

## Ensemble

### Final Ensemble Structure

- ViT
- SigLIP
- EfficientNet
- ResNet

weighted ensemble 기반으로
각 모델의 feature 특성을 결합했습니다.

---

## Threshold Calibration

panic / sadness가 anger로 오분류되는 현상을 확인했습니다.

이를 개선하기 위해 threshold 기반 후처리를 추가했습니다.

---

## Final Result

- total_acc ≈ 0.8358
- panic / sadness confusion 개선
- GPT 기반 인터랙션 서비스 연동 완료
