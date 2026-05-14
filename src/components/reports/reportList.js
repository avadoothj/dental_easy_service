"use client";

import { useState, useRef, useEffect } from "react";
import CustomDataTable from "@/common/customDatatable";
import { getUserList, getUserWiseLog } from "@/controllers/reportController";
import { Accordion } from "react-bootstrap";
import style from "@/css/reports/ledger.module.scss";
import style1 from "@/styles/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";
import { useForm } from "react-hook-form";
import CustomDatepicker from "@/common/customDatepicker";
import { currentDate } from "@/utils/dateHelper";

export default function ReportList({ user_id }) {
  const todaysDate = currentDate();
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [actions, setActions] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [action1, setAction1] = useState("view");
  const [selectedUser, setSelectedUser] = useState("");
  const [usersList, setUsersList] = useState([]);

  const { handleSubmit } = useForm();

  const customOrder = ["add", "edit", "delete", "draft", "approve", "reject"];

  useEffect(() => {
    getUserList().then((res) => {
      if (res.success) {
        setUsersList(res.list);
      }
    });
  }, []);

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, [user_id]);

  const getColumnTotal = (actionKey) => {
    return list.reduce((sum, item) => sum + (Number(item[actionKey]) || 0), 0);
  };

  const handleFormSubmit = async () => {
    const payload = {
      user_id: selectedUser || user_id,
      from_date: fromDate,
      to_date: toDate,
    };

    if (action1 === "view") {
      childRef.current?.reloadData(payload);
    } else {
      try {
        await getUserWiseLog(payload);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedUser("");

    if (childRef.current) {
      childRef.current.reloadData();
    }
  };

  const fromDateChange = (date) => {
    if (toDate && date > toDate) {
      setToDate(date);
    }
    setFromDate(date);
  };

  const toDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setFromDate(date);
    }
    setToDate(date);
  };

  return (
    <>
      <Accordion className="accordionWrap">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advance Filters</Accordion.Header>
          <Accordion.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className={style.addmember}>
                <div className="row">
                  <div className={style1.couponRow + " col-md-4 mb-3"}>
                    <label>From Date</label>
                    <div
                      className={
                        style1.inputsWrap + " inputsWrap inputsWidth w-100"
                      }
                    >
                      <CustomDatepicker
                        value={fromDate}
                        callback={fromDateChange}
                        maxDate={todaysDate}
                      />
                    </div>
                  </div>

                  <div className={style1.couponRow + " col-md-4 mb-3"}>
                    <label>To Date</label>
                    <div
                      className={
                        style1.inputsWrap + " inputsWrap inputsWidth w-100"
                      }
                    >
                      <CustomDatepicker
                        value={toDate}
                        callback={toDateChange}
                        maxDate={todaysDate}
                      />
                    </div>
                  </div>

                  <div className={style1.couponRow + " col-md-4 mb-3"}>
                    <label>Select User</label>
                    <div
                      className={
                        style.customselect + " inputsWrap inputsWidth w-100"
                      }
                    >
                      <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">Current User</option>
                        {usersList.map((u) => (
                          <option key={u.user_id} value={u.user_id}>
                            {u.user_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={commonStyle.formBtnWrap}>
                  <button
                    type="submit"
                    className={commonStyle.commonBtn}
                    disabled={isLoading}
                    onClick={() => setAction1("view")}
                  >
                    View Results
                  </button>
                  <button
                    type="button"
                    className={commonStyle.commonBtn + " " + commonStyle.stroke}
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <br />

      <CustomDataTable
        apiCall={async (params) => {
          const payload = {
            user_id: selectedUser || user_id,
            ...params,
          };

          const res = await getUserWiseLog(payload);

          if (res.success) {
            const sortedActions = (res.actions || []).sort((a, b) => {
              let indexA = customOrder.indexOf(a.toLowerCase());
              let indexB = customOrder.indexOf(b.toLowerCase());

              if (indexA === -1) indexA = 99;
              if (indexB === -1) indexB = 99;

              return indexA - indexB;
            });

            setList(res.list || []);
            setActions(sortedActions);

            return { ...res, actions: sortedActions };
          } else {
            setList([]);
            setActions([]);
            return res;
          }
        }}
        setData={setList}
        setSrNo={setSrNo}
        columns={["SL NO", "Module", ...actions.map((a) => a.toUpperCase())]}
        ref={childRef}
      >
        {list.map((item, index) => (
          <tr key={index}>
            <td>{srNo + index}</td>
            <td>{item.module}</td>
            {actions.map((action) => (
              <td key={action}>{item[action] || 0}</td>
            ))}
          </tr>
        ))}

        {list.length > 0 && (
          <tr>
            <td></td>
            <td>TOTAL</td>
            {actions.map((action) => (
              <td key={`total-${action}`}>{getColumnTotal(action)}</td>
            ))}
          </tr>
        )}
      </CustomDataTable>
    </>
  );
}
