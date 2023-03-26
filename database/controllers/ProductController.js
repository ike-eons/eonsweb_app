import Product from "../models/Products";

Product.createTable();

async function saveData(_, data) {
  try {
    const product = await Product.insert(data);
    return product;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function updateData(_, data) {
  try {
    const product = await Product.update(data);
    return product;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function getOne(_, data) {
  try {
    const product = await Product.getOne(data);
    return product;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function loadData(_, data) {
  try {
    const allproducts = await Product.getAll();
    data = allproducts;
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function deleteData(_, data) {
  try {
    const res = await Product.delete(data);
    return res;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

export { saveData, loadData, updateData, getOne, deleteData };
