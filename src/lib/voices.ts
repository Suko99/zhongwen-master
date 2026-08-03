// Identifiants de voix neuronales (service Edge) — fichier partagé, sans
// "server-only", pour être importable à la fois par le serveur
// (src/lib/neuralTts.ts) et par les composants clients qui veulent choisir
// une voix précise (ex. la Conversation IA pour la voix de 小龙).
export const NEURAL_VOICES = {
  default: "zh-CN-XiaoxiaoNeural", // voix féminine, chaleureuse, la plus recommandée
  conversationPartner: "zh-CN-YunxiNeural", // voix masculine jeune, pour 小龙
} as const;
