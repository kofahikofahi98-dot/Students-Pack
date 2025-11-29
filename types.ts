
export type Language = 'en' | 'ar';

export interface Translation {
  title: string;
  subtitle: string;
  startQuiz: string;
  university: string;
  selectUni: string;
  loading: string;
  results: string;
  share: string;
  playBingo: string;
  memeGallery: string;
  survivalGuide: string;
  stickers: string;
  planner: string;
  back: string;
  next: string;
  generateNew: string;
  score: string;
  download: string;
  aiStudio: string;
  sketchGen: string;
  enterPrompt: string;
  generate: string;
  generating: string;
  addCaption: string;
  captionPlaceholder: string;
  addTextLayer: string;
  textControls: string;
  deleteLayer: string;
  dragToMove: string;
  textColor: string;
  textBg: string;
  // New Features
  gpaCalc: string;
  currentGpa: string;
  creditHours: string;
  calculate: string;
  studentStatus: string;
  emailWizard: string;
  emailTopic: string;
  emailRecipient: string;
  emailTone: string;
  toneFormal: string;
  toneDesperate: string;
  generateEmail: string;
  copyText: string;
  foodRoulette: string;
  spin: string;
  eatThis: string;
  dashboard: string;
  // Meme Updates
  memeTopicLabel: string;
  memeTopicPlaceholder: string;
}

export interface University {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface QuizQuestion {
  id: number;
  questionEn: string;
  questionAr: string;
  options: {
    id: string;
    textEn: string;
    textAr: string;
    score: number;
  }[];
}

export interface BingoCell {
  id: number;
  textEn: string;
  textAr: string;
  checked: boolean;
}

export interface SurvivalTip {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  category: 'exam' | 'food' | 'social' | 'money';
}

export interface Sticker {
  id: number;
  url: string;
  labelEn: string;
  labelAr: string;
}

export interface FoodItem {
    id: string;
    nameEn: string;
    nameAr: string;
    icon: string;
    color: string;
}
