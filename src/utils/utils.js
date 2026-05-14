import moment from "moment-timezone";
import { constantsList } from "../../constants";
import CryptoJS from "crypto-js";
import { statusCodes } from "./validationErrorCodes";
// import { TABLE_LIST } from "./lib/tablesList";
// import { db } from "./lib/database";

export const getConstant = (key) => {
  return constantsList[key.toUpperCase()] ?? null;
};

export const infoLogger = (message, data = "") => {
  if (typeof data == "object") {
    if (data.api_token) data.api_token = "***";
    data = JSON.stringify(data);
  }
  console.log("Info", message, data);
};

export const errorLogger = (message, data = "") => {
  if (typeof data == "object") {
    if (data.api_token) data.api_token = "***";
    data = JSON.stringify(data);
  }
  console.log("Error", message, data);
};

export const formatPrice = (price, decimals = 2, showSymbol = true) => {
  if (price) {
    const options = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    const formatted = Number(price).toLocaleString("en-IN", options);
    return (showSymbol ? "₹ " : "") + formatted.replace(".00", "");
  } else {
    return (showSymbol ? "₹ " : "") + "0";
  }
};

export const formatNumber = (price, decimals = 0) => {
  if (price || price == 0) {
    const options = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    return Number(price).toLocaleString("en-IN", options).replace(".00", "");
  } else {
    return "-";
  }
};

export const formatDate = (date, type = 1) => {
  let formattedDate = "";
  if (type == 1) {
    formattedDate = moment(date).format("DD-MM-YYYY");
  } else if (type == 2) {
    formattedDate = moment(date).format("DD-MM-YYYY hh:mm A");
  } else if (type == 3) {
    formattedDate = moment(date).format("YYYY-MM-DD");
  } else if (type == 4) {
    formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  } else if (type == 5) {
    formattedDate = moment(date).format("DD MMMM YYYY");
  } else if (type == 6) {
    formattedDate = moment(date).format("DD MMMM, YYYY - hh:mm A");
  } else if (type == 7) {
    formattedDate = moment(date).format("MMM-DD");
  } else if (type == 8) {
    formattedDate = moment(date).format("DD MMM YYYY");
  } else if (type == 9) {
    formattedDate = moment(date).format("DD MMM");
  }

  return formattedDate.toLowerCase() != "invalid date" ? formattedDate : "-";
};

export const setCookie = (name, value, minutes) => {
  let expires = "";
  if (minutes) {
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; secure=true";
};

export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const showPlanDuration = (item) => {
  return (
    item.interval +
    " " +
    (item.interval == 1
      ? item.interval_unit.replace(/s$/, "")
      : item.interval_unit)
  );
};

export const stringReplace = (string, variables) => {
  Object.keys(variables).forEach(function (key) {
    string = string.replace(key, variables[key], string);
  });
  return string;
};

export const getUniqueKey = (length = 12) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(
    password,
    process.env.NEXT_PUBLIC_LOGIN_PASSWORD_SECRET_KEY,
  ).toString();
};

export const arrayUnique = (array) => {
  return array.filter(function (el, index, arr) {
    return index == arr.indexOf(el);
  });
};

export const toPascalCase = (str) => {
  return str
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const downloadFileFromBlob = (data, fileName, withTimestamp = true) => {
  const downloadFileName = `${fileName}_${moment().format("YYYYMMDDHHmmss")}${Math.floor(
    Math.random() * 100 + 1,
  )}.csv`;

  const url = window.URL.createObjectURL(
    new Blob([data], { type: "text/plain" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = withTimestamp ? downloadFileName : fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const processApiResponse = (response) => {
  const finalResponse = {
    code: 200,
    httpCode: 200,
    status: response.success,
    message: response.msg,
    ...response,
  };

  finalResponse.httpCode = statusCodes.httpCodes[finalResponse.code];
  finalResponse.code = parseInt(finalResponse.code);

  delete finalResponse.success;
  delete finalResponse.statusCode;
  delete finalResponse.msg;

  return finalResponse;
};

export const dataTableSelectAllHandle = (data, selectedList, itemId) => {
  if (itemId == "all") {
    data.map((x) => {
      if (!selectedList.includes(x.item_id)) {
        selectedList.push(x.item_id);
      }
    });
  } else if (itemId == "none") {
    data.map((x) => {
      const tempIndex = selectedList.indexOf(x.item_id);
      if (tempIndex >= 0) {
        selectedList.splice(tempIndex, 1);
      }
    });
  } else {
    const tempIndex = selectedList.indexOf(itemId);
    if (tempIndex >= 0) {
      selectedList.splice(tempIndex, 1);
    } else {
      selectedList.push(itemId);
    }
  }

  return selectedList;
};

export const stripMetadata = async (file) => {
  // Read the uploaded image file
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Draw image to canvas
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Re-encode image without metadata
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 1.0),
  );

  // Return a clean File/Blob (visually identical)
  return new File([blob], file.name.replace(/\.[^.]+$/, ".png"), {
    type: "image/png",
  });
};

export function formatIndianNumber(num) {
  if (num === null) return null;
  if (num >= 1_00_00_000) {
    return `${(num / 1_00_00_000).toFixed(2)} Crores`;
  }

  if (num >= 1_00_000) {
    return `${(num / 1_00_000).toFixed(2)} Lakhs`;
  }

  return num?.toString();
}

export const cleanTenderTitle = (text = "") => {
  if (!text || text === "#NAME?") return "";

  return (
    text
      .replace(/\\"/g, '"') // remove escaped quotes
      .replace(/^"+|"+$/g, "") // remove starting/ending quotes
      .replace(/\u00A0/g, " ") // remove non-breaking space
      .replace(/^\s*\d+\.\s*/, "") // remove numbering like "1."
      .replace(/^[^a-zA-Z0-9(]+/, "") // remove junk prefix (-, ", etc.)
      // .replace(/^[A-Z0-9-]+-/, "")         // remove codes like ST921084-ADANI-
      .replace(/\s+/g, " ") // normalize spaces
      .trim()
  );
};

export const formatForDateTimeLocal = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const convertDateToISO = (date) => {
  if (!date) return "";

  const localDate = new Date(date);

  localDate.setHours(17, 0, 0, 0);

  return localDate.toISOString();
};

export const dateIOSConverter = (input) => {
  const date = new Date(input);
  const formatted = `${String(date.getUTCDate()).padStart(2, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${date.getUTCFullYear()}`;
  return formatted;
};

// export const formatDateOnly = (date) => {
// 	if (!date) return "";
// 	return new Date(date).toISOString().split("T")[0];
// };

export const formatDateOnly = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA");
};

export const getFileUrl = (filePath) => {
  if (!filePath) return "#";

  const normalizedPath = filePath.replace(/\\/g, "/");
  const publicPathIndex = normalizedPath.lastIndexOf("/public/");
  const relativePath =
    publicPathIndex >= 0
      ? normalizedPath.slice(publicPathIndex + "/public/".length)
      : normalizedPath.replace(/^\/+/, "");

  return `/download-media?path=${encodeURIComponent(relativePath)}`;
};

export const dataTrim = (item) => {
  let mainData = item?.length > 20 ? item.slice(0, 20) + "..." : item;
  return mainData;
};

export const formatCategoryData = (data) => {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => ({
      category: typeof item.category === "string" ? item.category : "",
      subcategories: Array.isArray(item.subcategories)
        ? [...item.subcategories].sort((a, b) => a.localeCompare(b))
        : [],
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
};
