"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contextProvider";
import style from "@/css/roles/roles.module.scss";
import { addRole } from "@/controllers/role";
import messages from "@/utils/messages";
import { roleValidation } from "@/utils/formValidation";
import { getConstant } from "@/utils/utils";
import { roleTypesList } from "@/utils/masterData";
import MenuListCheckbox from "@/components/roles/menuListCheckbox";
import { useCheckboxHandler } from "./checkboxHandler";
import { useSession } from "next-auth/react";

export default function AddRole({ menuList }) {
  const { data: session } = useSession();

  const defaultFormData = {
    role_name: "",
    role_type: "",
    permissions: [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formValidation = {
    role_name: register("role_name", roleValidation.role_name),
    role_type: register("role_type", roleValidation.role_type),
  };

  const router = useRouter();
  const { showAlert } = useContext(AppContext);
  const [formData, setFormData] = useState(defaultFormData);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.className += " hamburgerHide";

    return () => {
      document.body.className = document.body.className.replace(
        "hamburgerHide",
        "",
      );
    };
  }, []);

  const flattenMenuList = (menu, permissions) => {
    const menuItems = [];

    menu.forEach((subMenu) => {
      subMenu.forEach((item) => {
        // Push the main item with checked status
        menuItems.push({
          ...item,
          checked: permissions.includes(item.menu_id),
          // Ensure nested menus have checked status
          menus: item.menus.map((nestedItem) => ({
            ...nestedItem,
            checked: permissions.includes(nestedItem.menu_id),
          })),
        });
      });
    });

    return menuItems;
  };

  const { menuItems, handleCheckboxChange, checkIfAllNestedChecked } =
    useCheckboxHandler(flattenMenuList(menuList, formData.permissions));

  const updateSelectedForm = (key, value) => {
    let temp = { ...formData };
    temp[key] = value;
    setFormData(temp);
  };

  const collectCheckedIds = (items) => {
    let ids = [];
    items.forEach((item) => {
      if (item.checked) {
        ids.push(item.menu_id);
      }
      if (item.menus.length > 0) {
        ids = ids.concat(collectCheckedIds(item.menus));
      }
    });
    return ids;
  };

  const handleFormSubmit = async () => {
    const checkedIds = collectCheckedIds(menuItems);
    const permissionsString = checkedIds.join(",");
    const payload = {
      ...formData,
      permissions: permissionsString,
    };

    setIsLoading(true);

    const response = await addRole(session.user, payload);

    console.log("response", response);
    setIsLoading(false);

    if (response.success) {
      showAlert(messages.ROLE_ADDED, 1);
      router.push("/roles");
    } else {
      // setIsLoading(false);
      showAlert(response.msg);
    }
  };

  const inputMaxLength = getConstant("INPUT_MAXLENGTH");

  const midpoint = Math.floor(menuItems.length / 2) + 1;
  const firstHalf = menuItems.slice(0, midpoint);
  const secondHalf = menuItems.slice(midpoint);

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={style.addmember}>
          <div className={style.memtoppanel}>
            <div className={style.sechead}>Role Details</div>
            <div className={style.brdtop}>
              <div className={style.detlcol}>
                <label>Role Type</label>
                <div className={style.customselect}>
                  <select
                    {...formValidation.role_type}
                    name="role_type"
                    id="role_type"
                    value={formData.role_type}
                    onChange={(e) => {
                      formValidation.role_type.onChange(e);
                      updateSelectedForm("role_type", e.target.value);
                    }}
                  >
                    <option value="" disabled="disabled">
                      Select
                    </option>
                    {roleTypesList.map((x, i) => (
                      <option key={i} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                  {errors?.role_type && (
                    <span className={style.logerror}>
                      {errors.role_type?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={style.detlcol}>
                <label>Role Name</label>
                <div className={style.inptrel}>
                  <input
                    {...formValidation.role_name}
                    type="text"
                    name="role_name"
                    id="role_name"
                    value={formData.role_name}
                    placeholder="Enter Role Name"
                    onChange={(e) => {
                      formValidation.role_name.onChange(e);
                      updateSelectedForm("role_name", e.target.value);
                    }}
                    maxLength={inputMaxLength}
                  />
                  {errors?.role_name && (
                    <span className={style.logerror}>
                      {errors.role_name?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={style.memtoppanel}>
            <div className={style.sechead}>Rights</div>
            <div className={style.brdright}>
              <div className={style.gridcolsec2}>
                <div className={style.gridcol1}>
                  <ul>
                    {firstHalf.map((item) => (
                      <MenuListCheckbox
                        key={item.menu_id}
                        item={item}
                        handleCheckboxChange={handleCheckboxChange}
                        checkIfAllNestedChecked={checkIfAllNestedChecked}
                      />
                    ))}
                  </ul>
                </div>

                <div className={style.gridcol2}>
                  <ul>
                    {secondHalf.map((item) => (
                      <MenuListCheckbox
                        key={item.menu_id}
                        item={item}
                        handleCheckboxChange={handleCheckboxChange}
                        checkIfAllNestedChecked={checkIfAllNestedChecked}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={style.btnWrapper}>
            <div className={style.createdBy}></div>
            <div className={style.btnInner}>
              <Link href="/roles">
                <button type="button" className="commonBtn borderBtn">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="commonBtn dark"
                disabled={isLoading}
              >
                {isLoading ? getConstant("LOADING_TEXT") : "Add"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
