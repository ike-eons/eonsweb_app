export default {
  namespaced: true,
  state: {
    invoices: [],
    selectedInvoice: null,
  },
  getters: {
    GET_INVOICES(state) {
      return state.invoices;
    },
    SELECTED_INVOICE(state) {
      return state.selectedInvoice;
    },
  },
  mutations: {
    SET_INVOICES(state, invoices) {
      state.invoices = invoices;
    },
    SET_SELECTEDINVOICE(state, invoiceId) {
      state.selectedInvoice = state.invoices.find((i) => i.id === invoiceId);
    },
    ADD_INVOICE(state, invoice) {
      state.invoices.push(invoice);
    },
    EDIT_invoice(state, invoice) {
      state.invoice.foreach((i) => {
        if (i.id == invoice.id) {
          i = invoice;
        }
      });
    },
    DELETE_INVOICE(state, invoice) {
      let invoices = state.invoices.filter((i) => i.id !== invoice);
      state.invoices = invoices;
    },
  },
  actions: {
    async fetchInvoices({ commit }, invoices) {
      try {
        invoices = [];
        let data = await window.API.invoicesFetch(invoices);
        commit("SET_INVOICES", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async createInvoice({ commit }, invoice) {
      try {
        let data = await window.API.invoiceCreate(invoice);
        commit("ADD_INVOICE", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async updateInvoice({ commit }, invoice) {
      try {
        const updateInvoice = await window.API.invoiceUpdate(invoice);
        commit("EDIT_INVOICE", updateInvoice);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteInvoice({ commit }, invoice) {
      try {
        await window.API.invoiceDelete(invoice.id);
        commit("DELETE_INVOICE", invoice.id);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
