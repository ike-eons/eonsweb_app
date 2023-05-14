export default {
  namespaced: true,
  state: {
    products: [],
    selectedProduct: null,
    error: "",
  },
  getters: {
    GET_PRODUCTS(state) {
      return state.products;
    },
    GET_ERROR(state) {
      return state.error;
    },
    SELECTED_PRODUCT(state) {
      return state.selectedProduct;
    },
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_SELECTEDPRODUCT(state, productId) {
      state.selectedProduct = state.products.find((p) => p.id === productId);
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product);
    },
    EDIT_PRODUCT(state, product) {
      state.products.forEach((p) => {
        if (p.id == product.id) {
          p = product;
        }
      });
    },
    DELETE_PRODUCT(state, product) {
      let products = state.products.filter((p) => p.id !== product);
      state.products = products;
    },
  },
  actions: {
    async fetchProducts({ commit }, products) {
      products = [];
      let data = await window.API.productsFetch(products);
      commit("SET_PRODUCTS", data);
      return data;
    },

    async createProduct({ commit }, product) {
      try {
        let data = await window.API.productCreate(product);

        if (data.error) {
          commit("SET_ERROR", data.error);
        } else {
          commit("ADD_PRODUCT", product);
          commit("SET_ERROR", "");
          return data;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async updateProduct({ commit }, product) {
      try {
        const updateProduct = await window.API.productUpdate(product);
        console.log(updateProduct.error);

        if (updateProduct.error) {
          commit("SET_ERROR", updateProduct.error);
        } else {
          commit("EDIT_PRODUCT", updateProduct);
          commit("SET_ERROR", "");
          return updateProduct;
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    async deleteProduct({ commit }, product) {
      try {
        await window.API.productDelete(product.id);
        commit("DELETE_PRODUCT", product.id);
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
