<template>
  <v-container fluid style="width: 100%">
    <v-data-table
      :fixed-header="true"
      :headers="headers"
      :search="search"
      :items="products"
      sort-by="description"
      class="elevation-1 mytable"
    >
      <template v-slot:[`item.numbering`]="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:top>
        <v-toolbar flat color="teal" dark>
          <v-toolbar-title>products</v-toolbar-title>
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
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="white"
                class="mb-2 teal--text"
                v-bind="attrs"
                v-on="on"
              >
                <span class="font-weight-bold">+</span> New Product
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="productItem.description"
                        dense
                        rows="2"
                        outlined
                        label="Product's Description"
                        @input="$v.productItem.description.$touch()"
                        @blur="$v.productItem.description.$touch()"
                        :error-messages="descriptionErrors"
                      >
                      </v-textarea>

                      <v-text-field
                        v-model="productItem.stock_price"
                        outlined
                        dense
                        type="number"
                        label="Stock Price"
                        step=".01"
                        @input="$v.productItem.stock_price.$touch()"
                        @blur="$v.productItem.stock_price.$touch()"
                        :error-messages="stockPriceErrors"
                      >
                      </v-text-field>

                      <v-text-field
                        v-model="productItem.sales_price"
                        type="number"
                        outlined
                        dense
                        label="Sales Price"
                        step=".01"
                        @input="$v.productItem.sales_price.$touch()"
                        @blur="$v.productItem.sales_price.$touch()"
                        :error-messages="salesPriceErrors"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col class="d-flex" cols="12">
                      <v-select
                        :items="categories"
                        item-text="name"
                        item-value="id"
                        v-model="productItem.category_id"
                        label="Select Product's Category"
                        outlined
                      >
                      </v-select>
                    </v-col>
                    <v-col>
                      <v-alert
                        class="mt-n5"
                        dense
                        text
                        type="error"
                        v-show="errorMessage != ''"
                      >
                        <span class="text-body-2" style="color: red"
                          >`{{ productItem.description }}` already exist.</span
                        >
                        <span class="text-body-2">
                          Product
                          <span style="color: red">`{{ errorMessage }}`</span>
                          must be Unique*
                        </span>
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1 white--text" @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="teal darken-1 white--text"
                  :disabled="$v.$invalid"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1 white--text" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="teal darken-2 white--text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.stock_price`]="{ item }">
        <span>{{ item.stock_price | currency("GH¢") }}</span>
      </template>
      <template v-slot:[`item.sales_price`]="{ item }">
        <span>{{ item.sales_price | currency("GH¢") }}</span>
      </template>
      <template v-slot:[`item.category_id`]="{ item }">
        <span>{{ getCategoryName(item.category_id) }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          id="editbutton"
          small
          class="mr-2"
          color="teal editbutton"
          alt-labels="Edit"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon id="deletebutton" small color="red" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  required,
  minLength,
  minValue,
  decimal,
} from "vuelidate/lib/validators";
import moment from "moment";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "#", value: "numbering" },
      {
        text: "Product Description",
        align: "start",
        sortable: true,
        value: "description",
      },
      {
        text: "Sales Price (GH¢)",
        sortable: true,
        value: "sales_price",
      },
      {
        text: "Stock Price (GH¢)",
        sortable: true,
        value: "stock_price",
      },
      {
        text: "Category",
        sortable: true,
        value: "category_id",
      },
      {
        text: "Created At",
        value: "date_created",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    search: "",

    productIndex: -1,
    productItem: {
      description: "",
      sales_price: 0,
      stock_price: 0,
      category_id: 1,
      date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
    },
    defaultItem: {
      description: "",
      sales_price: 0,
      stock_price: 0,
      category_id: 1,
      date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
    },
  }),

  validations: {
    productItem: {
      description: {
        required,
        minLength: minLength(3),

        // async uniqueName(value) {
        //   if (value === null) return true;
        //   const products = this.products;
        //   const nameAlreadyExist = products.find(
        //     (product) =>
        //       product.description.toLowerCase() === value.toLowerCase()
        //   );
        //   if (nameAlreadyExist) {
        //     return false;
        //   }
        //   return true;
        // },
      },
      stock_price: {
        required,
        decimal,
        minValue: minValue(0),
      },
      sales_price: {
        required,
        decimal,
        minValue: minValue(0),
      },
      category_id: {
        required,
      },
    },
  },

  computed: {
    errorMessage() {
      return this.$store.state.products.error;
    },
    products() {
      return this.$store.state.products.products;
    },
    categories() {
      return this.$store.state.categories.categories;
    },
    formTitle() {
      return this.productIndex === -1 ? "New Product" : "Edit Product";
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.productItem.description.$dirty) return errors;
      !this.$v.productItem.description.minLength &&
        errors.push("Product description must be atleast 3 characters*");
      !this.$v.productItem.description.required &&
        errors.push("Product description is required*");
      //   !this.$v.productItem.description.uniqueName &&
      //     errors.push("Product description already Exist*");
      return errors;
    },
    stockPriceErrors() {
      const errors = [];
      if (!this.$v.productItem.stock_price.$dirty) return errors;
      !this.$v.productItem.stock_price.decimal &&
        errors.push("Stock price value is INVALID*");
      !this.$v.productItem.stock_price.required &&
        errors.push("stock price is required*");
      !this.$v.productItem.stock_price.minValue &&
        errors.push("stock price can't be less than 0 *");
      return errors;
    },
    salesPriceErrors() {
      const errors = [];
      if (!this.$v.productItem.sales_price.$dirty) return errors;
      !this.$v.productItem.sales_price.decimal &&
        errors.push("Sales price value is INVALID*");
      !this.$v.productItem.sales_price.required &&
        errors.push("Sales price is required*");
      !this.$v.productItem.sales_price.minValue &&
        errors.push("Sales price can't be less than 0 *");
      return errors;
    },
    categoryErrors() {
      const errors = [];
      if (!this.$v.productItem.category_id.$dirty) return errors;
      !this.$v.productItem.category_id.required &&
        errors.push("Category is required*");
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
  },

  created() {
    // this.loadProducts();
    // this.loadCategories();
  },

  methods: {
    async loadProducts() {
      await this.$store.dispatch("products/fetchProducts");
    },
    async loadCategories() {
      await this.$store.dispatch("categories/fetchCategories");
    },
    getCategoryName(item) {
      let category_name = this.$store.state.categories.categories
        .filter((category) => category.id == item)
        .map((category) => category.name);
      return category_name[0];
    },
    editItem(item) {
      this.productIndex = this.products.indexOf(item);
      this.productItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.productIndex = this.products.indexOf(item);
      this.productItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.$store.state.products.products.splice(this.productIndex, 1);
      await this.$store.dispatch("products/deleteProduct", this.productItem);
      this.closeDelete();
    },

    close() {
      this.$v.$reset();
      this.$store.state.products.error = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.productItem = Object.assign({}, this.defaultItem);
        this.productIndex = -1;
      });
    },

    closeDelete() {
      this.$v.$reset();
      this.$store.state.products.error = "";
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.productItem = Object.assign({}, this.defaultItem);
        this.productIndex = -1;
      });
    },

    async save() {
      if (this.productIndex > -1) {
        await this.$store.dispatch("products/updateProduct", this.productItem);
        this.loadProducts();
        if (this.$store.state.products.error == "") {
          this.close();
        }
      } else {
        await this.$store.dispatch("products/createProduct", this.productItem);
        this.$v.$reset();
        this.loadProducts();
      }
    },
  },
};
</script>
<style scoped>
.mytable tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.flex-table {
  height: 50px;
}
.flex-table.row:nth-of-type(2n) {
  background: rgb(238, 238, 238);
}

/* .flex-table.v-text-field input {
    padding: 2px 0 2px 0px;
  }
  tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
  }
  table thead{
    font-weight: bolder;
    background-color: black;
  } */
</style>
