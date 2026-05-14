import moment from "moment-timezone";
import { DB_TIME_FORMAT } from "./lib/constants";
import { queryGenerator } from "./lib/queryGenerator";
import { TABLE_LIST } from "./lib/tablesList";
import { db } from "./lib/database";

const normalizeArray = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  return [];
};
const compareArrays = (arr1, arr2) => {
  const onlyInArray1 = arr1.filter(
    (item1) => !arr2.some((item2) => item1.bouquet_code === item2.bouquet_code),
  );

  const onlyInArray2 = arr2.filter(
    (item2) => !arr1.some((item1) => item1.bouquet_code === item2.bouquet_code),
  );

  const inBoth = arr1.filter((item1) =>
    arr2.some((item2) => item1.bouquet_code === item2.bouquet_code),
  );

  return { onlyInArray1, onlyInArray2, inBoth };
};

export const saveLog = function (data) {
  const {
    module,
    action,
    user_id,
    item_id,
    payload = {},
    source = "web",
    previous = null,
    updated = null,
  } = data;

  const changedData = {};
  if (previous != null) {
    if (
      updated != null &&
      (action == "sync_plan" || action == "sync_plan_bulk")
    ) {
      // const result = compareArrays(previous, updated);
      const result = compareArrays(
        normalizeArray(previous),
        normalizeArray(updated),
      );

      changedData.updated = {};
      changedData.removed = result.onlyInArray1;
      changedData.added = result.onlyInArray2;

      result.inBoth.map((x) => {
        const tempPrev = previous.filter(
          (y) => x.bouquet_code == y.bouquet_code,
        );
        const tempUpdate = updated.filter(
          (y) => x.bouquet_code == y.bouquet_code,
        );

        if (tempPrev.length > 0 && tempUpdate.length > 0) {
          Object.keys(tempPrev[0]).map((y) => {
            if (
              typeof tempPrev[0][y] != "undefined" &&
              tempPrev[0][y] != tempUpdate[0][y]
            ) {
              if (typeof changedData.updated[x.bouquet_code] == "undefined") {
                changedData.updated[x.bouquet_code] = {};
              }

              changedData.updated[x.bouquet_code][y] = {
                previous: tempPrev[0][y],
                changed: tempUpdate[0][y],
              };
            }
          });
        }
      });
    } else {
      Object.keys(payload).map((x) => {
        if (typeof previous[x] != "undefined" && previous[x] != payload[x]) {
          changedData[x] = { previous: previous[x], changed: payload[x] };
        }
      });
    }
  }

  const insertQuery = queryGenerator.generateInsertQuery(
    {
      module: module,
      action: action,
      user_id: user_id,
      item_id: item_id,
      payload: JSON.stringify(payload),
      previous_data: previous != null ? JSON.stringify(previous) : null,
      changed_data: previous != null ? JSON.stringify(changedData) : null,
      source: source.toLowerCase(),
      inserted_date: moment().format(DB_TIME_FORMAT),
    },
    TABLE_LIST.AUDIT_LOGS,
  );

  db.none(insertQuery)
    .then((result) => {})
    .catch((error) => {
      console.error("saveLog: " + error);
    });
};
