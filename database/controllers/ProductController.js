import Product from "../models/Products";

Product.createTable();

async function saveData(_, data) {
  try {
    const product = await Product.insert(data);
    return product;
  } catch (e) {
    return { error: e.user_message };
  }
}

async function updateData(_, data) {
  try {
    const updateProduct = await Product.update(data);

    return updateProduct;
  } catch (e) {
    return { error: e.user_message };
  }
}

async function getOne(_, data) {
  try {
    const product = await Product.getOne(data);
    return product;
  } catch (e) {
    return e.message;
  }
}

async function loadData(_, data) {
  try {
    const res = await Product.getAll();
    data = res;
    return data;
  } catch (e) {
    return e.message;
  }
}

async function deleteData(_, data) {
  try {
    const res = await Product.delete(data);
    return res;
  } catch (e) {
    console.log(e.message);
    return e.message;
  }
}

export { saveData, loadData, updateData, getOne, deleteData };
