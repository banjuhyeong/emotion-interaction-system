import { useEffect, useState } from "react"

const MAX_ROUND = 5

function App() {
  const [scenario, setScenario] = useState(null)
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const fetchScenario = async (currentHistory = history) => {
    setImage(null)
    setResult(null)
    setShowHint(false)

    try {
      const response = await fetch("http://127.0.0.1:5000/scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          history: currentHistory
        })
      })

      const data = await response.json()
      setScenario(data)
    } catch (error) {
      console.error(error)
      alert("상황 생성 실패")
    }
  }

  useEffect(() => {
    fetchScenario([])
  }, [])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !scenario) return

    setImage(URL.createObjectURL(file))
    setResult(null)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("scenario_id", scenario.id)
    formData.append("scenario_text", scenario.text)

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        setLoading(false)
        return
      }

      setResult(data)
    } catch (error) {
      console.error(error)
      alert("서버 연결 실패")
    }

    setLoading(false)
  }

  const goNextRound = async () => {
    const newHistory = [...history, result]
    setHistory(newHistory)

    if (newHistory.length >= MAX_ROUND) {
      await requestSummary(newHistory)
      return
    }

    setImage(null)
    setResult(null)
    setShowHint(false)
    fetchScenario(newHistory)
  }

  const requestSummary = async (results) => {
    setSummaryLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ results })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        setSummaryLoading(false)
        return
      }

      setSummary(data)
      setResult(null)
      setImage(null)
      setShowHint(false)
    } catch (error) {
      console.error(error)
      alert("종합 피드백 생성 실패")
    }

    setSummaryLoading(false)
  }

  const resetAll = () => {
    setImage(null)
    setResult(null)
    setHistory([])
    setSummary(null)
    setShowHint(false)
    fetchScenario([])
  }

  const currentRound =
    history.length >= MAX_ROUND
      ? MAX_ROUND
      : history.length + 1

  const hintImages = {
  anger: "/hints/anger.png",
  happy: "/hints/happy.png",
  panic: "/hints/panic.jpeg",
  sadness: "/hints/sadness.jpeg"
}

const hintImage = scenario
  ? hintImages[scenario.target_emotion]
  : ""

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "390px",
        background: "white",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "8px"
        }}>
          Emotion Interaction
        </h1>

        {!summary && (
          <p style={{
            textAlign: "center",
            color: "#555",
            marginTop: 0,
            marginBottom: "20px"
          }}>
            {currentRound} / {MAX_ROUND}
          </p>
        )}

        {!result && !summary && (
          <>
            <div style={{
              background: "#f0f4ff",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "12px"
            }}>
              <p style={{
                margin: 0,
                fontWeight: "bold",
                marginBottom: "8px"
              }}>
                제시된 상황
              </p>

              <p style={{ margin: 0 }}>
                {scenario ? scenario.text : "상황을 불러오는 중..."}
              </p>

              {scenario && (
                <p style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: "13px",
                  color: "#555"
                }}>
                  기대 감정: {scenario.emotion_kr}
                </p>
              )}
            </div>

            <button
              onClick={() => fetchScenario(history)}
              style={{
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "12px",
                background: "#e5e7eb",
                color: "#111827",
                marginBottom: "10px",
                cursor: "pointer"
              }}
            >
              다른 상황 보기
            </button>

            {scenario && (
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#ede9fe",
                  color: "#4c1d95",
                  marginBottom: "16px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {showHint ? "힌트 숨기기" : "감정 힌트 보기"}
              </button>
            )}

            {showHint && scenario && (
              <div style={{
                background: "#faf5ff",
                padding: "14px",
                borderRadius: "16px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: "#4c1d95"
                }}>
                  이 상황에서는 이런 표정이 나타날 수 있어요
                </p>

                <img
                  src={hintImage}
                  alt="emotion hint"
                  style={{
                    width: "100%",
                    maxHeight: "180px",
                    objectFit: "contain",
                    borderRadius: "14px",
                    background: "white"
                  }}
                />
              </div>
            )}

            {image && (
              <img
                src={image}
                alt="preview"
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  marginBottom: "20px"
                }}
              />
            )}

            <label style={{
              display: "block",
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              background: "#4f46e5",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              textAlign: "center",
              boxSizing: "border-box"
            }}>
              표정 이미지 업로드
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            {loading && (
              <p style={{ marginTop: "20px" }}>
                감정 분석 중...
              </p>
            )}
          </>
        )}

        {result && !summary && (
          <div>
            <h2 style={{
              textAlign: "center",
              marginTop: 0,
              marginBottom: "20px"
            }}>
              감정 분석 결과
            </h2>

            <div style={{
              background: "#f0f4ff",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "16px"
            }}>
              <p style={{ marginTop: 0, fontWeight: "bold" }}>
                제시된 상황
              </p>
              <p style={{ marginBottom: 0 }}>
                {result.scenario}
              </p>
            </div>

            {image && (
              <img
                src={image}
                alt="uploaded"
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  marginBottom: "16px"
                }}
              />
            )}

            <div style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "16px"
            }}>
              <p>
                기대 감정: <b>{result.target_emotion_kr}</b>
              </p>

              <p>
                예측 감정: <b>{result.emotion_kr}</b>
              </p>

              <p>
                Confidence: <b>{(result.confidence * 100).toFixed(1)}%</b>
              </p>
            </div>

            <div style={{
              background: result.matched ? "#ecfdf5" : "#fff7ed",
              padding: "18px",
              borderRadius: "18px",
              marginBottom: "18px"
            }}>
              <h3 style={{ marginTop: 0 }}>
                {result.result_title}
              </h3>

              <p style={{
                marginBottom: 0,
                lineHeight: "1.6"
              }}>
                {result.message}
              </p>
            </div>

            <button
              onClick={goNextRound}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#111827",
                color: "white",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              {currentRound >= MAX_ROUND ? "종합 피드백 보기" : "다음 상황으로 넘어가기"}
            </button>
          </div>
        )}

        {summaryLoading && (
          <p style={{ marginTop: "20px" }}>
            종합 피드백 생성 중...
          </p>
        )}

        {summary && (
          <div>
            <h2 style={{
              textAlign: "center",
              marginTop: 0,
              marginBottom: "20px"
            }}>
              종합 피드백
            </h2>

            <div style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "16px"
            }}>
              <p>
                감정 일치 결과: <b>{summary.correct} / {summary.total}</b>
              </p>
            </div>

            <div style={{
              background: "#ecfdf5",
              padding: "18px",
              borderRadius: "18px",
              marginBottom: "18px"
            }}>
              <h3 style={{ marginTop: 0 }}>
                최종 감정 리포트
              </h3>

              <p style={{
                marginBottom: 0,
                lineHeight: "1.6"
              }}>
                {summary.message}
              </p>
            </div>

            <div style={{
              background: "#f0f4ff",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "18px"
            }}>
              <p style={{ fontWeight: "bold", marginTop: 0 }}>
                감정 흐름 기록
              </p>

              {history.map((item, index) => (
                <p key={index} style={{ fontSize: "14px" }}>
                  {index + 1}. 기대 {item.target_emotion_kr} / 예측 {item.emotion_kr}
                </p>
              ))}
            </div>

            <button
              onClick={resetAll}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#111827",
                color: "white",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              처음부터 다시 시작
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default App