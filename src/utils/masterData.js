import { startOfDay, endOfDay, subDays } from "date-fns";
import moment from "moment-timezone";

export const sortList = [
  { id: "created_desc", label: "Created Date (Latest first)" },
  { id: "created_asc", label: "Created Date (Oldest first)" },
  { id: "name_asc", label: "Alphabetical (A to Z)" },
  { id: "name_desc", label: "Alphabetical (Z to A)" },
];

export const loginPageSliderImg = [
  {
    img: "/images/login/slide1.png",
    desc: "",
  },
  {
    img: "/images/login/slide2.png",
    desc: "",
  },
  {
    img: "/images/login/slide3.png",
    desc: "",
  },
];

export const roleTypesList = [
  { id: "1", label: "Admin" },
  { id: "2", label: "User" },
];

export const teamStatusList = [
  { id: "all", label: "All" },
  { id: "block", label: "Blocked" },
  { id: "permanent_block", label: "Permanent blocked" },
];

export const predefinedDateRanges = [
  {
    id: moment().format("YYYY-MM-DD") + ":" + moment().format("YYYY-MM-DD"),
    label: "Today",
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    id:
      moment().subtract(1, "days").format("YYYY-MM-DD") +
      ":" +
      moment().subtract(1, "days").format("YYYY-MM-DD"),
    label: "Yesterday",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    id:
      moment().subtract(7, "days").format("YYYY-MM-DD") +
      ":" +
      moment().format("YYYY-MM-DD"),
    label: "Last 7 days",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 6)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    id:
      moment().subtract(30, "days").format("YYYY-MM-DD") +
      ":" +
      moment().format("YYYY-MM-DD"),
    label: "Last 30 days",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 29)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    id:
      moment().subtract(90, "days").format("YYYY-MM-DD") +
      ":" +
      moment().format("YYYY-MM-DD"),
    label: "Last 90 days",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 89)),
      endDate: endOfDay(new Date()),
    }),
  },
];

export const siteVisitStatus = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "visit", label: "Visit" },
  { id: "today", label: "Today Site Visit" },
  { id: "changes", label: "Changes" },
  { id: "no_change", label: "No Change" },
];

export const tenderStatus = [
  { id: "", label: "ALL" },
  { id: "filtered", label: "Filtered" },
  { id: "draft", label: "Draft" },
  { id: "pendingForApproval", label: "Pending For Approval" },
  { id: "published", label: "Published" },
  { id: "rejected", label: "Rejected" },
];

export const TEMPLATE_FIELD = [
  "tender_number",
  "tender_title",
  "tender_description",
  "main_category",
  "sub_category",
  "tender_publishing_date",
  "tender_start_date",
  "tender_end_date",
  "ministry_name",
  "tender_organisation",
  "tender_purchaser_name",
  "tender_purchaser_address",
  "tender_country",
  "tender_state",
  "tender_city",
  "tender_pincode",
  "tender_email_id",
  "tender_website",
  "tender_documents_path",
  "source_tag",
  "tender_office_name",
  "department",
  "tender_bidding_type",
  "tender_value",
  "tender_emd",
  "tender_financier",
  "tender_type",
  "tender_contract_type",
  "tender_category",
  "tender_evaluation",
  "tender_procurement_process",
  "tender_contact_person",
  "tender_contract_period",
  "required_documents",
];

export const TEMPLATE_SAMPLE_ROW = {
  tender_number: "TB-2026-001",
  tender_title: "Water Pipeline Development Work",
  tender_description: "Civil and pipeline work for zone 4",
  main_category: "Civil Works",
  sub_category: "Pipeline",
  tender_publishing_date: "2026-04-02",
  tender_start_date: "2026-04-01",
  tender_end_date: "2026-04-15",
  ministry_name: "Urban Affairs",
  tender_organisation: "Urban Development Department",
  tender_purchaser_name: "Procurement Officer",
  tender_purchaser_address: "Municipal Office, Ward 4",
  tender_country: "INDIA",
  tender_state: "GUJARAT",
  tender_city: "AHMEDABAD",
  tender_pincode: "380001",
  tender_email_id: "procurement@example.com",
  tender_website: "https://example.com/tender",
  tender_documents_path:
    "GeM-Bidding-9155956.pdf,Screenshot 2026-02-09 175739 (1).png",
  source_tag: "GEM",
  tender_office_name: "Ahmedabad Zone Office",
  department: "Engineering",
  tender_bidding_type: "NCB",
  tender_value: "1500000",
  tender_emd: "25000",
  tender_financier: "Self Financier",
  tender_type: "OPEN",
  tender_contract_type: "Tender Notice",
  tender_category: "Works",
  tender_evaluation: "L1 Ranking",
  tender_procurement_process: "Electronic Documents, First(One Cover)",
  tender_contact_person: "Rajesh Kumar",
  tender_contract_period: "90 Days",
  required_documents: "PAN & GSTIN,IT Returns",
  estimated_bid_value: "1500000",
};

export const subscriberStatusList = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "active", label: "Active" },
  { id: "scheduled", label: "Scheduled" },
  { id: "expired", label: "Expired" },
  { id: "suspended", label: "Suspended" },
  // { id: "processing", label: "Processing" },
];

export const subscriberStatusInfo = {
  active: "The subscription is active. Subscriber can access the content.",
  processing: "The subscription is being activated. Usually takes ~10mins",
  new: "The subscription was never activated for this user.",
  expired: "No active subscription",
  suspended: "The subscription has been paused.",
  scheduled: "No pack currently active. Pack scheduled for activation.",
};

export const SITEVISIT_FIELD = [
  "url_link",
  "country",
  "groups",
  "notice_type",
  "visit_priority",
  "process_type",
];

export const SITEVISIT_SAMPLE_ROW = {
  url_link: "https://example.com/site-visit",
  country: "INDIA",
  groups: "group B",
  notice_type: "tender notice",
  visit_priority: 1,
  process_type: "crawler",
};