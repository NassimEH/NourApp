import { getAllReciterImageSources } from "@/lib/quran/reciter-profiles";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");
const homeBackground = require("@/assets/images/home-background.png");
const background = require("@/assets/images/background.png");
const learnHero = require("@/assets/images/learn-hero-path.png");

let warmed = false;

/**
 * Force le chargement JS des assets bundlés critiques.
 * Les portraits récitateurs + covers sont alors prêts dès le 1er paint.
 */
export function warmAppImages(): void {
  if (warmed) return;
  warmed = true;
  void getAllReciterImageSources();
  void quranArtwork;
  void homeBackground;
  void background;
  void learnHero;
}
