/**
 * كل النصوص العربية القابلة للتعديل في مكان واحد.
 * ALL editable Arabic copy for the invitation lives in this single file.
 */
export const invitationContent = {
  graduateName: 'كايلا',

  poeticLines: [
    'في يومٍ تهادَى فيه الحلمُ إلى الحقيقة',
    'وأزهرَ التعبُ فرحًا يليقُ بالسنين',
    'أدعوكم لتشاركوني لحظة تخرّجي',
  ],

  supportingLine: 'لحظةُ فخرٍ تستحق أن نحتفل بها معًا',

  location: {
    label: 'المكان',
    value: 'منزل العائلة',
    suffix: 'الخليل',
  },

  time: {
    label: 'الوقت',
    value: 'الساعة 7:00',
    suffix: 'مساءً',
  },

  date: {
    label: 'التاريخ',
    day: 'السبت',
    value: '15 آب 2026',
  },

  closingLines: ['بحضوركم يزدانُ الفرح', 'وتبقى هذه الذكرى أجمل وأقرب'],

  finalLine: 'ننتظركم بكل الحب',

  /** شاشة الافتتاح */
  gate: {
    eyebrow: 'دعوة تخرّج',
    button: 'افتحوا الدعوة',
  },

  /** نصوص واجهة صغيرة وتسميات لقارئ الشاشة */
  ui: {
    mapTooltip: 'فتح الموقع',
    calendarConfirm: 'تمت إضافة الموعد',
    openInvitation: 'افتحوا الدعوة',
    soundOn: 'تشغيل الموسيقى',
    soundOff: 'كتم الموسيقى',
    locationAction: 'فتح الموقع على الخريطة',
    dateAction: 'إضافة الموعد إلى التقويم',
    invitationLabel: 'دعوة تخرّج كايلا',
  },

  /** حدث التقويم */
  calendar: {
    title: 'حفل تخرّج كايلا',
    /** التوقيت المحلي 19:00–22:00 بتوقيت Asia/Hebron يوم 15 آب 2026 */
    startUtc: '20260815T160000Z',
    endUtc: '20260815T190000Z',
    location: 'منزل العائلة، الخليل',
    description: 'بحضوركم يزدانُ الفرح وتبقى هذه الذكرى أجمل وأقرب',
  },
} as const;

export type InvitationContent = typeof invitationContent;
