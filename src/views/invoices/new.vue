<template>
  <div>
    <v-row>
      <v-col cols="8" class="invoice-bg">
        <v-card class="py-5 px-2">
          <v-card-text>
            <v-row>
              <v-row>
                <v-col cols="8">
                  <div>
                    <span class="subtitle-2"
                      >Select Item {{ invoice.payment_type }}</span
                    >
                  </div>
                  <v-autocomplete
                    v-model="selectedItem"
                    :items="products"
                    color="teal"
                    dense
                    outlined
                    item-value="id"
                    item-text="description"
                    @change="$v.selectedItem.$touch()"
                    @blur="$v.selectedItem.$touch()"
                    :error-messages="productError"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="2">
                  <div><span class="subtitle-2">Quantity</span></div>
                  <v-text-field
                    v-model="quantity"
                    dense
                    outlined
                    color="teal"
                    type="number"
                    oninput="validity.valid||(value='');"
                    min="1"
                    @input="$v.quantity.$touch()"
                    @blur="$v.quantity.$touch()"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="2">
                  <div class="btn-column">
                    <!-- <button
                      color="teal"
                      class="btn-add"
                      @click="addRow()"
                      :disabled="$v.$invalid"
                      depressed
                    >
                      +&nbsp;Add
                    </button> -->
                    <v-btn
                      x-large
                      color="teal"
                      class="mt-4 white--text"
                      block
                      @click="addRow()"
                      :disabled="$v.$invalid"
                      depressed
                    >
                      <span class="font-weight-bolder">+</span> Add
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-divider class="my-2"></v-divider>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :fixed-header="true"
                  :headers="headers"
                  :items="invoice.invoice_items"
                  :hide-default-footer="true"
                  dense
                  class="mytable"
                >
                  <template v-slot:[`header.actions`]="{ header }">
                    <span class="action_color">
                      <i class="fa fa-bolt"></i>{{ header.text }}
                    </span>
                  </template>
                  <template v-slot:[`item.numbering`]="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:[`item.sales_price`]="{ item }">
                    {{ item.sales_price.toFixed(2) }}
                  </template>
                  <template v-slot:[`item.quantity`]="{ item, index }">
                    <div class="quantity-group">
                      <input
                        type="button"
                        value="-"
                        class="qtyminus"
                        @click="qtyminus(index)"
                      />

                      <input
                        type="text"
                        name="quantity"
                        v-model="item.quantity"
                        class="qtyinput"
                      />

                      <input
                        type="button"
                        value="+"
                        class="qtyplus"
                        @click="qtyplus(index)"
                      />
                    </div>
                  </template>
                  <template v-slot:[`item.unit_cost`]="{ item }">
                    {{ item.unit_cost.toFixed(2) }}
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                      id="deletebutton"
                      small
                      color="#d93440"
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Invoice Item  -->
      <v-col cols="4" class="invoice-section">
        <v-card>
          <v-toolbar color="teal" dark flat>
            <strong>Invoice Details</strong>
            <v-spacer></v-spacer>
            <span class="subtitle-2">{{ invoice.date }}</span>
          </v-toolbar>

          <v-card-text>
            <v-row class="mb-n8">
              <v-col cols="12" v-if="invoice.payment_type === 1">
                <div class="py-5 headline black--text">
                  <v-icon class="black--text">fas fa-money-bill-wave</v-icon>
                  <span> CASH CUSTOMER </span>

                  <v-icon>fas fa-user-circle</v-icon>
                </div>
              </v-col>
              <v-col cols="12" v-else-if="invoice.payment_type === 2">
                <div><span class="subtitle-2">Select Customer</span></div>

                <div class="mt-2">
                  <v-autocomplete
                    v-model="selectedCustomer"
                    :items="customers"
                    item-text="name"
                    item-value="id"
                    color="teal"
                    dense
                    outlined
                  >
                  </v-autocomplete>
                </div>
                <div class="invoiceErrors">
                  <v-alert
                    class="mt-n3"
                    dense
                    text
                    type="error"
                    v-show="errorMessage.errorId === 2"
                    style="font-size: 16px !important"
                  >
                    {{ errorMessage.message }}
                  </v-alert>
                </div>
              </v-col>
              <v-col cols="12" v-else-if="invoice.payment_type === 3">
                <div>
                  <span class="subtitle-2">Mobile Money</span>
                  <v-text-field
                    v-model="momo_number"
                    outlined
                    dense
                    placeholder="Enter Mobile Money Number"
                  >
                  </v-text-field>
                </div>
                <div class="invoiceErrors">
                  <v-alert
                    class="mt-n3"
                    dense
                    text
                    type="error"
                    v-show="errorMessage.errorId === 3"
                  >
                    {{ errorMessage.message }}
                  </v-alert>
                  <v-alert
                    class="mt-n3"
                    dense
                    text
                    type="error"
                    v-show="errorMessage.errorId === 4"
                  >
                    {{ errorMessage.message }}
                  </v-alert>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-toolbar color="#d9dddc" flat>
            <strong>Subtotal</strong>
            <v-spacer></v-spacer>
            <strong>GH¢{{ sub_total }}</strong>
          </v-toolbar>
          <v-toolbar flat class="mt-n5" color="#d9dddc">
            <strong>Tax</strong>
            <v-spacer></v-spacer>
            <strong>{{ tax }}%</strong>
          </v-toolbar>
          <v-divider></v-divider>
          <v-toolbar color="#d9dddc" flat>
            <strong>Grand Total</strong>
            <v-spacer></v-spacer>
            <strong>{{ total | currency("GH¢") }}</strong>
          </v-toolbar>
          <v-divider></v-divider>
          <v-toolbar flat> <strong>Payment Method</strong><br /> </v-toolbar>

          <v-item-group mandatory class="mt-n1">
            <v-container>
              <v-row>
                <v-col v-for="(item, index) in payment_types" :key="index">
                  <v-item
                    v-slot="{ active, toggle }"
                    :value="item.id"
                    @click="getPaymentType(item.id)"
                  >
                    <v-card
                      :color="active ? 'success' : 'white'"
                      class="d-flex align-center"
                      dark
                      height="70"
                      @click="toggle"
                    >
                      <v-row @click="getPaymentType(item.id)">
                        <v-col cols="12" md="12">
                          <v-list-item three-line class="text-center mt-1">
                            <v-list-item-content>
                              <div>
                                <v-icon :color="active ? 'white' : 'black'">
                                  {{ item.icon }}
                                </v-icon>
                              </div>
                              <v-list-item-subtitle
                                :class="active ? 'whit--text' : 'black--text'"
                                class="mt-n2 caption"
                              >
                                {{ item.text }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
          <v-divider></v-divider>
          <v-toolbar flat height="140px" class="submitToolbar">
            <v-row>
              <v-col cols="12">
                <div class="invoiceItemError" v-show="lengthOfinvoiceItem <= 0">
                  {{ invoiceItemError }}
                </div>
              </v-col>
              <v-col cols="12" class="mt-n5">
                <v-btn
                  block
                  x-large
                  class="mb-3"
                  color="blue"
                  dark
                  @click="save"
                >
                  Print Invoice
                </v-btn>
              </v-col>
            </v-row>
          </v-toolbar>
          <!-- <v-toolbar flat>
            <v-btn block x-large color="teal" dark @click="save">Save</v-btn>
          </v-toolbar>
          <v-toolbar flat>
            <v-btn block x-large color="red" dark>Cancel</v-btn>
          </v-toolbar> -->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from "moment";
import { required, integer } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      selectedItem: null,
      selectedCustomer: null,
      momo_number: null,
      id: null,
      quantity: null,
      invoiceItemLength: null,
      invoiceErrors: {},
      invoiceItemError: "",

      tax: 0.1,
      headers: [
        { text: "#", value: "numbering", width: "8%" },
        { text: "Product Info", value: "description", align: "left" },
        { text: "Price", value: "sales_price", align: "center" },
        { text: "Quantity", value: "quantity", align: "center" },
        { text: "Total", value: "unit_cost", align: "center" },
        {
          text: "",
          value: "actions",
          sortable: false,
          width: "5%",
        },
      ],
      payment_types: [
        { id: 1, name: "cash", text: "Cash", icon: "fas fa-money-bill-wave" },
        { id: 2, name: "credit", text: "Credit", icon: "fas fa-credit-card" },
        {
          id: 3,
          name: "mobile_money",
          text: "Mobile Money",
          icon: "fas fa-qrcode",
        },
      ],
      invoice: {
        date: moment().format("yyyy-MM-DD hh:mm:ss", true),
        total: 0.0,
        amount_paid: 0.0,
        customer_id: null,
        momo_number: null,
        invoice_items: [],
        payment_type: 1,
      },
      editedIndex: 0,
      defaultItem: {
        index: 0,
        sales_price: 0,
        description: "",
        quantity: 0,
        product_id: null,
        unit_cost: 0,
      },
    };
  },
  validations: {
    quantity: {
      required,
      integer,
    },

    selectedItem: {
      async uniqueProduct(value) {
        if (value == "") return true;

        const items = await this.invoice.invoice_items.map(
          (item) => item.product_id
        );
        const item_already_exist = items.find((item) => item === value);
        if (item_already_exist) {
          return false;
        }
        return true;
      },
    },
  },
  watch: {
    selectedCustomer(val) {
      if (val != null) {
        this.invoiceErrors = {};
      }
    },
    momo_number(val) {
      if (val != null) {
        this.invoiceErrors = {};
      }
    },
  },
  computed: {
    lengthOfinvoiceItem() {
      return this.invoice.invoice_items.length;
    },
    errorMessage() {
      return this.invoiceErrors;
    },
    submitError() {
      return this.invoiceItemError;
    },
    sub_total() {
      return this.calculateSubTotal();
    },
    total() {
      return this.calculateTotal(this.invoice.invoice_items);
    },
    customers() {
      return this.$store.state.customers.customers;
    },
    products() {
      return this.$store.state.products.products;
    },
    quantityErrors() {
      const errors = [];
      if (!this.$v.quantity.$dirty) return errors;
      !this.$v.quantity.integer && errors.push("Quantity value is INVALID*");
      !this.$v.quantity.required && errors.push("Quantity is required*");
      return errors;
    },
    productError() {
      const errors = [];
      if (!this.$v.selectedItem.$dirty) return errors;
      !this.$v.selectedItem.uniqueProduct &&
        errors.push("Item already Selected*");
      return errors;
    },
  },
  methods: {
    addRow() {
      // this.$v.touch();
      if (!this.$v.invalid) {
        this.defaultItem.index++;
        this.defaultItem.product_id = this.selectedItem;
        this.editedIndex = this.products.findIndex(
          (product) => product.id == this.selectedItem
        );
        this.defaultItem.sales_price =
          this.products[this.editedIndex]["sales_price"];
        this.defaultItem.quantity = parseInt(this.quantity);
        this.defaultItem.description =
          this.products[this.editedIndex]["description"];
        let u_cost = (
          this.quantity * this.products[this.editedIndex]["sales_price"]
        ).toFixed(2);
        console.log(u_cost);
        this.defaultItem.unit_cost = parseFloat(u_cost);
        this.invoice.invoice_items.push(Object.assign({}, this.defaultItem));
      }
      this.clear();
    },
    qtyminus(index) {
      let decrement = this.invoice.invoice_items[index].quantity;
      this.invoice.invoice_items[index].quantity = decrement - 1;
      if (this.invoice.invoice_items[index].quantity < 1) {
        this.invoice.invoice_items[index].quantity = 1;
      }
      return this.invoice.invoice_items[index].quantity;
    },
    qtyplus(index) {
      let increment = this.invoice.invoice_items[index].quantity;
      this.invoice.invoice_items[index].quantity = increment + 1;
      return this.invoice.invoice_items[index].quantity;
    },
    deleteItem(item) {
      item = this.products.findIndex(
        (product) => product.id == this.selectedItem
      );
      console.log(item);
      // this.products.push(item)
      this.invoice.invoice_items.splice(item, 1);
    },

    calculateSubTotal() {
      let subtotal = this.invoice.invoice_items
        .map((item) => parseFloat(item.unit_cost))
        .reduce((accumulator, item) => accumulator + item, 0);
      return parseFloat(subtotal.toFixed(2));
    },
    calculateTotal() {
      this.invoice.total =
        this.calculateSubTotal() * this.tax + this.calculateSubTotal();
      return parseFloat(this.invoice.total).toFixed(2);
    },
    clear() {
      // this.$v.reset();
      this.selectedItem = null;
      this.quantity = null;
    },
    getPaymentType(id) {
      let selected_payment = this.payment_types.find(
        (payment_type) => payment_type.id == id
      );

      console.log(selected_payment.id);

      if (selected_payment.id == 2) {
        this.invoice.payment_type = 2;
        this.invoiceErrors = {};
      } else if (selected_payment.id == 3) {
        this.invoice.payment_type = 3;
        this.invoiceErrors = {};
      } else {
        this.invoice.payment_type = 1;
      }
    },

    async save() {
      if (this.invoice.invoice_items.length < 1) {
        this.invoiceItemError = "Please add Item to Cart*";
        return this.invoiceItemError;
      } else if (
        this.invoice.payment_type === 2 &&
        this.selectedCustomer === null
      ) {
        this.invoiceErrors = {
          errorId: 2,
          message: "Please select a customer*",
        };

        return console.log(this.invoiceErrors);
      } else if (this.invoice.payment_type === 3 && this.momo_number === null) {
        this.invoiceErrors = {
          errorId: 3,
          message: "please enter MoMo number*",
        };

        return console.log(this.invoiceErrors);
      } else if (
        this.invoice.payment_type == 3 &&
        this.momo_number.length !== 10
      ) {
        console.log("exactly 10");
        this.invoiceErrors = {
          errorId: 4,
          message: "MoMo number must be exactly 10 digits*",
        };
        return this.invoiceErrors;
      } else if (
        this.invoice.payment_type == 3 &&
        this.momo_number !== null &&
        this.momo_number.length === 10
      ) {
        this.invoice.momo_number = this.momo_number;
        this.invoice.customer_id = 1;
      } else if (
        this.invoice.payment_type === 2 &&
        this.selectedCustomer !== null
      ) {
        this.invoice.customer_id = this.selectedCustomer;
      } else if (this.invoice.payment_type === 1) {
        this.invoice.customer_id = 1;
        this.invoice.amount_paid = this.calculateTotal();
      }
      console.log("this is just a test");
      await this.$store.dispatch("invoices/createInvoice", this.invoice);
    },
  },
};
</script>

<style>
.mytable tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.action_color {
  color: var(--red-color);
}
.v-btn {
  text-transform: none !important;
}
.quantity-group {
  display: flex;
}
.qtyinput {
  width: 40px;
  height: 25px;
  text-align: center;
  outline: none;
  border: none;
  background-color: #f9f9f9;
  font-size: 14px;
}
input.qtyplus,
input.qtyminus {
  width: 25px;
  height: 25px;
  border: none;
  font-size: 18px;
}
input.qtyplus {
  outline: none;
  border-radius: 0 2px 2px 0;
  background-color: #188752;
  color: #fff;
}
input.qtyminus {
  border-radius: 2px 0 0 2px;
  background-color: #ffc109;
  color: #fff;
  outline: none;
}

.payment-card-bg {
  background-color: var(--light-teal-2) !important;
  background-color: #188752 !important;
}

.btn-column {
  display: block;
}
.btn-add {
  display: block !important;
  margin-top: 7px;
  margin-right: 5px;
  background-color: var(--dark-teal);
  color: var(--white-color);
  padding: 18px 20px;
  border-radius: 5px;
  font-size: 20px;
}

.invoiceItemError {
  color: red;
  /* background-color: rgb(253, 187, 187); */
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  margin-top: -25px;
}
</style>
