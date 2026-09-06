// context/MessageContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PatientMessage } from '../types/patient';
import { useAuth } from './AuthContext';
import { showToast } from '../components/ui/Toast.tsx';

const STORAGE_KEY = 'smart_patient_messages_v2';

interface MessageCtx {
  getMessages: (patientId: number) => PatientMessage[];
  sendMessage: (patientId: number, text: string, replyTo?: PatientMessage | null) => void;
  resetMessages: (patientId: number) => void;
}

const SEED_MESSAGES: Record<number, PatientMessage[]> = {
  0: [
    {
      id: 'm-0-1',
      patientId: 0,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 09:15 AM',
      text: 'Person 1 heart rhythm is steady and healing well from the valve procedure. Saline and morning antibiotics administered on schedule.',
    },
    {
      id: 'm-0-2',
      patientId: 0,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 10:30 AM',
      text: 'Morning broths taken smoothly and oxygen saturation is 98%. Resting comfortably in Room 401.',
    },
    {
      id: 'm-0-3',
      patientId: 0,
      senderRole: 'family',
      senderName: 'Family of Person 1',
      senderBadge: 'Family Member',
      avatar: 'P1',
      timestamp: 'Today · 11:45 AM',
      text: 'Hello Doctor 1 and Staff 1, we will be visiting during the 4:00 PM evening window. Can we bring home-cooked recovery soup?',
    },
    {
      id: 'm-0-4',
      patientId: 0,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 12:15 PM',
      text: 'Visiting at 4:00 PM is warmly welcomed! Please hold off on outside soup for today as Person 1 is on an exact sodium-controlled hospital broth. We will re-evaluate tomorrow.',
      replyToId: 'm-0-3',
      replyToSender: 'Family of Person 1',
      replyToText: 'Can we bring home-cooked recovery soup?',
    },
    {
      id: 'm-0-5',
      patientId: 0,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 12:30 PM',
      text: 'Doctor 1 dietary instructions logged in bedside chart. I will greet the family when they arrive at 4 PM.',
    },
  ],
  1: [
    {
      id: 'm-1-1',
      patientId: 1,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 08:45 AM',
      text: 'Person 2 is responding favorably to continuous oxygen support (5.5 L/min). Breath sounds clear on morning auscultation.',
    },
    {
      id: 'm-1-2',
      patientId: 1,
      senderRole: 'family',
      senderName: 'Family of Person 2',
      senderBadge: 'Family Member',
      avatar: 'P2',
      timestamp: 'Today · 10:15 AM',
      text: 'Thank you Doctor 1! Did Person 2 sleep without coughing last night?',
    },
    {
      id: 'm-1-3',
      patientId: 1,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 10:45 AM',
      text: 'Yes! Person 2 had a continuous 7 hours of peaceful sleep with warm humidified oxygen airflow. No distress noted.',
      replyToId: 'm-1-2',
      replyToSender: 'Family of Person 2',
      replyToText: 'Did Person 2 sleep without coughing last night?',
    },
  ],
  2: [
    {
      id: 'm-2-1',
      patientId: 2,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 09:30 AM',
      text: 'Person 3 post-op recovery is on track. Surgical dressing is clean and dry. Pain score is 2/10 under scheduled analgesia.',
    },
    {
      id: 'm-2-2',
      patientId: 2,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 11:00 AM',
      text: 'Assisted Person 3 to sit up for 20 minutes this morning. Tolerated well with steady blood pressure.',
    },
  ],
  3: [
    {
      id: 'm-3-1',
      patientId: 3,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 08:30 AM',
      text: 'Person 4 observation parameters are normal. Cardiac rhythm normal sinus rhythm. Discharge planning initiated.',
    },
    {
      id: 'm-3-2',
      patientId: 3,
      senderRole: 'family',
      senderName: 'Family of Person 4',
      senderBadge: 'Family Member',
      avatar: 'P4',
      timestamp: 'Today · 09:50 AM',
      text: 'Good morning care team! We are excited to hear Person 4 is doing so well. Will visiting hours be same today?',
    },
    {
      id: 'm-3-3',
      patientId: 3,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 10:10 AM',
      text: 'Yes, 10:00 AM – 1:00 PM and 4:00 PM – 7:30 PM as scheduled. See you soon!',
      replyToId: 'm-3-2',
      replyToSender: 'Family of Person 4',
      replyToText: 'Will visiting hours be same today?',
    },
  ],
  4: [
    {
      id: 'm-4-1',
      patientId: 4,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 09:00 AM',
      text: 'Person 5 limb swelling has significantly reduced. Neurovascular checks intact every 2 hours.',
    },
    {
      id: 'm-4-2',
      patientId: 4,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 11:20 AM',
      text: 'Ice pack and leg elevation maintained. Patient is comfortable and watching TV.',
    },
  ],
  5: [
    {
      id: 'm-5-1',
      patientId: 5,
      senderRole: 'doctor',
      senderName: 'Doctor 1',
      senderBadge: 'Chief ICU Specialist',
      avatar: 'D1',
      timestamp: 'Today · 08:15 AM',
      text: 'Person 6 breathing is quiet and regular. Comfort care measures and gentle repositioning continuing.',
    },
    {
      id: 'm-5-2',
      patientId: 5,
      senderRole: 'family',
      senderName: 'Family of Person 6',
      senderBadge: 'Family Member',
      avatar: 'P6',
      timestamp: 'Today · 09:40 AM',
      text: 'Thank you Doctor 1 and Staff 1 for the gentle care. We will be there by 10:30 AM.',
    },
    {
      id: 'm-5-3',
      patientId: 5,
      senderRole: 'staff',
      senderName: 'Staff 1',
      senderBadge: 'Senior Ward Nurse',
      avatar: 'S1',
      timestamp: 'Today · 10:00 AM',
      text: 'Room 406 is ready and peaceful for your visit.',
      replyToId: 'm-5-2',
      replyToSender: 'Family of Person 6',
      replyToText: 'We will be there by 10:30 AM.',
    },
  ],
};

function formatNow(): string {
  const d = new Date();
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `Today · ${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

const MessageContext = createContext<MessageCtx>({
  getMessages: () => [],
  sendMessage: () => {},
  resetMessages: () => {},
});

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<number, PatientMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to seed
    }
    return SEED_MESSAGES;
  });

  // Save to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage quota errors
    }
  }, [messages]);

  const getMessages = (patientId: number): PatientMessage[] => {
    return messages[patientId] || SEED_MESSAGES[patientId] || [];
  };

  const sendMessage = (patientId: number, text: string, replyTo?: PatientMessage | null) => {
    if (!text || !text.trim()) return;

    let senderRole: 'doctor' | 'staff' | 'family' = 'doctor';
    let senderName = 'Doctor 1';
    let senderBadge = 'Chief ICU Specialist';
    let avatar = 'D1';

    if (user?.role === 'doctor') {
      senderRole = 'doctor';
      senderName = 'Doctor 1';
      senderBadge = 'Chief ICU Specialist';
      avatar = 'D1';
    } else if (user?.role === 'staff') {
      senderRole = 'staff';
      senderName = 'Staff 1';
      senderBadge = 'Senior Ward Nurse';
      avatar = 'S1';
    } else {
      senderRole = 'family';
      senderName = `Family of Person ${patientId + 1}`;
      senderBadge = 'Family Member';
      avatar = `P${patientId + 1}`;
    }

    const newMsg: PatientMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      senderRole,
      senderName,
      senderBadge,
      avatar,
      timestamp: formatNow(),
      text: text.trim(),
      ...(replyTo && {
        replyToId: replyTo.id,
        replyToSender: replyTo.senderName,
        replyToText: replyTo.text.length > 60 ? `${replyTo.text.substring(0, 60)}…` : replyTo.text,
      }),
    };

    setMessages((prev) => {
      const currentList = prev[patientId] || SEED_MESSAGES[patientId] || [];
      return {
        ...prev,
        [patientId]: [...currentList, newMsg],
      };
    });

    const targetNotice =
      senderRole === 'doctor'
        ? 'Message posted. Visible to Staff 1 and Patient Family.'
        : senderRole === 'staff'
        ? 'Nursing note posted. Visible to Doctor 1 and Patient Family.'
        : 'Message sent. Visible to Doctor 1 and Staff 1.';

    showToast(targetNotice);
  };

  const resetMessages = (patientId: number) => {
    setMessages((prev) => ({
      ...prev,
      [patientId]: SEED_MESSAGES[patientId] || [],
    }));
    showToast(`Messages reset for Person ${patientId + 1}.`);
  };

  return (
    <MessageContext.Provider value={{ getMessages, sendMessage, resetMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessageContext);
}
