// components/patient/FamilyMessageDesk.tsx
import { useState, useRef, useEffect } from 'react';
import type { PatientMessage } from '../../types/patient';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import styles from './messageDesk.module.css';

interface Props {
  patientId: number;
  patientName: string;
  isStaff?: boolean;
}

const DOCTOR_CHIPS = [
  'Vitals & cardiac rhythm are completely stable.',
  'Morning clinical review completed. Recovery on track.',
  'Approved family visit for this afternoon.',
  'Order update: Saline flush & low-sodium broth prescribed.',
];

const STAFF_CHIPS = [
  'Vitals checked. Patient resting comfortably.',
  'Morning broths and prescribed doses administered.',
  'Family visiting window is currently open at bedside.',
  'Physician review completed by Doctor 1.',
];

const FAMILY_CHIPS = [
  'How did the patient sleep last night?',
  'What time can we visit today?',
  'Can we bring comforting items or family photos?',
  'Thank you Doctor 1 & Staff 1 for the wonderful care!',
];

export default function FamilyMessageDesk({ patientId, patientName, isStaff = false }: Props) {
  const { user } = useAuth();
  const { getMessages, sendMessage } = useMessages();
  const messages = getMessages(patientId);

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<PatientMessage | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const role = user?.role || (isStaff ? 'doctor' : 'family');

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(patientId, inputText.trim(), replyingTo);
    setInputText('');
    setReplyingTo(null);
  };

  const handleStartReply = (msg: PatientMessage) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const chips = role === 'doctor' ? DOCTOR_CHIPS : role === 'staff' ? STAFF_CHIPS : FAMILY_CHIPS;

  return (
    <div className={`${styles.messageCard} glass`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              {role === 'doctor'
                ? 'Doctor 1 Clinical Desk'
                : role === 'staff'
                ? 'Staff 1 Ward Care Desk'
                : 'Direct Family Communication Desk'}
            </span>
            <span className={styles.liveFeedTag}>
              <span className={styles.activeDot}></span>
              Live Sync Connected: Doctor 1 · Staff 1 · Family
            </span>
          </div>
          <h3 className={styles.title}>Communication Log for {patientName}</h3>
          <p className={styles.sub}>
            Messages sent here are visible in real-time to <strong>Doctor 1</strong>, <strong>Staff 1</strong>, and <strong>Family of {patientName}</strong>.
          </p>
        </div>

        <div className={styles.viewerPill}>
          <span>Current Sender:</span>
          <strong>
            {role === 'doctor'
              ? 'Doctor 1 (Lead Doctor)'
              : role === 'staff'
              ? 'Staff 1 (Senior Nurse)'
              : `Family of ${patientName}`}
          </strong>
        </div>
      </div>

      {/* Messages Thread */}
      <div className={styles.thread}>
        {messages.map((m) => {
          const isDoc = m.senderRole === 'doctor';
          const isStf = m.senderRole === 'staff';
          const bubbleClass = isDoc
            ? styles.docBubble
            : isStf
            ? styles.staffBubble
            : styles.famBubble;

          const avatarClass = isDoc
            ? styles.docAvatar
            : isStf
            ? styles.staffAvatar
            : styles.famAvatar;

          const badgeClass = isDoc
            ? styles.docBadge
            : isStf
            ? styles.staffBadge
            : styles.famBadge;

          return (
            <div key={m.id} className={`${styles.messageBubble} ${bubbleClass}`}>
              {/* Message Header */}
              <div className={styles.msgTop}>
                <div className={styles.senderWrap}>
                  <div className={`${styles.avatar} ${avatarClass}`}>
                    {m.avatar || (isDoc ? 'D1' : isStf ? 'S1' : 'FM')}
                  </div>
                  <div>
                    <span className={styles.msgSender}>{m.senderName}</span>
                    <span className={`${styles.roleBadge} ${badgeClass}`} style={{ marginLeft: 8 }}>
                      {m.senderBadge}
                    </span>
                  </div>
                </div>
                <span className={styles.msgTime}>{m.timestamp}</span>
              </div>

              {/* Quote / In Reply To Banner */}
              {m.replyToSender && m.replyToText && (
                <div className={styles.quoteBox}>
                  <div className={styles.quoteHeader}>↳ In reply to {m.replyToSender}:</div>
                  <div>"{m.replyToText}"</div>
                </div>
              )}

              {/* Message Content */}
              <p className={styles.msgText}>{m.text}</p>

              {/* Quick Reply Trigger */}
              <div className={styles.msgBottom}>
                <button
                  type="button"
                  className={styles.quickReplyBtn}
                  onClick={() => handleStartReply(m)}
                  title={`Reply to ${m.senderName}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <polyline points="9 17 4 12 9 7" />
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                  </svg>
                  Reply to {m.senderName.split(' ')[0]}
                </button>
              </div>
            </div>
          );
        })}
        <div ref={threadEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className={styles.chipsRow}>
        {chips.map((chipText) => (
          <button
            key={chipText}
            type="button"
            className={styles.chipBtn}
            onClick={() => {
              setInputText(chipText);
              inputRef.current?.focus();
            }}
          >
            + {chipText}
          </button>
        ))}
      </div>

      {/* Replying-To Active Banner */}
      {replyingTo && (
        <div className={styles.replyBanner}>
          <div className={styles.replyBannerContent}>
            <span className={styles.replyBannerLabel}>
              Replying to {replyingTo.senderName}:
            </span>
            <span className={styles.replyBannerSnippet}>"{replyingTo.text}"</span>
          </div>
          <button
            type="button"
            className={styles.cancelReplyBtn}
            onClick={() => setReplyingTo(null)}
          >
            ✕ Cancel Reply
          </button>
        </div>
      )}

      {/* Send Message Form */}
      <form className={styles.inputForm} onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          className={styles.mainInput}
          placeholder={
            replyingTo
              ? `Write reply to ${replyingTo.senderName}...`
              : role === 'doctor'
              ? 'Send clinical note or instruction (visible to Staff 1 & Family)...'
              : role === 'staff'
              ? 'Send nurse update or message (visible to Doctor 1 & Family)...'
              : `Ask question or send message for ${patientName}'s care team...`
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!inputText.trim()}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Send
        </button>
      </form>
    </div>
  );
}
