import Invoice from "../models/Invoices";
import InvoiceItem from "../models/InvoiceItems";

InvoiceItem.createTable();
Invoice.createTable();

async function saveData(_, data) {
  try {
    const res = await Invoice.insert(data);
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function updateData(_, data) {
  try {
    let res = await Invoice.update(data);
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function getOne(_, data) {
  try {
    const res = await Invoice.getOne(data);
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function loadData(_, data) {
  try {
    const res = await Invoice.getAll();
    data = res;
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function deleteData(_, data) {
  try {
    let res = await Invoice.delete(data);
  } catch (error) {
    console.log(error);
  }
}

export { saveData, loadData, updateData, getOne, deleteData };
