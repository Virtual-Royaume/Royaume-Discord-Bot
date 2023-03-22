import { Titles } from "$core/events/forum-search/forum-search.type";

export const getSimilarTitles = (title: string, titles: Titles): Titles => {
  const similarTitles: Titles = {};
  const titleWords = title.split(" ");

  for (const t in titles) {
    let similarWords = 0;
    for (const word of titleWords) {
      if (word.length <= 3) continue;
      if (t.includes(word)) similarWords++;
    }

    if (similarWords > 0) similarTitles[t] = titles[t];
  }

  return similarTitles;
};