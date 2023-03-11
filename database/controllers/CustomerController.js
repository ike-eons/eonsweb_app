import Customer from "../models/Customers";

async function saveData(_, data) {
  try {
    const customer = await Customer.insert(data);
    return customer;
  } catch (e) {
    console.log(e.message);
  }
}
async function updateData(_, data) {
  try {
    let Customer = await Customer.update(data);
    return customer;
  } catch (e) {
    console.log(e.message);
  }
}

async function loadData(_, data) {
  try {
    const res = await Customer.getAll();
    data = res;
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function deleteData(_, data) {
  try {
    const res = await Customer.delete(data);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

export { saveData, loadData, updateData, deleteData };
