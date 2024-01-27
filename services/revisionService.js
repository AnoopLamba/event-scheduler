import axios from "axios";

const URL = "http://localhost:4000/api/v1/revision";

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

const revisionService = { addRevision, getRevisions };
export default revisionService;
