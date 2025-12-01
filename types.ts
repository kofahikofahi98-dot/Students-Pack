

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
  saveImage: string; // New key
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
  // Premium
  proPack: string;
  unlockPro: string;
  locked: string;
  projectGenie: string;
  crushCalc: string;
  outfitRater: string;
  cvBuilder: string;
  buyNow: string;
  proDescription: string;
  // Project Genie
  projectMajor: string;
  projectInterests: string;
  projectInterestsPlaceholder: string;
  generateIdeas: string;
  ideasResult: string;
  // Crush Calc
  yourName: string;
  crushName: string;
  calcLove: string;
  loveScore: string;
  // Outfit
  uploadOutfit: string;
  rateFit: string;
  judgeMe: string;
  // CV
  major: string;
  skills: string;
  skillsPlaceholder: string;
  generateCV: string;
  cvResult: string;
  // Roast Schedule
  scheduleRoaster: string;
  pasteSchedule: string;
  roastMySchedule: string;
  roastResult: string;
  // Dorm Chef
  dormChef: string;
  ingredients: string;
  ingredientsPlaceholder: string;
  cookSomething: string;
  chefResult: string;
  // Distinguished Students
  smartSummarizer: string;
  summarizerDesc: string;
  pasteNotes: string;
  summarizeBtn: string;
  summaryResult: string;
  examSimulator: string;
  examDesc: string;
  examTopic: string;
  examTopicPlaceholder: string;
  generateExam: string;
  showAnswer: string;
  nerdCorner: string;
  // Elite Zone
  eliteZone: string;
  eliteZoneDesc: string;
  conceptSimplifier: string;
  debateArena: string;
  simplifyConcept: string;
  complexityLevel: string;
  levelChild: string;
  levelStudent: string;
  levelExpert: string;
  explainBtn: string;
  debateTopic: string;
  debateTopicPlaceholder: string;
  startDebate: string;
  aiCounter: string;
  debateDesc: string;
  tryThese: string;
  // Executive Suite
  executiveSuite: string;
  executiveDesc: string;
  linkedInOptimizer: string;
  careerRoadmap: string;
  currentRole: string;
  dreamJob: string;
  optimizeProfile: string;
  optimizedResult: string;
  roadmapMajor: string;
  generateRoadmap: string;
  roadmapResult: string;
  // Navigation
  prevTool: string;
  nextTool: string;
  backToDash: string;
  // UPDATED FEATURES
  bingoMode: string;
  modeGeneral: string;
  modeExams: string;
  modeOnline: string;
  filterAll: string;
  filterFood: string;
  filterExam: string;
  filterMoney: string;
  filterSocial: string;
  quickTemplates: string;
  templateSick: string;
  templateGrade: string;
  templateExtension: string;
  difficulty: string;
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  budgetLabel: string;
  budgetBroke: string;
  budgetRich: string;
  // Content & Share
  contentLang: string;
  shareWhatsApp: string;
  shareCopy: string;
  copied: string;
  // NEW PREMIUM
  roommateContract: string;
  contractDesc: string;
  badHabits: string;
  badHabitsPlaceholder: string;
  generateContract: string;
  instaCaptions: string;
  photoDesc: string;
  photoDescPlaceholder: string;
  generateCaptions: string;
  dreamInterpreter: string;
  dreamDesc: string;
  dreamPlaceholder: string;
  interpretDream: string;
  // Coffee Reader
  coffeeReader: string;
  uploadCoffee: string;
  readingFortune: string;
  yourFortune: string;
  // Uni Hub
  uniHub: string;
  uniHubDesc: string;
  foodCoffee: string;
  contacts: string;
  transport: string;
  tools: string;
  callNow: string;
  absenceCalc: string;
  lecturesPerWeek: string;
  missedLectures: string;
  calcAbsence: string;
  absenceResult: string;
  safe: string;
  warning: string;
  danger: string;
  // New Uni Tools
  cgpaForecaster: string;
  currentCGPA: string;
  passedHoursLabel: string;
  semesterGPA: string;
  semesterHoursLabel: string;
  calculateEffect: string;
  newCGPA: string;
  todoList: string;
  addTodo: string;
  // Business Listing
  addBusiness: string;
  areYouOwner: string;
  listYourBiz: string;
  bizFormTitle: string;
  bizNameLabel: string;
  bizPhoneLabel: string;
  bizTypeLabel: string;
  subscriptionPrice: string;
  payAndPublish: string;
  listingSuccess: string;
  listingSuccessMsg: string;
  // Menu Features
  viewMenu: string;
  menu: string;
  uploadMenu: string;
  noMenu: string;
  // Sections
  sectionEssentials: string;
  sectionFun: string;
  sectionStudy: string;
  sectionUniServices: string;
  sectionSurvival: string;
  sectionUniHub: string;
}

export interface University {
  id: string;
  nameEn: string;
  nameAr: string;
  logo: string; // Added logo
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
    isCheap: boolean;
}

export interface ExamQuestion {
  question: string;
  options?: string[];
  answer: string;
}

// Uni Services Types
export interface Restaurant {
    nameEn: string;
    nameAr: string;
    phone: string;
    type: 'coffee' | 'shawerma' | 'burger' | 'other';
    rating: string;
    logo?: string; // Added restaurant logo
    menu?: string; // Added restaurant menu URL
}

export interface Contact {
    nameEn: string;
    nameAr: string;
    phone: string;
}

export interface BusRoute {
    nameEn: string;
    nameAr: string;
    stops: string;
}

export interface UniServices {
    restaurants: Restaurant[];
    contacts: Contact[];
    busRoutes: BusRoute[];
}