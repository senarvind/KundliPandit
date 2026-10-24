import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Settings,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Key,
  Globe,
  RefreshCw,
  X,
  Copy,
  ChevronRight,
  ShieldCheck,
  Compass,
  FileDown
} from "lucide-react";
import {
  getAISettings,
  saveAISettings,
  generateFullAIFaladesh,
  askAIPandit
} from "../utils/aiAstrologerService";
import { playSoftClick, playTempleChime } from "../utils/soundEffects";

export default function AIAstrologerModal({
  isOpen,
  onClose,
  kundli,
  formData,
  avakahada,
  aiFaladesh,
  setAiFaladesh,
  onOpenPatrikaModal
}) {
  const [activeTab, setActiveTab] = useState("report"); // "report" | "chat" | "settings"
  const [settings, setSettings] = useState(getAISettings());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isAnsweringChat, setIsAnsweringChat] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const chatEndRef = useRef(null);

  // Initialize greeting message in chat
  useEffect(() => {
    if (formData?.name && chatMessages.length === 0) {
      setChatMessages([
        {
          role: "assistant",
          text: `॥ श्री गणेशाय नमः ॥\nप्रणाम ${formData.name} जी! मैं आचार्य विद्याधर शास्त्री हूँ। आपकी जन्म कुंडली (${kundli?.ascendant?.rashi?.hindi || ""} लग्न, ${kundli?.planets?.find((p) => p.id === "Moon")?.rashi?.hindi || ""} राशि) का अध्ययन मेरे सम्मुख है।\nविवाह, करियर, धन-संपत्ति, स्वास्थ्य, दशा अथवा रत्न-उपाय के विषय में आप जो भी प्रश्न पूछना चाहते हैं, निसंकोच पूछिए।`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  }, [formData, kundli]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    playTempleChime();
    setIsGeneratingReport(true);
    try {
      const res = await generateFullAIFaladesh(kundli, formData, avakahada, settings);
      setAiFaladesh(res);
    } catch (err) {
      console.error("AI Faladesh error:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendMessage = async (customQuery = null) => {
    const textToSend = customQuery || chatInput.trim();
    if (!textToSend || isAnsweringChat) return;

    playSoftClick();
    const userMsg = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setChatInput("");
    setIsAnsweringChat(true);

    try {
      const reply = await askAIPandit(textToSend, kundli, formData, avakahada, chatMessages, settings);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "क्षमा करें, तकनीकी कारणों से संपर्क में विलम्ब हुआ। कृपया पुनः प्रयास करें।",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsAnsweringChat(false);
    }
  };

  const handleCopyReport = () => {
    if (aiFaladesh?.content) {
      navigator.clipboard.writeText(aiFaladesh.content);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveAISettings(settings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const quickQuestions = [
    "मेरा विवाह कब तक होगा और जीवनसाथी कैसा मिलेगा?",
    "करियर एवं नौकरी में प्रमोशन और सफलता कब मिलेगी?",
    "क्या मेरे लिए नौकरी बेहतर है या खुद का बिजनेस?",
    "मेरे लिए कौन सा भाग्यशाली रत्न और रुद्राक्ष शुभ है?",
    "क्या मेरी कुंडली में मांगलिक या कालसर्प दोष है?",
    "आर्थिक स्थिति और धन लाभ के क्या योग हैं?"
  ];

  return (
    <div className="modal-overlay ai-astrologer-modal-overlay">
      <div className="modal-dialog ai-astrologer-dialog glass-card animate-fade-in">
        {/* Header */}
        <div className="modal-header">
          <div className="ai-modal-branding">
            <div className="ai-avatar-badge">
              <span className="ai-om">ॐ</span>
            </div>
            <div>
              <h2 className="ai-modal-title">
                AI ज्योतिषाचार्य परामर्श <span>(AI Vedic Pandit Ji)</span>
              </h2>
              <p className="ai-modal-sub">
                महर्षि पाराशर एवं वराहमिहिर के प्रामाणिक सूत्रों पर आधारित वास्तविक कुंडली फलकथन
              </p>
            </div>
          </div>

          <div className="modal-header-actions">
            <div className="ai-engine-status-tag">
              <ShieldCheck size={14} className="text-emerald" />
              <span>
                {settings.provider === "gemini" && settings.apiKey
                  ? "Google Gemini AI Active"
                  : settings.provider === "openai" && settings.apiKey
                  ? "OpenAI / Custom Active"
                  : "Parashari Expert Engine"}
              </span>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                playSoftClick();
                onClose();
              }}
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="ai-tabs-nav">
          <button
            type="button"
            className={`ai-tab-btn ${activeTab === "report" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setActiveTab("report");
            }}
          >
            <BookOpen size={16} />
            <span>सम्पूर्ण कुण्डली फलकथन (Full Patrika Faladesh)</span>
          </button>

          <button
            type="button"
            className={`ai-tab-btn ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setActiveTab("chat");
            }}
          >
            <MessageSquare size={16} />
            <span>पंडित जी से प्रश्न पूछें (Ask AI Pandit Ji)</span>
          </button>

          <button
            type="button"
            className={`ai-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setActiveTab("settings");
            }}
          >
            <Settings size={16} />
            <span>AI API सेटिंग्स (Gemini / OpenAI)</span>
          </button>
        </div>

        {/* Tab 1: Comprehensive Kundli Faladesh */}
        {activeTab === "report" && (
          <div className="ai-tab-content ai-report-view">
            <div className="ai-report-banner">
              <div className="report-banner-text">
                <h3>जातक {formData?.name} की वृहत् जन्मपत्रिका फलकथन</h3>
                <p>
                  लग्न, नवमांश, विंशोत्तरी दशा, गोचर, राजयोग व दोषों का सूक्ष्म विश्लेषण कर तैयार किया गया वास्तविक फलकथन।
                </p>
              </div>

              <div className="report-banner-actions">
                <button
                  type="button"
                  className="btn-gold-action"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                >
                  <RefreshCw size={16} className={isGeneratingReport ? "spinning" : ""} />
                  <span>
                    {isGeneratingReport
                      ? "आचार्य जी फलकथन तैयार कर रहे हैं..."
                      : aiFaladesh
                      ? "पुनः नया फलकथन तैयार करें"
                      : "एआई सम्पूर्ण फलकथन तैयार करें"}
                  </span>
                </button>

                {aiFaladesh && (
                  <>
                    <button
                      type="button"
                      className="btn-outline-action"
                      onClick={handleCopyReport}
                      title="फलकथन कॉपी करें"
                    >
                      <Copy size={16} />
                      <span>{copiedSuccess ? "कॉपी हो गया!" : "कॉपी करें"}</span>
                    </button>

                    {onOpenPatrikaModal && (
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => {
                          playSoftClick();
                          onOpenPatrikaModal();
                        }}
                        title="View Full PDF Patrika"
                      >
                        <FileDown size={16} />
                        <span>बृहत् पत्रिका PDF देखें</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Faladesh Output Display */}
            {isGeneratingReport ? (
              <div className="ai-loading-box glass-card">
                <div className="divine-loader">
                  <div className="loader-ring"></div>
                  <span className="loader-om">ॐ</span>
                </div>
                <h4>वैदिक ज्योतिषीय गणनाएं एवं फलकथन विश्लेषित हो रहा है...</h4>
                <p>
                  दशमेश, सप्तमेश, विंशोत्तरी महादशा चक्र तथा नवग्रह स्थिति का पाराशरीय सूत्रों के अनुसार परीक्षण किया जा रहा है।
                </p>
              </div>
            ) : aiFaladesh ? (
              <div className="ai-faladesh-paper glass-card">
                <div className="paper-header-strip">
                  <span className="engine-badge">
                    स्रोत: {aiFaladesh.provider} • मॉडल: {aiFaladesh.model}
                  </span>
                  <span className="gen-time">
                    दिनांक: {new Date(aiFaladesh.generatedAt).toLocaleDateString("hi-IN")}
                  </span>
                </div>
                <div className="paper-body-content">
                  <pre className="faladesh-formatted-text">{aiFaladesh.content}</pre>
                </div>
              </div>
            ) : (
              <div className="ai-empty-placeholder glass-card">
                <div className="empty-icon-wrap">
                  <Sparkles size={40} className="text-gold" />
                </div>
                <h4>आचार्य जी द्वारा जन्मपत्रिका का सम्पूर्ण फलकथन प्राप्त करें</h4>
                <p>
                  "एआई सम्पूर्ण फलकथन तैयार करें" बटन पर क्लिक करें। इसमें आपका व्यक्तित्व, आजीविका/करियर, विवाह व जीवनसाथी, धन-संपत्ति, स्वास्थ्य, वर्तमान दशा तथा सटीक वैदिक उपायों का प्रामाणिक विवरण शामिल रहेगा।
                </p>
                <button
                  type="button"
                  className="btn-gold-action large"
                  onClick={handleGenerateReport}
                >
                  <Sparkles size={18} />
                  <span>प्रारंभ करें (Generate Kundli Faladesh)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive Chat Consultation */}
        {activeTab === "chat" && (
          <div className="ai-tab-content ai-chat-view">
            {/* Quick Consultation Chips */}
            <div className="chat-quick-chips">
              <span className="chip-label">त्वरित प्रश्न:</span>
              <div className="chips-scroller">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-chip-btn"
                    onClick={() => handleSendMessage(q)}
                    disabled={isAnsweringChat}
                  >
                    <span>{q}</span>
                    <ChevronRight size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="chat-thread-container glass-card">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message-bubble ${msg.role === "user" ? "user-bubble" : "pandit-bubble"}`}
                >
                  <div className="bubble-header">
                    <span className="sender-name">
                      {msg.role === "user" ? formData.name : "आचार्य विद्याधर शास्त्री"}
                    </span>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  <div className="bubble-text">{msg.text}</div>
                </div>
              ))}

              {isAnsweringChat && (
                <div className="chat-message-bubble pandit-bubble answering">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">आचार्य जी कुंडली का अवलोकन कर उत्तर लिख रहे हैं...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              className="chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="chat-text-input"
                placeholder="अपनी कुंडली, विवाह, करियर, धन या उपाय के बारे में कोई भी प्रश्न पूछें..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isAnsweringChat}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!chatInput.trim() || isAnsweringChat}
              >
                <Send size={18} />
                <span>पूछें</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: AI Engine & API Configuration */}
        {activeTab === "settings" && (
          <div className="ai-tab-content ai-settings-view">
            <div className="settings-card glass-card">
              <div className="settings-header">
                <Key className="text-gold" size={24} />
                <div>
                  <h3>AI API एकीकरण एवं मॉडल विन्यास (API Settings)</h3>
                  <p>
                    आप Google Gemini API (निःशुल्क/Free) अथवा OpenAI API कुंजी दर्ज कर सकते हैं। यदि कोई कुंजी दर्ज नहीं होगी, तब भी हमारा उच्च-परिशुद्धता वैदिक इंजन निःशुल्क कार्यरत रहेगा।
                  </p>
                </div>
              </div>

              {savedSettingsNotice && (
                <div className="toast-notice glass-card glow-pulse">
                  <CheckCircle2 className="icon-success" size={18} />
                  <span>AI सेटिंग्स सफलतापूर्वक सहेजी गईं!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="settings-form-grid">
                <div className="form-group">
                  <label>AI इंजन प्रदाता (Provider):</label>
                  <select
                    value={settings.provider}
                    onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                    className="form-control"
                  >
                    <option value="gemini">Google Gemini API (अनुशंसित - तीव्र एवं निःशुल्क)</option>
                    <option value="openai">OpenAI / Custom Endpoint (GPT-4o, DeepSeek, etc.)</option>
                    <option value="builtin">Built-in Parashari Vedic Expert Engine (ऑफ़लाइन)</option>
                  </select>
                </div>

                {settings.provider !== "builtin" && (
                  <div className="form-group">
                    <label>
                      {settings.provider === "gemini" ? "Google Gemini API Key:" : "OpenAI / Custom API Key:"}
                    </label>
                    <input
                      type="password"
                      placeholder={
                        settings.provider === "gemini"
                          ? "AIzaSy..."
                          : "sk-proj-..."
                      }
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      className="form-control"
                    />
                    <small className="form-hint">
                      {settings.provider === "gemini" ? (
                        <>
                          निःशुल्क Google Gemini API Key प्राप्त करने के लिए{" "}
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold"
                          >
                            Google AI Studio
                          </a>{" "}
                          पर जाएं।
                        </>
                      ) : (
                        "OpenAI अथवा अपने कंपेटिबल प्रोवाइडर की API Key दर्ज करें।"
                      )}
                    </small>
                  </div>
                )}

                {settings.provider === "gemini" && (
                  <div className="form-group">
                    <label>Gemini मॉडल:</label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                      className="form-control"
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (सर्वोत्तम गति एवं सटीकता)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (गहन दार्शनिक विश्लेषण)</option>
                    </select>
                  </div>
                )}

                {settings.provider === "openai" && (
                  <>
                    <div className="form-group">
                      <label>कस्टम एंडपॉइंट (Custom Base URL):</label>
                      <input
                        type="text"
                        placeholder="https://api.openai.com/v1/chat/completions"
                        value={settings.customEndpoint}
                        onChange={(e) => setSettings({ ...settings, customEndpoint: e.target.value })}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>मॉडल का नाम:</label>
                      <input
                        type="text"
                        placeholder="gpt-4o-mini"
                        value={settings.model}
                        onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>परामर्श की भाषा (Language):</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="form-control"
                  >
                    <option value="hindi">हिन्दी (शुद्ध वैदिक शैली - Hindi)</option>
                    <option value="hinglish">Hinglish (बोलचाल की भाषा)</option>
                    <option value="english">English (with Vedic Sanskrit terminology)</option>
                  </select>
                </div>

                <div className="settings-submit-row">
                  <button type="submit" className="btn-gold-action">
                    <CheckCircle2 size={16} />
                    <span>सेटिंग्स सुरक्षित करें (Save Settings)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
