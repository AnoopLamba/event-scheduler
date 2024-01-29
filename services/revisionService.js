import axios from "axios";

// const URL = "http://localhost:4000/api/v1/revision";
const URL = "https://revisionscheduler.onrender.com/api/v1/revision";

// function to add new revision
async function addRevision(data) {
  const response = await axios.post(`${URL}/add`, data);
  return response.data;
}

// function to get all revisions
async function getRevisions() {
  const response = await axios.get(`${URL}/all`);
  return response.data;
}

// function to get one revision
async function getOneRevision(id) {
  const response = await axios.get(`${URL}/all/${id}`);
  return response.data;
}

// function to update revision
async function updateRevision(id, data) {
  const response = await axios.put(`${URL}/update/${id}`, data);
  return response.data;
}

// function to delete revision
async function deleteRevision(id) {
  const response = await axios.delete(`${URL}/delete/${id}`);
  return response.data;
}

const revisionService = {
  addRevision,
  getRevisions,
  getOneRevision,
  updateRevision,
  deleteRevision,
};
export default revisionService;
