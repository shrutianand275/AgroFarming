import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import {
  Bot,
  Mic,
  Send,
  Trash2,
  Leaf,
  User,
  Sparkles
} from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // =========================================
  // CURRENT LANGUAGE FROM MAIN NAVBAR
  // =========================================

  const currentLanguage = i18n.language?.startsWith("hi")
    ? "hi-IN"
    : "en-IN";

  // =========================================
  // WELCOME MESSAGE
  // =========================================

  const getWelcomeMessage = () => ({
    role: "assistant",
    content: t("chatbot.welcome")
  });

  // =========================================
  // INITIAL MESSAGE
  // =========================================

  useEffect(() => {
    setMessages([getWelcomeMessage()]);
  }, [i18n.language]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async (customMessage = null) => {
    const message = (
      customMessage !== null ? customMessage : input
    ).trim();

    if (!message || loading) return;

    const previousMessages = messages.filter(
      (msg) =>
        msg.role === "user" ||
        msg.role === "assistant"
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message
      }
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message,
            history: previousMessages
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to get response."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer
        }
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chatbot.connectionError")
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ENTER TO SEND
  // =========================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =========================================
  // VOICE INPUT
  // =========================================

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t("chatbot.voiceNotSupported"));
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition =
      new SpeechRecognition();

    // Uses the language selected
    // from the MAIN NAVBAR

    recognition.lang = currentLanguage;

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput((previous) =>
        previous
          ? `${previous} ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (event.error === "not-allowed") {
        alert(
          t("chatbot.microphoneDenied")
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  // =========================================
  // CLEAR CHAT
  // =========================================

  const clearChat = () => {
    setMessages([
      getWelcomeMessage()
    ]);

    setInput("");
  };

  // =========================================
  // SUGGESTIONS
  // =========================================

  const suggestions = [
    {
      icon: "🌾",
      text: t("chatbot.suggestion1")
    },
    {
      icon: "🌧️",
      text: t("chatbot.suggestion2")
    },
    {
      icon: "🐛",
      text: t("chatbot.suggestion3")
    },
    {
      icon: "🌱",
      text: t("chatbot.suggestion4")
    }
  ];

  return (
    <>
      {/* Existing Navbar */}

      <Navbar />

      {/* =====================================
          CHATBOT PAGE
      ===================================== */}

      <section className="chatbot-page">

        <div className="chatbot-main">

          {/* =================================
              HEADER
          ================================= */}

          <div className="chatbot-heading">

            <div className="chatbot-brand">

              <div className="chatbot-logo">
                <Leaf size={27} />
              </div>

              <h1>
                {t("chatbot.title")}
              </h1>

            </div>

            <button
              className="clear-button"
              onClick={clearChat}
              title={t("chatbot.clearChat")}
            >
              <Trash2 size={16} />

              <span>
                {t("chatbot.clearChat")}
              </span>
            </button>

          </div>

          {/* =================================
              CHAT CARD
          ================================= */}

          <div className="chat-card">

            {/* ===============================
                SCROLLABLE CHAT AREA
            =============================== */}

            <div className="messages-area">

              {/* Welcome */}

              {messages.length === 1 &&
                !loading && (

                  <div className="welcome-section">

                    <h2>
                      {t(
                        "chatbot.welcomeTitle"
                      )}
                    </h2>

                    <div className="suggestions">

                      {suggestions.map(
                        (suggestion, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              sendMessage(
                                suggestion.text
                              )
                            }
                          >
                            <span className="suggestion-icon">
                              {suggestion.icon}
                            </span>

                            <span>
                              {suggestion.text}
                            </span>
                          </button>

                        )
                      )}

                    </div>

                  </div>

                )}

              {/* Messages */}

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`message-row ${
                      message.role === "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                  >

                    {message.role ===
                      "assistant" && (

                      <div className="avatar ai-avatar">
                        <Bot size={18} />
                      </div>

                    )}

                    <div
                      className={`message-wrapper ${
                        message.role === "user"
                          ? "user-wrapper"
                          : ""
                      }`}
                    >

                      <span className="message-name">

                        {message.role === "user"
                          ? t("chatbot.you")
                          : t("chatbot.aiName")}

                      </span>

                      <div
                        className={`message-bubble ${
                          message.role === "user"
                            ? "user-message"
                            : "ai-message"
                        }`}
                      >
                        {message.content}
                      </div>

                    </div>

                    {message.role ===
                      "user" && (

                      <div className="avatar user-avatar">
                        <User size={17} />
                      </div>

                    )}

                  </div>

                )
              )}

              {/* Loading */}

              {loading && (

                <div className="message-row assistant-row">

                  <div className="avatar ai-avatar">
                    <Bot size={18} />
                  </div>

                  <div className="message-wrapper">

                    <span className="message-name">
                      {t("chatbot.aiName")}
                    </span>

                    <div className="message-bubble ai-message typing-bubble">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

            {/* ===============================
                FIXED INPUT
            =============================== */}

            <div className="chat-input-section">

              <div
                className={`input-container ${
                  listening
                    ? "voice-active"
                    : ""
                }`}
              >

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={
                    listening
                      ? t("chatbot.listening")
                      : t("chatbot.placeholder")
                  }
                  rows={1}
                />

                {/* Microphone */}

                <button
                  className={`voice-button ${
                    listening
                      ? "listening"
                      : ""
                  }`}
                  onClick={
                    startVoiceInput
                  }
                  title={
                    listening
                      ? t(
                          "chatbot.stopListening"
                        )
                      : t(
                          "chatbot.voiceInput"
                        )
                  }
                >
                  <Mic size={19} />
                </button>

                {/* Send */}

                <button
                  className="send-button"
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    !input.trim() ||
                    loading
                  }
                  title={t(
                    "chatbot.send"
                  )}
                >
                  <Send size={18} />
                </button>

              </div>

              <div className="input-info">

                <span>
                  {t(
                    "chatbot.languageSupport"
                  )}
                </span>

                <span>
                  {t(
                    "chatbot.enterToSend"
                  )}
                </span>

              </div>

            </div>

          </div>

          {/* =================================
              DISCLAIMER
          ================================= */}

          <p className="chatbot-disclaimer">
            {t("chatbot.disclaimer")}
          </p>

        </div>

      </section>
    </>
  );
};

export default Chatbot;