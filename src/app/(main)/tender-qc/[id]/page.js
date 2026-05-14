import { redirect } from "next/navigation";
import { getTenderQcDetails, updateTenderQcData } from "@/controllers/tenderQc";
import TenderQcEditForm from "@/components/tenderQc/tenderQcDetail/edit";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import { getFinancierList } from "@/controllers/tender";
import { checkPermission } from "@/controllers/permission";
import { formatCategoryData } from "@/utils/utils";
import catJson from "@/utils/categoryJson";

export const metadata = {
  title: "Edit Tender QC",
};

export default async function TenderQcDetailPage({ params }) {
  const { id } = params;
  const isAllow = await checkPermission("/tender-qc");
  if (!isAllow) redirect("/");

  const [tenderQcResponse, financierList] = await Promise.all([
    getTenderQcDetails(id),
    getFinancierList(),
  ]);

  async function updateTenderQc(formData) {
    "use server";
    return await updateTenderQcData(formData.id, {
      tender_title: formData.tender_title,
      tender_description: formData.tender_description,
      tender_number: formData.tender_number,
      tender_financier: formData.tender_financier,
      tender_end_date: formData.tender_end_date,
      tender_organisation: formData.tender_organisation,
      tender_purchaser_address: formData.tender_purchaser_address,
      tender_emd: formData.tender_emd,
      tender_country: formData.tender_country.toUpperCase(),
      tender_state: formData.tender_state.toUpperCase(),
      tender_city: formData.tender_city.toUpperCase(),
      "llm_extracted_data.basic_info.main_category": formData.main_category,
      "llm_extracted_data.basic_info.sub_category": formData.sub_category,
      "llm_extracted_data.basic_info.generated_title": formData.tender_title,
      "llm_extracted_data.basic_info.summary": formData.tender_description,
      "llm_extracted_data.financial.estimated_bid_value.amount":
        formData.estimated_bid_value,
      "llm_extracted_data.organization.department":
        formData.tender_organisation,
    });
  }

  if (!tenderQcResponse.success) {
    redirect("/tender-qc");
  }

  let catData = formatCategoryData(catJson);

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/tender-qc">
            <CustomImage
              src={webBackArrowIcon}
              className="web"
              width="20"
              height="18"
            />
            <CustomImage
              src={mobileBackArrowIcon}
              className="mweb"
              width="9"
              height="15"
            />
          </Link>
          <h1>Tender QC Details Edit Page</h1>
          <div className="subscriberName">
            <span>{tenderQcResponse.data.teb_number}</span>
          </div>
        </div>
      </div>
      <TenderQcEditForm
        tenderQcDetails={tenderQcResponse.data}
        tenderQcId={id}
        updateTenderQc={updateTenderQc}
        catData={catData}
        financierList={financierList}
      />
    </>
  );
}
