import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const LENGTHS = [
  { value: 'short',  emoji: '⚡', name: 'Short',  range: '~2 sentences' },
  { value: 'medium', emoji: '📋', name: 'Medium', range: '~3 sentences' },
  { value: 'long',   emoji: '📖', name: 'Long',   range: '~5 sentences' },
];

const FORMATS = [
  {
    id: 'paragraph',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/>
      </svg>
    ),
    name: 'Paragraph',
    meta: 'Flowing prose, great for reading',
  },
  {
    id: 'bullets',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
        <circle cx="4" cy="6" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    ),
    name: 'Bullet Points',
    meta: 'Scannable list, great for skimming',
  },
];

const Dashboard = () => {
  const [tab,         setTab]         = useState('text');
  const [text,        setText]        = useState('');
  const [file,        setFile]        = useState(null);
  const [length,      setLength]      = useState('medium');
  const [format,      setFormat]      = useState('paragraph');
  const [summary,     setSummary]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [copied,      setCopied]      = useState(false);
  const [dragOver,    setDragOver]    = useState(false);
  const fileRef = useRef(null);

  const clearErr = () => setError('');

  /* ── Summarize Text ── */
  const handleText = async () => {
    if (!text.trim()) { setError('Please enter some text to summarize.'); return; }
    clearErr(); setLoading(true); setSummary('');
    try {
      const res = await axios.post(`${API_BASE_URL}/summarize`, { text: text.trim(), length });
      setSummary(res.data.summary);
    } catch {
      setError('Could not reach the server. Make sure the Flask backend is running on port 5000.');
    } finally { setLoading(false); }
  };

  /* ── Summarize PDF ── */
  const handlePDF = async () => {
    if (!file) { setError('Please upload a PDF file first.'); return; }
    clearErr(); setLoading(true); setSummary('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('length', length);
    try {
      const res = await axios.post(`${API_BASE_URL}/summarize-pdf`, fd);
      setSummary(res.data.summary);
    } catch {
      setError('Error processing PDF. Check the file and try again.');
    } finally { setLoading(false); }
  };

  /* ── Copy ── */
const handleCopy = () => {
  if (!summary) return;

  let formattedText = summary;

  // ✅ FIXED: use "bullets" (not "bullet")
  if (format === "bullets") {
    formattedText = summary
      .split(/(?<=[.!?])\s+/)   // split into sentences
      .filter(line => line.trim() !== "")
      .map(line => `• ${line.trim()}`)
      .join("\n");
  }

  navigator.clipboard.writeText(formattedText).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
};

  /* ── Drag & Drop ── */
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') { setFile(f); clearErr(); }
    else setError('Only PDF files are supported.');
  };

  /* ── Bullet splitter ── */
  const toBullets = (str) =>
    str.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).map(s => s.trim());

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  return (
    <div className="dashboard" style={{ minHeight: 'unset', paddingBottom: '2rem' }}>
      <div className="dashboard__container" style={{ paddingBottom: '0' }}>

        {/* ── Page Header ── */}
        <header className="dashboard__header">
          <div className="dashboard__badge">
            <span className="dashboard__badge-pulse" />
            Powered by AI
          </div>
          <h1 className="dashboard__title">
            AI Notes <span className="gradient-text">Summarizer</span>
          </h1>
          <p className="dashboard__subtitle">
            Transform lengthy content into clear, concise summaries in seconds.
          </p>
        </header>

        {/* ── Layout ── */}
        <div className="dashboard__layout">

          {/* ───── LEFT PANEL ───── */}
          <div className="dashboard__left">

            {/* Tab switcher */}
            <div className="tab-bar" role="tablist">
              {[
                { id: 'text', label: 'Paste Text', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
                { id: 'pdf',  label: 'Upload PDF',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-4l6 4v-4"/></svg> },
              ].map(t => (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  className={`tab-btn ${tab === t.id ? 'tab-btn--active' : ''}`}
                  onClick={() => { setTab(t.id); clearErr(); setSummary(''); }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Input card */}
            <div className="input-card">
              {tab === 'text' ? (
                <>
                  <div className="input-card__header">
                    <span className="input-card__header-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/></svg>
                      Your Notes
                    </span>
                    <span className="input-card__meta">{words}w · {chars}ch</span>
                  </div>
                  <div className="input-card__body">
                    <textarea
                      id="text-input"
                      className="dashboard__textarea"
                      placeholder="Paste lecture notes, articles, research papers, or any text here…"
                      value={text}
                      onChange={e => { setText(e.target.value); clearErr(); }}
                      rows={8}
                    />
                  </div>
                  <div className="input-card__footer">
                    <span className="input-card__wordcount">{words} words</span>
                    {text && (
                      <button
                        id="clear-text-btn"
                        className="input-card__clear-btn"
                        onClick={() => { setText(''); setSummary(''); clearErr(); }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Clear
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="input-card__header">
                    <span className="input-card__header-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                      PDF Document
                    </span>
                    {file && <span className="input-card__meta">{(file.size/1024).toFixed(1)} KB</span>}
                  </div>
                  <div className="input-card__body">
                    <div
                      id="pdf-dropzone"
                      className={`dropzone ${dragOver ? 'dropzone--active' : ''} ${file ? 'dropzone--filled' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      {file ? (
                        <div className="dropzone__file-info">
                          <div className="dropzone__file-thumb">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div className="dropzone__file-details">
                            <p className="dropzone__file-name">{file.name}</p>
                            <p className="dropzone__file-size">{(file.size/1024).toFixed(1)} KB · PDF</p>
                          </div>
                          <button
                            id="remove-pdf-btn"
                            className="dropzone__remove-btn"
                            onClick={e => { e.stopPropagation(); setFile(null); setSummary(''); }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      ) : (
                        <div className="dropzone__empty">
                          <div className="dropzone__icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                          </div>
                          <p className="dropzone__title">Drop your PDF here</p>
                          <p className="dropzone__sub">or click to browse from your computer</p>
                          <span className="dropzone__pill">PDF only · Max 50MB</span>
                        </div>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="application/pdf"
                        id="pdf-input"
                        style={{ display: 'none' }}
                        onChange={e => { setFile(e.target.files[0]); clearErr(); }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Options card */}
            <div className="options-card">
              {/* Length */}
              <div className="options-section">
                <p className="options-label">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V12M12 12L8 16M12 12L16 16"/><path d="M20 7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1h16V7z"/></svg>
                  Summary Length
                </p>
                <div className="length-grid">
                  {LENGTHS.map(l => (
                    <button
                      key={l.value}
                      id={`length-${l.value}`}
                      className={`length-btn ${length === l.value ? 'length-btn--active' : ''}`}
                      onClick={() => setLength(l.value)}
                    >
                      <span className="length-btn__emoji">{l.emoji}</span>
                      <span className="length-btn__name">{l.name}</span>
                      <span className="length-btn__range">{l.range}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="options-section">
                <p className="options-label">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  Output Format
                </p>
                <div className="format-stack">
                  {FORMATS.map(f => (
                    <button
                      key={f.id}
                      id={`format-${f.id}`}
                      className={`format-btn ${format === f.id ? 'format-btn--active' : ''}`}
                      onClick={() => setFormat(f.id)}
                    >
                      <div className="format-btn__icon-box">{f.icon}</div>
                      <div>
                        <p className="format-btn__name">{f.name}</p>
                        <p className="format-btn__meta">{f.meta}</p>
                      </div>
                      <div className="format-btn__radio">
                        <div className="format-btn__radio-dot" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-alert" role="alert">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Summarize button */}
            <button
              id={tab === 'text' ? 'btn-summarize-text' : 'btn-summarize-pdf'}
              className="summarize-btn"
              onClick={tab === 'text' ? handleText : handlePDF}
              disabled={loading || (tab === 'text' ? !text.trim() : !file)}
            >
              {loading ? (
                <div className="spinner">
                  <div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" />
                </div>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  {tab === 'text' ? 'Summarize Text' : 'Summarize PDF'}
                </>
              )}
            </button>
          </div>

          {/* ───── RIGHT PANEL — Output ───── */}
          <div className="dashboard__right">
            <div className={`output-card ${summary ? 'output-card--ready' : ''}`}>

              {/* Head */}
              <div className="output-card__head">
                <div className="output-card__title-group">
                  <div className="output-card__icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <span className="output-card__title">AI Summary</span>
                  {summary && <span className="output-card__ready-chip">Ready</span>}
                </div>
                {summary && (
                  <button
                    id="copy-btn"
                    className={`copy-btn ${copied ? 'copy-btn--done' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                    )}
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="output-card__body">
                {loading && (
                  <div className="output-loading">
                    <div className="output-loading__rings">
                      <div className="output-loading__ring" />
                      <div className="output-loading__ring output-loading__ring--2" />
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="output-loading__icon">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    </div>
                    <p className="output-loading__text">AI is working its magic…</p>
                    <p className="output-loading__sub">Analyzing and summarizing your content</p>
                  </div>
                )}

                {!loading && !summary && (
                  <div className="output-empty">
                    <div className="output-empty__ring">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <p className="output-empty__title">Your summary will appear here</p>
                    <p className="output-empty__sub">Configure your options and click Summarize to begin.</p>
                    <div className="output-empty__hints">
                      {['Input your content', 'Choose length & format', 'Click Summarize'].map((h, i) => (
                        <div key={i} className="output-empty__hint">
                          <span className="output-empty__hint-num">{i + 1}</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && summary && format === 'paragraph' && (
                  <div className="summary-para">
                    <p>{summary}</p>
                  </div>
                )}

                {!loading && summary && format === 'bullets' && (
                  <ul className="summary-list">
                    {toBullets(summary).map((pt, i) => (
                      <li key={i} className="summary-list__item" style={{ animationDelay: `${i * 0.07}s` }}>
                        <span className="summary-list__dot" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {summary && (
                <div className="output-card__foot">
                  <span className="output-card__foot-meta">
                    ~{summary.split(/\s+/).filter(Boolean).length}w · {format} · {length}
                  </span>
                  <button
                    id="new-summary-btn"
                    className="output-card__new-btn"
                    onClick={() => { setSummary(''); clearErr(); }}
                  >
                    New Summary
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
