<template>
  <v-data-table
    :fixed-header="true"
    :headers="headers"
    :search="search"
    :items="categories"
    sort-by="date_created"
    class="elevation-1 mytable"
  >
    <template v-slot:[`item.numbering`]="{ index }">
      {{ index + 1 }}
    </template>
    <template v-slot:top>
      <v-toolbar flat color="teal" dark>
        <v-toolbar-title>CATEGORIES</v-toolbar-title>
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
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <div class="btn-border">
              <v-btn
                color="white"
                class="mb-2 teal--text"
                v-bind="attrs"
                v-on="on"
              >
                <span class="font-weight-bold">+</span> New Category
              </v-btn>
            </div>
          </template>
          <v-card width="600">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      rows="3"
                      v-model="editedItem.name"
                      outlined
                      dense
                      label="Category name"
                      @input="$v.editedItem.name.$touch()"
                      @blur="$v.editedItem.name.$touch()"
                      :error-messages="nameErrors"
                    >
                    </v-textarea>
                  </v-col>

                  <v-col>
                    <v-alert
                      class="mt-n5"
                      dense
                      text
                      type="error"
                      v-show="errorMessage != ''"
                    >
                      <span class="text-body-2" style="color: red">
                        `{{ editedItem.name }}` already exist.
                      </span>
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
                Close
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
                >No</v-btn
              >
              <v-btn
                color="teal darken-2 white--text"
                @click="deleteItemConfirm"
                >Yes</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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

    <template v-slot:no-data>
      <v-btn color="teal" @click="loadCategories"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { minLength, required } from "vuelidate/lib/validators";
import moment from "moment";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: "",
    headers: [
      // { text: "#", value: "numbering", width: "50px" },
      { text: "#", value: "numbering" },
      {
        text: "Category Name",
        align: "start",
        sortable: true,
        value: "name",
      },

      {
        text: "Created At",
        value: "date_created",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],

    editedIndex: -1,
    editedItem: {
      name: "",

      date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
    },
    defaultItem: {
      name: "",

      date_created: moment().format("YYYY-MM-DD h:mm:ss a"),
    },
  }),

  computed: {
    errorMessage() {
      return this.$store.state.categories.error;
    },
    categories() {
      return this.$store.state.categories.categories;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Category" : "Edit Category";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("Category name is required*");
      !this.$v.editedItem.name.minLength &&
        errors.push("Category name must be atleast 3 characters*");
      // !this.$v.editedItem.name.uniqueName &&
      //   errors.push("Category name already Exist*");
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

  // VALIDATION OF FORM INPUTS
  validations: {
    editedItem: {
      name: {
        required,
        minLength: minLength(3),
      },
    },
  },

  created() {
    // this.loadCategories();
  },

  methods: {
    async loadCategories() {
      await this.$store.dispatch("categories/fetchCategories");
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.$store.state.categories.categories.splice(this.editedIndex, 1);
      await this.$store.dispatch("categories/deleteCategory", this.editedItem);
      this.closeDelete();
    },

    close() {
      this.$v.$reset();
      this.dialog = false;
      this.$store.state.categories.error = "";
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.$v.$reset();
      this.dialog = false;
      this.$store.state.categories.error = "";
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    // async save() {
    //   if (this.editedIndex > -1) {
    //     Object.assign(this.categories[this.editedIndex], this.editedItem);
    //     await this.$store.dispatch("categories/editCategory", this.editedItem);
    //     this.loadCategories();
    //   } else {
    //     this.$v.$touch();
    //     if (!this.$v.$invalid) {
    //       // ipcRenderer.send('categories:add', this.editedItem);
    //       await this.$store.dispatch(
    //         "categories/createCategory",
    //         this.editedItem
    //       );
    //       this.loadCategories();
    //       // this.categories.push(this.editedItem)
    //     }
    //   }
    //   this.close();
    // },

    async savedata() {
      console.log(this.editedItem);
      await this.$store.dispatch("categories/createCategory", this.editedItem);

      // Reset form validation
      this.$v.$reset();

      this.loadCategories();
    },

    async save() {
      if (this.editedIndex > -1) {
        // Object.assign(this.desserts[this.editedIndex], this.editedItem);
        console.log(this.editedItem);
        await this.$store.dispatch(
          "categories/updateCategory",
          this.editedItem
        );
        this.loadCategories();
        this.close();
      } else {
        await this.$store.dispatch(
          "categories/createCategory",
          this.editedItem
        );
        this.loadCategories();
        this.$v.$reset();
      }
    },
  },
};
</script>

<style>
/* th,
td {
  border-right: 1px solid #ccc;
} */

.mytable tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
