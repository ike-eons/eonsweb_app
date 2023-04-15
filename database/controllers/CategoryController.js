import Category from "../models/Categories";

Category.createTable();

async function saveData(_, data) {
  try {
    const category = await Category.insert(data);

    return category;
  } catch (e) {
    return { error: e.user_message };
  }
}
async function updateData(_, data) {
  try {
    let cat = await Category.update(data);
    return cat;
  } catch (e) {
    console.log(e.message);
  }
}

async function getOne(_, data) {
  try {
    const category = await Category.getOne(data);
    return category;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function loadData(_, data) {
  try {
    const res = await Category.getAll();
    data = res;

    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function deleteData(_, data) {
  try {
    await Category.delete(data);
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

export { saveData, loadData, updateData, getOne, deleteData };
