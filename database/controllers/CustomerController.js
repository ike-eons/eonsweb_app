import Customer from "../models/Customers";

Customer.createTable();

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

async function getOne(_, data) {
  try {
    const customer = await Customer.getOne(data);
    return customer;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function loadData(_, data) {
  try {
    const res = await Customer.getAll();
    data = res;
    console.log("********customers ****");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function deleteData(_, data) {
  try {
    console.log("customer controller deleteing");
    console.log(data);
    await Customer.delete(data);
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

export { saveData, loadData, updateData, getOne, deleteData };
