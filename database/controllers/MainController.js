async function createTable(Model) {
  try {
    await Model.createTable();
  } catch (error) {
    console.log(error.message);
  }
}

async function saveData(Model, _, data) {
  try {
    const modelInstance = await Model.insert(data);
    return modelInstance;
  } catch (e) {
    console.log(e.message);
  }
}

async function updateData(Model, _, data) {
  try {
    let modelInstance = await Model.update(data);
    return modelInstance;
  } catch (e) {
    console.log(e.message);
  }
}

async function getOne(Model, _, data) {
  try {
    const modelInstance = await Model.getOne(data);
    return modelInstance;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function loadData(Model, _, data) {
  try {
    const res = await Model.getAll();
    data = res;
    console.log(`********${Model.name} ****`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function deleteData(Model, _, data) {
  try {
    console.log(`${Model.name} controller deleting`);
    console.log(data);
    await Model.delete(data);
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

export { createTable, saveData, loadData, updateData, getOne, deleteData };
