/**
 * UI chrome strings for the two supported locales. Content (concepts,
 * questions) lives in its own per-locale collection/file — this covers only
 * the fixed nav/button/label text around it.
 */
export type Lang = "en" | "fr";

const strings = {
  en: {
    lang: "en" as const,
    otherLang: "fr" as const,
    otherLangLabel: "Français",
    nav: { concepts: "Concepts", quiz: "Quiz", playground: "Playground" },
    footer:
      'Concepts follow the chapter structure of "Advanced Java" by Andriy Redko. ' +
      "Explanations and questions are written independently.",
    madeWith: "Made with",
    by: "by",
    baseDescription: "Advanced Java concepts, drilled.",
    home: {
      pageTitle: "Advanced Java — concepts",
      countSummary: (concepts: number, questions: number) =>
        `${concepts} concepts · ${questions} questions`,
      h1: "The parts of Java that behave differently from how they read.",
      intro:
        "Erasure, initialisation order, overload resolution, the memory model. Read the " +
        "concept, then prove you have it — and run the code yourself when the answer " +
        "surprises you.",
      startQuiz: "Start a quiz",
      openPlayground: "Open the playground",
      qLabel: "q",
    },
    concept: {
      pageTitle: (title: string) => `${title} — Advanced Java`,
      allConcepts: "All concepts",
      questionsOnConcept: (n: number) => `${n} questions on this concept`,
      drillIt: "Drill it",
    },
    quiz: {
      pageTitle: "Quiz — Advanced Java",
      eyebrow: "Quiz",
      h1: "Prove you have it",
      typeLabels: {
        mcq: "Multiple choice",
        output: "Predict the output",
        flashcard: "Recall",
        fill: "Fill the blank",
      },
      runComplete: "Run complete",
      scoreLine: (right: number, total: number) => `${right} of ${total} correct`,
      goAgain: "Go again",
      correct: "Correct",
      notQuite: "Not quite",
      showAnswer: "Show answer",
      check: "Check",
      missedIt: "Missed it",
      knewIt: "Knew it",
      next: "Next",
      readConcept: "Read the concept",
      outputPlaceholder: "Type exactly what the program prints",
    },
    playground: {
      pageTitle: "Playground — Advanced Java",
      eyebrow: "Playground",
      h1: "Run it and see",
      intro:
        "A complete JVM compiled to WebAssembly, running in this tab. javac is itself " +
        "written in Java, so your source is compiled and executed without anything " +
        "leaving your machine. The runtime is a large first download and is cached " +
        "afterwards.",
      license:
        "Powered by CheerpJ. Free for personal projects and technical evaluation — " +
        "check the licence before putting this behind a commercial product.",
      fileLabel: "Main.java · compiled in your browser",
      starting: "Starting the JVM…",
      running: "Running…",
      run: "Run",
      compilerOutput: "Compiler output",
      output: "Output",
      downloading: "Downloading the Java runtime. This happens once, then it is cached.",
      pressRun: "Press Run.",
      noOutput: "(no output)",
    },
  },
  fr: {
    lang: "fr" as const,
    otherLang: "en" as const,
    otherLangLabel: "English",
    nav: { concepts: "Concepts", quiz: "Quiz", playground: "Bac à sable" },
    footer:
      'La sélection des concepts suit la structure des chapitres de « Advanced Java » ' +
      "d'Andriy Redko. Les explications et les questions sont rédigées de façon indépendante.",
    madeWith: "Fait avec",
    by: "par",
    baseDescription: "Des concepts Java avancés, à force de pratique.",
    home: {
      pageTitle: "Java avancé — concepts",
      countSummary: (concepts: number, questions: number) =>
        `${concepts} concepts · ${questions} questions`,
      h1: "Les parties de Java qui ne se comportent pas comme elles se lisent.",
      intro:
        "Effacement de type, ordre d'initialisation, résolution de surcharge, modèle " +
        "mémoire. Lisez le concept, puis prouvez que vous le maîtrisez — et exécutez le " +
        "code vous-même quand la réponse vous surprend.",
      startQuiz: "Lancer un quiz",
      openPlayground: "Ouvrir le bac à sable",
      qLabel: "q",
    },
    concept: {
      pageTitle: (title: string) => `${title} — Java avancé`,
      allConcepts: "Tous les concepts",
      questionsOnConcept: (n: number) => `${n} questions sur ce concept`,
      drillIt: "S'entraîner",
    },
    quiz: {
      pageTitle: "Quiz — Java avancé",
      eyebrow: "Quiz",
      h1: "Prouvez que vous le maîtrisez",
      typeLabels: {
        mcq: "Choix multiple",
        output: "Prédire la sortie",
        flashcard: "Rappel",
        fill: "Texte à trous",
      },
      runComplete: "Session terminée",
      scoreLine: (right: number, total: number) => `${right} sur ${total} correctes`,
      goAgain: "Recommencer",
      correct: "Correct",
      notQuite: "Pas tout à fait",
      showAnswer: "Voir la réponse",
      check: "Vérifier",
      missedIt: "Raté",
      knewIt: "Je savais",
      next: "Suivant",
      readConcept: "Lire le concept",
      outputPlaceholder: "Tapez exactement ce que le programme affiche",
    },
    playground: {
      pageTitle: "Bac à sable — Java avancé",
      eyebrow: "Bac à sable",
      h1: "Exécutez et voyez",
      intro:
        "Une JVM complète compilée en WebAssembly, exécutée dans cet onglet. javac est " +
        "lui-même écrit en Java, donc votre code source est compilé et exécuté sans que " +
        "rien ne quitte votre machine. Le runtime représente un gros téléchargement la " +
        "première fois, puis il est mis en cache.",
      license:
        "Propulsé par CheerpJ. Gratuit pour les projets personnels et l'évaluation " +
        "technique — vérifiez la licence avant de l'utiliser derrière un produit commercial.",
      fileLabel: "Main.java · compilé dans votre navigateur",
      starting: "Démarrage de la JVM…",
      running: "Exécution…",
      run: "Lancer",
      compilerOutput: "Sortie du compilateur",
      output: "Sortie",
      downloading: "Téléchargement du runtime Java. Cela n'arrive qu'une fois, puis il est mis en cache.",
      pressRun: "Cliquez sur Lancer.",
      noOutput: "(aucune sortie)",
    },
  },
} as const;

export function t(lang: Lang) {
  return strings[lang];
}

/** Prefixes a path with /fr for the French site; leaves English unprefixed. */
export function localizePath(lang: Lang, path: string): string {
  if (lang !== "fr") return path;
  return path === "/" ? "/fr" : `/fr${path}`;
}

/** Inverse of localizePath — strips a /fr prefix to get the locale-agnostic path. */
export function delocalizePath(pathname: string): string {
  if (!pathname.startsWith("/fr")) return pathname;
  return pathname.slice(3) || "/";
}
