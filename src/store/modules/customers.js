export default {
  namespaced: true,
  state: {
    customers: [],
    selectedCustomer: null,
  },
  getters: {
    GET_CUSTOMERS(state) {
      return state.customers;
    },
    SELECTED_CUSTOMER(state) {
      return state.selectedCustomer;
    },
  },
  mutations: {
    SET_CUSTOMERS(state, customers) {
      state.customers = customers;
    },
    SET_SELECTEDCUSTOMER(state, customerId) {
      state.selectedCustomer = state.customers.find((c) => c.id === customerId);
    },
    ADD_CUSTOMER(state, customer) {
      // let customers = state.customers.push(customer);
      // state.customers = customers;
      state.customers.push(customer);
    },
    EDIT_CUSTOMER(state, customer) {
      state.customers.forEach((u) => {
        if (u.id == customer.id) {
          u = customer;
        }
      });
    },
    DELETE_CUSTOMER(state, customer) {
      let customers = state.customers.filter((u) => u.id !== customer);
      state.customers = customers;
    },
  },
  actions: {
    async fetchCustomers({ commit }, customers) {
      customers = [];
      let data = await window.API.customersFetch(customers);

      commit("SET_CUSTOMERS", data);
      return data;
    },

    async createCustomer({ commit }, customer) {
      try {
        let data = await window.API.customerCreate(customer);
        commit("ADD_CUSTOMER", data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },
    async updateCustomer({ commit }, customer) {
      try {
        let data = await window.API.customerUpdate(customer);
        commit("EDIT_CUSTOMER", data);
      } catch (error) {
        console.log(error.message);
      }
    },

    async deleteCustomer({ commit }, customer) {
      try {
        await window.API.customerDelete(customer.id);
        commit("DELETE_CUSTOMER", customer.id);
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
