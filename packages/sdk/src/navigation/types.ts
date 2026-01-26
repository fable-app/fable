/**
 * Navigation Types
 * React Navigation type definitions for the SDK
 */

export type RootStackParamList = {
  StoryList: undefined;
  ChapterList: { bookId: string };
  Reader: { storyId: string };
};
