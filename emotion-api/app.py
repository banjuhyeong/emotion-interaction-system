from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import load_model, predict
from openai import OpenAI
from dotenv import load_dotenv
import os
import random
from werkzeug.utils import secure_filename

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL = load_model("models/ensemble_with_kd.json")

SCENARIOS = [
    {
        "id": 1,
        "target_emotion": "anger",
        "emotion_kr": "분노",
        "fallback_text": "친구가 내 장난감을 허락 없이 가져갔습니다."
    },
    {
        "id": 2,
        "target_emotion": "sadness",
        "emotion_kr": "슬픔",
        "fallback_text": "친구와 같이 놀고 싶었는데 친구가 먼저 집에 갔습니다."
    },
    {
        "id": 3,
        "target_emotion": "panic",
        "emotion_kr": "당황",
        "fallback_text": "줄을 서다가 갑자기 내 차례가 되어 깜짝 놀랐습니다."
    },
    {
        "id": 4,
        "target_emotion": "happy",
        "emotion_kr": "기쁨",
        "fallback_text": "선생님이 내가 그린 그림을 보고 잘했다고 칭찬해주셨습니다."
    }
]

EMOTION_KR = {
    "anger": "분노",
    "happy": "기쁨",
    "panic": "당황",
    "sadness": "슬픔"
}


def make_history_text(history):
    if not history:
        return "이전 감정 기록 없음"

    lines = []
    for idx, item in enumerate(history, start=1):
        lines.append(
            f"{idx}. 상황: {item.get('scenario')}, "
            f"기대 감정: {item.get('target_emotion_kr')}, "
            f"예측 감정: {item.get('emotion_kr')}, "
            f"일치 여부: {item.get('matched')}"
        )

    return "\n".join(lines)


def choose_next_emotion(history):
    if not history:
        return random.choice(SCENARIOS)

    last = history[-1]
    matched = last.get("matched")
    predicted = last.get("emotion")

    # 감정이 다르게 나타난 경우: 사용자의 실제 감정을 다음 흐름에 반영
    if matched is False and predicted in EMOTION_KR:
        for item in SCENARIOS:
            if item["target_emotion"] == predicted:
                return item

    # 감정이 일치한 경우: 같은 감정만 반복되지 않도록 랜덤하게 다음 감정 선택
    return random.choice(SCENARIOS)


def generate_scenario_text(selected, history):
    history_text = make_history_text(history)

    prompt = f"""
감정카드 기반 반복형 인터랙션 시스템에서 사용할 다음 상황 문장 1개를 생성해줘.

이번 목표 감정: {selected["emotion_kr"]}

이전 감정 기록:
{history_text}

생성 방향:
- 이전 기록이 없다면 첫 번째 감정카드 상황처럼 자연스럽게 시작
- 이전 감정이 기대 감정과 일치했다면, 그 감정 흐름이 자연스럽게 이어지거나 살짝 변화하는 상황 생성
- 이전 감정이 기대 감정과 다르게 나타났다면, 사용자가 실제로 보인 감정을 존중하고 더 편안하게 반응할 수 있는 상황 생성
- 단순 랜덤 상황이 아니라 앞선 상호작용을 고려한 다음 상황처럼 작성

반드시 아래 4가지 감정 중 하나가 명확하게 느껴지는 상황만 생성:
- 분노
- 기쁨
- 슬픔
- 당황

조건:
- 한국어
- 한 문장 이내
- 어린아이도 이해 가능한 쉬운 표현
- 감정이 명확하게 드러나야 함
- 여러 감정으로 해석되지 않게 작성
- 놀이, 친구, 그림, 칭찬, 실수 같은 가벼운 일상 상황 사용
- 자극적이거나 무서운 표현 금지
- 폭력, 사고, 질병, 죽음, 따돌림 금지
- 발표, 시험, 혼남 같은 과도한 부담 상황 금지
- 따옴표 없이 문장만 출력
"""

    response = client.responses.create(
        model="gpt-5.2",
        input=prompt
    )

    return response.output_text.strip()


def generate_feedback_message(scenario_text, target_emotion, predicted_emotion, confidence):
    matched = target_emotion == predicted_emotion

    prompt = f"""
감정카드 기반 피드백 문장을 생성해줘.

제시된 상황:
{scenario_text}

상황에서 기대한 감정:
{EMOTION_KR.get(target_emotion, target_emotion)}

모델이 예측한 감정:
{EMOTION_KR.get(predicted_emotion, predicted_emotion)}

Confidence:
{confidence:.2f}

조건:
- 한국어
- 어린아이도 이해할 수 있는 쉬운 표현
- 2문장 이내
- 따뜻하고 부드러운 말투
- 자극적이거나 무서운 표현 금지
- 감정이 일치하면 상황에 맞는 자연스러운 반응이라고 말하기
- 감정이 다르면 틀렸다고 말하지 말고, 다른 감정도 느낄 수 있다고 말하기
- 다음 상황에서는 이 감정을 바탕으로 이어가겠다는 느낌을 살짝 포함
- 문장만 출력

감정 일치 여부: {matched}
"""

    response = client.responses.create(
        model="gpt-5.2",
        input=prompt
    )

    return response.output_text.strip()


def generate_summary_feedback(results):
    correct_count = sum(1 for r in results if r.get("matched"))
    total_count = len(results)

    lines = []
    for idx, r in enumerate(results, start=1):
        lines.append(
            f"{idx}. 기대 감정={r.get('target_emotion_kr')}, "
            f"예측 감정={r.get('emotion_kr')}, "
            f"일치 여부={r.get('matched')}"
        )

    result_text = "\n".join(lines)

    prompt = f"""
감정카드 기반 반복 인터랙션 결과를 종합해서 피드백을 작성해줘.

총 진행 횟수: {total_count}
감정 일치 횟수: {correct_count}

결과 기록:
{result_text}

조건:
- 한국어
- 어린아이도 이해할 수 있는 쉬운 표현
- 3~4문장
- 몇 번 중 몇 번 감정이 잘 맞았는지 말하기
- 어떤 감정에서 잘 맞았고, 어떤 감정에서 다르게 나타났는지 간단히 말하기
- 감정이 다르게 나타난 경우도 자연스러운 반응일 수 있다고 말하기
- 따뜻하고 부드러운 말투
- 문장만 출력
"""

    response = client.responses.create(
        model="gpt-5.2",
        input=prompt
    )

    return response.output_text.strip()


def get_fallback_feedback(target, predicted):
    matched = target == predicted

    if matched:
        return {
            "matched": True,
            "title": "상황에 맞는 표정이에요!",
            "message": "제시된 상황과 사용자의 표정 감정이 잘 어울립니다."
        }

    return {
        "matched": False,
        "title": "다른 감정 반응이 감지되었어요.",
        "message": f"이 상황은 '{EMOTION_KR.get(target, target)}'에 가까웠지만, '{EMOTION_KR.get(predicted, predicted)}' 감정도 자연스럽게 느낄 수 있어요."
    }


@app.route("/scenario", methods=["GET", "POST"])
def scenario():
    history = []

    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        history = data.get("history", [])

    selected = choose_next_emotion(history)

    try:
        text = generate_scenario_text(selected, history)
    except Exception as e:
        print("GPT SCENARIO ERROR:", e)
        text = selected["fallback_text"]

    return jsonify({
        "id": selected["id"],
        "text": text,
        "target_emotion": selected["target_emotion"],
        "emotion_kr": selected["emotion_kr"]
    })


@app.route("/predict", methods=["POST"])
def predict_api():
    if "image" not in request.files:
        return jsonify({"error": "image file is required"}), 400

    scenario_id = request.form.get("scenario_id")
    scenario_text = request.form.get("scenario_text")

    scenario_obj = None
    for item in SCENARIOS:
        if str(item["id"]) == str(scenario_id):
            scenario_obj = item
            break

    if scenario_obj is None:
        return jsonify({"error": "valid scenario_id is required"}), 400

    if not scenario_text:
        scenario_text = scenario_obj["fallback_text"]

    file = request.files["image"]
    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    try:
        result_raw = predict(MODEL, save_path)

        print("DEBUG RESULT:", result_raw)

        label = str(result_raw[0])
        confidence = float(result_raw[1])
        matched = scenario_obj["target_emotion"] == label

        try:
            message = generate_feedback_message(
                scenario_text=scenario_text,
                target_emotion=scenario_obj["target_emotion"],
                predicted_emotion=label,
                confidence=confidence
            )
            result_title = "감정 기반 피드백"

        except Exception as e:
            print("GPT FEEDBACK ERROR:", e)
            fallback = get_fallback_feedback(
                scenario_obj["target_emotion"],
                label
            )
            message = fallback["message"]
            result_title = fallback["title"]

        return jsonify({
            "scenario": scenario_text,
            "target_emotion": scenario_obj["target_emotion"],
            "target_emotion_kr": scenario_obj["emotion_kr"],
            "emotion": label,
            "emotion_kr": EMOTION_KR.get(label, label),
            "confidence": confidence,
            "matched": matched,
            "result_title": result_title,
            "message": message
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/summary", methods=["POST"])
def summary_api():
    data = request.get_json()
    results = data.get("results", [])

    if not results:
        return jsonify({"error": "results are required"}), 400

    try:
        message = generate_summary_feedback(results)

        correct_count = sum(1 for r in results if r.get("matched"))
        total_count = len(results)

        return jsonify({
            "total": total_count,
            "correct": correct_count,
            "message": message
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)