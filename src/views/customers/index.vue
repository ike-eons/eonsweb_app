<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="customers"
    :sort-by="[{ key: 'date_modified', order: 'desc' }]"
    class="elevation-1 mytable"
  >
    <template v-slot:top>
      <v-toolbar flat elevation-1 color="teal darken-1" dark class="lighten-2">
        <v-toolbar-title>Customers</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          outlined
          dense
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="white"
              dark
              class="mb-2 teal--text"
              v-bind="attrs"
              v-on="on"
            >
              <span class="font-weight-bold">+</span> New Customer
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="customerItem.name"
                      outlined
                      dense
                      label="Name"
                      v-on="getTouchHandlers('name')"
                      :error-messages="nameErrors"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="customerItem.phone"
                      min="0"
                      outlined
                      dense
                      label="Phone number"
                      v-on="getTouchHandlers('phone')"
                      :error-messages="phoneErrors"
                    >
                    </v-text-field>

                    <v-textarea
                      v-model="customerItem.address"
                      outlined
                      dense
                      rows="3"
                      label="address"
                      v-on="getTouchHandlers('address')"
                      :error-messages="addressErrors"
                    >
                    </v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions class="mt-n6 ml-5">
              <!-- <v-spacer></v-spacer> -->
              <v-btn
                color="teal darken-1 white--text"
                :disabled="$v.$invalid"
                @click="save"
              >
                Save
              </v-btn>
              <v-btn color="red darken-1 white--text" @click="close">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEdit" max-width="500px">
          <v-card>
            <v-card-title>Edit Customer</v-card-title>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model.trim="customerItem.name"
                    outlined
                    dense
                    label="Name"
                    v-on="getTouchHandlers('name')"
                    :error-messages="nameErrors"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="customerItem.phone"
                    min="0"
                    outlined
                    dense
                    label="Phone number"
                    v-on="getTouchHandlers('phone')"
                    :error-messages="phoneErrors"
                  >
                  </v-text-field>

                  <v-textarea
                    v-model="customerItem.address"
                    outlined
                    dense
                    rows="3"
                    label="address"
                    v-on="getTouchHandlers('address')"
                    :error-messages="addressErrors"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this customer?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        color="teal darken-2"
        @click="editCustomer(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon small color="red darken-2" @click="deleteCustomer(item)">
        mdi-delete
      </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="loadCustomers"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
import moment from "moment";
import { required } from "vuelidate/lib/validators";

// import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogEdit: false,
      search: "",
      headers: [
        {
          text: "Customer Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "Phone", value: "phone", sortable: true },
        { text: "Address", value: "address", sortable: true },
        { text: "Date Created", value: "date_created", sortable: true },
        { text: "Date Modified", value: "date_modified", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      customerIndex: -1,
      customerItem: {
        name: "",
        phone: "",
        address: "",
        date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
        date_modified: moment().format("YYYY-MM-DD h:mm:ss a"),
      },
      defaultItem: {
        name: "",
        phone: "",
        address: "",
        date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
        date_modified: moment().format("YYYY-MM-DD h:mm:ss a"),
      },
    };
  },

  validations: {
    customerItem: {
      name: {
        required,
      },
      address: {
        required,
      },
      phone: {
        required,

        validPhoneNumber(value) {
          // Define the regular expression pattern for a 10-digit phone number.
          const pattern = /^\d{10}$/;

          // Check if the value matches the pattern.
          return pattern.test(value);
        },
        uniquePhone(value) {
          if (value === "") return true;
          const customers = this.$store.state.customers.customers;
          return !customers.some((customer) => customer.phone === value);
        },
      },
    },
  },

  computed: {
    customers() {
      return this.$store.state.customers.customers;
    },
    formTitle() {
      return this.customerIndex === -1 ? "New Customer" : "Edit Customer";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.customerItem.name.$dirty) return errors;
      !this.$v.customerItem.name.required &&
        errors.push("Customer's name is required *");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.customerItem.address.$dirty) return errors;
      !this.$v.customerItem.address.required &&
        errors.push("Customer's address is required *");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.customerItem.phone.$dirty) return errors;
      !this.$v.customerItem.phone.required &&
        errors.push("Phone number is required");
      !this.$v.customerItem.phone.validPhoneNumber &&
        errors.push("Phone number must be 10 digits exactly **");
      !this.$v.customerItem.phone.uniquePhone &&
        errors.push("Phone number must be 10 unique *");

      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogEdit(val) {
      val || this.closeEdit();
    },
  },

  created() {
    this.loadCustomers();
  },

  methods: {
    getTouchHandlers(field) {
      return {
        // input: () => this.$v.customerItem[field].$touch(),
        blur: () => this.$v.customerItem[field].$touch(),
      };
    },
    async loadCustomers() {
      await this.$store.dispatch("customers/fetchCustomers");
    },

    setCustomer(item) {
      this.customerIndex = this.$store.state.customers.customers.indexOf(item);
      this.customerItem = Object.assign({}, item);
    },
    editCustomer(item) {
      this.setCustomer(item);
      this.dialog = true;
    },

    deleteCustomer(item) {
      this.setCustomer(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.$store.state.customers.customers.splice(this.customerIndex, 1);
      await this.$store.dispatch("customers/deleteCustomer", this.customerItem);
      this.closeDelete();
    },

    resetCustomerItem() {
      this.customerItem = Object.assign({}, this.defaultItem);
      this.customerIndex = -1;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.resetCustomerItem();
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.resetCustomerItem();
      });
    },
    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.resetCustomerItem();
      });
    },

    async save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.$store.dispatch(
          "customers/createCustomer",
          this.customerItem
        );
        this.loadCustomers();
      }

      this.close();
    },
  },

  async edit(customer) {
    await this.$store.dispatch("customers/editCustomer", customer);
    this.loadCustomers();
    this.closeEdit();
  },
};
</script>

<style></style>
