"use server";
import apiList from "@/utils/apiList";
import { callGetApi, callPostApi } from "@/utils/service";
import { revalidatePath } from "next/cache";

import axios from "axios";

export async function getPlan() {
  const res = await axios.get(
    `${process.env.CMS_FRONTEND_DOMAIN}/api/products?depth=0`,
    {
      headers: {
        Authorization: `api-tokens API-Key ${process.env.API_KEY_FRONTEND_DOMAIN}`,
      },
    },
  );

  return res.data;
}

export async function getPlanById(planId) {
  const res = await axios.get(
    `${process.env.CMS_FRONTEND_DOMAIN}/api/products/${planId}?depth=2`,
    {
      headers: {
        Authorization: `api-tokens API-Key ${process.env.API_KEY_FRONTEND_DOMAIN}`,
      },
    },
  );

  return res.data;
}

export async function getSubscribersList(params) {
  try {
    const { page = 1, limit = 4, search, depth = 0 } = params || {};

    const queryObj = {
      "where[and][0][roles][contains]": "customer",
      page: Number(page),
      limit: Number(limit),
      depth: Number(depth),
    };

    if (search) {
      queryObj["where[and][1][or][0][name][like]"] = search;
      queryObj["where[and][1][or][1][email][like]"] = search;
    }

    const res = await axios.get(
      `${process.env.CMS_FRONTEND_DOMAIN}/api/users?depth=2`,
      {
        params: queryObj,
        headers: {
          Authorization: `api-tokens API-Key ${process.env.API_KEY_FRONTEND_DOMAIN}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("getSubscribersList Error :", error.message);
    return { success: false };
  }
}

export async function getSubscribersCount() {
  return new Promise((resolve, reject) => {
    callGetApi(apiList.subscribers.getCount)
      .then(function (response) {
        resolve(response.success ? response.count : 0);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function addNewSubscriber(formData) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.add, formData)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getSubscriberDetails(subId) {
  try {
    const res = await axios.get(
      `${process.env.CMS_FRONTEND_DOMAIN}/api/users/${subId}?depth=2`,
      {
        headers: {
          Authorization: `api-tokens API-Key ${process.env.API_KEY_FRONTEND_DOMAIN}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("getSubscriberDetail Error :", error.message);
    return { success: false };
  }
}

export async function getNewPlan(formData) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.getNewPlan, formData)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getSubscriberHistoryNew(subId) {
  return new Promise((resolve, reject) => {
    callGetApi(apiList.subscribers.getNewHistory + subId)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getHistoryLog(subId) {
  return new Promise((resolve, reject) => {
    callGetApi(apiList.subscribers.getHistoryLog + subId)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function editSubscriber(formData) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.editSubscriber, formData)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + formData.sub_id);
        }
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function assignNewPlan(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.assignNewPlan, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }

        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function updateAutoRenewStatus(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.updateAutoRenewStatus, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }

        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function forcePlanCancel(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.forcePlanCancel, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }

        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function updateAutoRenewPlan(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.updateAutoRenewPlan, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }

        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function upgradePlan(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.upgradePlan, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }

        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function jioStarUpgradeRequest(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.jioStarUpgradeRequest, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function primeVideoUpgradeRequest(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.primeVideoUpgradeRequest, payload)
      .then(function (response) {
        if (response.success) {
          revalidatePath("/subscribers/details/" + payload.sub_id);
        }
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getRenewalIntentList(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.getRenewIntentRequest, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function processRenewIntentBulk(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.processRenewIntentBulk, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function checkOttActivationStatus(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.subscribers.checkOttActivationStatus, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
