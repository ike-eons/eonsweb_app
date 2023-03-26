export default {
  namespaced: true,
  state: {
    categories: [],
    selectedCategory: null,
  },
  getters: {
    GET_CATEGORIES(state) {
      return state.categories;
    },
    SELECTED_CATEGORY(state) {
      return state.selectedCategory;
    },
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_SELECTEDCATEGORY(state, categoryId) {
      state.selectedCategory = state.categories.find(
        (c) => c.id === categoryId
      );
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category);
    },
    EDIT_CATEGORY(state, category) {
      state.categories.forEach((u) => {
        if (u.id == category.id) {
          u = category;
        }
      });
    },
    DELETE_category(state, category) {
      let categories = state.categories.filter((u) => u.id !== category);
      state.categories = categories;
    },
  },
  actions: {
    async fetchCategories({ commit }, categories) {
      categories = [];
      let data = await window.API.categoriesFetch(categories);

      commit("SET_CATEGORIES", data);
      return data;
    },

    async createCategory({ commit }, category) {
      try {
        let data = await window.API.categoryCreate(category);
        commit("ADD_CATEGORY", data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },
    async updateCategory({ commit }, category) {
      try {
        let data = await window.API.categoryUpdate(category);
        commit("EDIT_CATEGORY", data);
      } catch (error) {
        console.log(error.message);
      }
    },

    async deleteCategory({ commit }, category) {
      try {
        await window.API.categoryDelete(category.id);
        commit("DELETE_CATEGORY", category.id);
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
