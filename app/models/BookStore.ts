import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api/api"
import { Book, BookModel } from "./Book"
import { withSetPropAction } from "./helpers/withSetPropAction"

// Create an instance of the api class
const apiInstance = new api();

export const BookStoreModel = types
  .model("BookStore")
  .props({
    books: types.array(BookModel),
    bookPath: types.string,
    favorites: types.array(types.reference(BookModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchBooks() {
      const response = await apiInstance.getBooks();
      if (response.kind === "ok") {
        store.setProp("books", response.books)
      } else {
        console.error(`Error fetching books: ${JSON.stringify(response)}`)
      }
    },
    async fetchBook(book: Book) {
      const response = await apiInstance.getBook(book);
      if (response.kind === "ok") {
        store.setProp("bookPath", response.bookPath);
      } else {
        console.error(`Error fetching book: ${JSON.stringify(response)}`)
      }
    },
    addFavorite(book: Book) {
      store.favorites.push(book)
    },
    removeFavorite(book: Book) {
      store.favorites.remove(book)
    },
  })) 
  .views((store) => ({
    get booksForList() {
      return store.favoritesOnly ? store.favorites : store.books
    },

    hasFavorite(book: Book) {
      return store.favorites.includes(book)
    },
  }))
  .actions((store) => ({
    toggleFavorite(book: Book) {
      if (store.hasFavorite(book)) {
        store.removeFavorite(book)
      } else {
        store.addFavorite(book)
      }
    },
  }))

export interface BookStore extends Instance<typeof BookStoreModel> {}
export interface BookStoreSnapshot extends SnapshotOut<typeof BookStoreModel> {}
