"use server";

import { getProjectListData, projectList } from "@/controllers/api/project";

export async function getProjectList(params = {}) {
  // return getProjectListData(params);
  return projectList(params);
}
